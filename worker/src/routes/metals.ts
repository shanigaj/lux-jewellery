// GET /api/metals/rates — live gold & silver rates (₹/gram).
// Ported from server/src/controllers/metals.controller.ts. The in-memory
// stale-while-revalidate cache is replaced by Workers KV so the value is shared
// across isolates and survives restarts.
import { Hono } from "hono";
import type { AppEnv, Bindings } from "../lib/env";

const TROY_OZ_IN_GRAMS = 31.1035;
const CACHE_TTL_MS = 15 * 60 * 1000; // refresh at most every 15 minutes
const KV_KEY = "metals:rates";

interface MetalRates {
  currency: "INR";
  gold24k: number;
  gold22k: number;
  gold18k: number;
  silver: number;
  usdInr: number;
  source: "live" | "fallback";
  updatedAt: string;
}

// Indicative Indian retail rates (₹/gram) — used only if every live feed fails.
const FALLBACK: Omit<MetalRates, "updatedAt" | "source"> = {
  currency: "INR",
  gold24k: 15550,
  gold22k: 14250,
  gold18k: 11660,
  silver: 232,
  usdInr: 95,
};

async function fetchJson(url: string, ms = 8000): Promise<any | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function loadLiveRates(env: Bindings): Promise<MetalRates> {
  const [goldInr, xau, xag] = await Promise.all([
    fetchJson("https://api.goldprice.dev/v1/carat?currency=INR"),
    fetchJson("https://api.gold-api.com/price/XAU"),
    fetchJson("https://api.gold-api.com/price/XAG"),
  ]);

  const gold24k = goldInr ? Number(goldInr.price_gram_24k) : NaN;
  const gold22k = goldInr ? Number(goldInr.price_gram_22k) : NaN;
  const gold18k = goldInr ? Number(goldInr.price_gram_18k) : NaN;
  const xauUsdOz = xau ? Number(xau.price) : NaN;
  const xagUsdOz = xag ? Number(xag.price) : NaN;

  let usdInr = FALLBACK.usdInr;
  let silver = FALLBACK.silver;
  if (Number.isFinite(gold24k) && Number.isFinite(xauUsdOz) && xauUsdOz > 0) {
    usdInr = (gold24k * TROY_OZ_IN_GRAMS) / xauUsdOz;
    if (Number.isFinite(xagUsdOz)) silver = (xagUsdOz * usdInr) / TROY_OZ_IN_GRAMS;
  }

  const haveLive = Number.isFinite(gold24k) && Number.isFinite(xagUsdOz);

  // International spot → Indian retail: import duty + 3% GST + dealer premium (~15%).
  const premium = Number(env.INDIA_METAL_PREMIUM) || 1.155;
  const inr = (spot: number, fb: number) =>
    Number.isFinite(spot) ? Math.round(spot * premium) : fb;

  return {
    currency: "INR",
    gold24k: inr(gold24k, FALLBACK.gold24k),
    gold22k: inr(gold22k, FALLBACK.gold22k),
    gold18k: inr(gold18k, FALLBACK.gold18k),
    silver: inr(silver, FALLBACK.silver),
    usdInr: Math.round(usdInr * 100) / 100,
    source: haveLive ? "live" : "fallback",
    updatedAt: new Date().toISOString(),
  };
}

export const metals = new Hono<AppEnv>();

metals.get("/rates", async (c) => {
  const kv = c.env.CACHE;
  try {
    const cached = await kv.get<MetalRates>(KV_KEY, "json");
    if (cached) {
      // Stale-while-revalidate: serve instantly, refresh in the background if old.
      const age = Date.now() - Date.parse(cached.updatedAt);
      if (age >= CACHE_TTL_MS) {
        c.executionCtx.waitUntil(
          loadLiveRates(c.env).then((r) =>
            kv.put(KV_KEY, JSON.stringify(r), { expirationTtl: 86400 })
          )
        );
      }
      return c.json({ success: true, data: cached });
    }

    // Cold cache — load once (loadLiveRates never rejects).
    const rates = await loadLiveRates(c.env);
    c.executionCtx.waitUntil(
      kv.put(KV_KEY, JSON.stringify(rates), { expirationTtl: 86400 })
    );
    return c.json({ success: true, data: rates });
  } catch {
    return c.json({
      success: true,
      data: { ...FALLBACK, source: "fallback", updatedAt: new Date().toISOString() },
    });
  }
});
