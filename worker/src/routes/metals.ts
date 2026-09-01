// GET /api/metals/rates — live gold & silver rates (₹/gram).
// Ported from server/src/controllers/metals.controller.ts. The in-memory
// stale-while-revalidate cache is replaced by Workers KV so the value is shared
// across isolates and survives restarts.
import { Hono } from "hono";
import type { AppEnv, Bindings } from "../lib/env";

const TROY_OZ_IN_GRAMS = 31.1035;
const CACHE_TTL_MS = 5 * 60 * 1000; // recompute at most every 5 minutes (matches the UI's 5-min poll)
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
  gold24k: 16368,
  gold22k: 15004,
  gold18k: 12276,
  silver: 243,
  usdInr: 95,
};

async function fetchJson(url: string, ms = 8000): Promise<any | null> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms);
    const r = await fetch(url, {
      signal: ctrl.signal,
      // Some upstreams (goldprice.dev) reject requests with no/bot User-Agent.
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "application/json",
      },
    });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function loadLiveRates(env: Bindings): Promise<MetalRates> {
  // gold-api.com gives international spot in USD/oz (reliable from Workers);
  // open.er-api.com gives USD->INR. (goldprice.dev is unreachable from Workers,
  // so we compute the INR retail prices ourselves.)
  const [xau, xag, fx] = await Promise.all([
    fetchJson("https://api.gold-api.com/price/XAU"),
    fetchJson("https://api.gold-api.com/price/XAG"),
    fetchJson("https://open.er-api.com/v6/latest/USD"),
  ]);

  const xauUsdOz = xau ? Number(xau.price) : NaN; // gold USD/oz
  const xagUsdOz = xag ? Number(xag.price) : NaN; // silver USD/oz
  const usdInr =
    fx && fx.rates && Number(fx.rates.INR) ? Number(fx.rates.INR) : FALLBACK.usdInr;

  // Spot per gram in INR, then international spot -> Indian *benchmark* rate.
  // The Indian domestic gold/silver price runs well above international spot
  // (import duty + local market premium); ~1.176 lands the benchmark on the
  // rate Indian jewellers quote today (e.g. 24K ~₹15,700/g). GST is NOT included
  // here — 3% GST, making charges, wastage and diamond are added at billing.
  // Tunable via env (INDIA_METAL_PREMIUM) so it can be trimmed to the day's rate.
  const premium = Number(env.INDIA_METAL_PREMIUM) || 1.176;
  const gold24kSpot = Number.isFinite(xauUsdOz) ? (xauUsdOz / TROY_OZ_IN_GRAMS) * usdInr : NaN;
  const silverSpot = Number.isFinite(xagUsdOz) ? (xagUsdOz / TROY_OZ_IN_GRAMS) * usdInr : NaN;

  const haveLive = Number.isFinite(gold24kSpot) && Number.isFinite(silverSpot);
  const gold24k = Number.isFinite(gold24kSpot)
    ? Math.round(gold24kSpot * premium)
    : FALLBACK.gold24k;

  return {
    currency: "INR",
    gold24k,
    // Karat gold is priced by purity: 22K = 24K x 22/24, 18K = 24K x 18/24.
    gold22k: Number.isFinite(gold24kSpot) ? Math.round((gold24k * 22) / 24) : FALLBACK.gold22k,
    gold18k: Number.isFinite(gold24kSpot) ? Math.round((gold24k * 18) / 24) : FALLBACK.gold18k,
    silver: Number.isFinite(silverSpot) ? Math.round(silverSpot * premium) : FALLBACK.silver,
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
