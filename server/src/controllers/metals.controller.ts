import { Request, Response } from "express";

const TROY_OZ_IN_GRAMS = 31.1035;
const CACHE_TTL_MS = 15 * 60 * 1000; // refresh at most every 15 minutes

interface MetalRates {
  currency: "INR";
  gold24k: number; // ₹ per gram
  gold22k: number;
  gold18k: number;
  silver: number; // ₹ per gram
  usdInr: number;
  source: "live" | "fallback";
  updatedAt: string;
}

// Indicative fallback (₹/gram) used only when every live source is unreachable.
// Indicative Indian retail rates (₹/gram) — used only if every live source fails.
const FALLBACK: Omit<MetalRates, "updatedAt" | "source"> = {
  currency: "INR",
  gold24k: 15550,
  gold22k: 14250,
  gold18k: 11660,
  silver: 232,
  usdInr: 95,
};

let cache: MetalRates | null = null;
let cachedAt = 0;
let refreshing = false;

// Refresh the cache without blocking a request (stale-while-revalidate).
async function refreshCache(): Promise<void> {
  if (refreshing) return;
  refreshing = true;
  try {
    cache = await loadLiveRates();
    cachedAt = Date.now();
  } catch {
    // loadLiveRates already falls back internally; ignore transient failures.
  } finally {
    refreshing = false;
  }
}

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

async function loadLiveRates(): Promise<MetalRates> {
  // Fetch all three feeds in parallel so a cold (uncached) request resolves in
  // ~one timeout window instead of three back-to-back (was up to 24s).
  const [goldInr, xau, xag] = await Promise.all([
    // Gold per-gram INR (all karats), no key required.
    fetchJson("https://api.goldprice.dev/v1/carat?currency=INR"),
    // Gold & silver spot in USD/oz, no key required.
    fetchJson("https://api.gold-api.com/price/XAU"),
    fetchJson("https://api.gold-api.com/price/XAG"),
  ]);

  const gold24k = goldInr ? Number(goldInr.price_gram_24k) : NaN;
  const gold22k = goldInr ? Number(goldInr.price_gram_22k) : NaN;
  const gold18k = goldInr ? Number(goldInr.price_gram_18k) : NaN;
  const xauUsdOz = xau ? Number(xau.price) : NaN;
  const xagUsdOz = xag ? Number(xag.price) : NaN;

  // Derive USD→INR from pure-gold INR/g vs USD/oz, then price silver in INR/g.
  let usdInr = FALLBACK.usdInr;
  let silver = FALLBACK.silver;
  if (Number.isFinite(gold24k) && Number.isFinite(xauUsdOz) && xauUsdOz > 0) {
    usdInr = (gold24k * TROY_OZ_IN_GRAMS) / xauUsdOz;
    if (Number.isFinite(xagUsdOz)) silver = (xagUsdOz * usdInr) / TROY_OZ_IN_GRAMS;
  }

  const haveLive = Number.isFinite(gold24k) && Number.isFinite(xagUsdOz);

  // The feeds give the *international spot* price. Indian retail rates add
  // import duty + 3% GST + a dealer premium (~15%). Apply that so the ticker
  // matches the rate customers actually see. Tunable via env.
  const premium = Number(process.env.INDIA_METAL_PREMIUM) || 1.155;
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

// @desc    Live gold & silver rates (₹/gram), cached hourly
// @route   GET /api/metals/rates
// @access  Public
export const getMetalRates = async (_req: Request, res: Response) => {
  try {
    // Serve any cached value instantly; if it's stale, refresh in the
    // background so no user request ever waits on the slow external feeds.
    if (cache) {
      if (Date.now() - cachedAt >= CACHE_TTL_MS) void refreshCache();
      res.status(200).json({ success: true, data: cache });
      return;
    }
    // Cold start with no cache yet — load once (loadLiveRates never rejects;
    // it returns indicative values if the live feeds are unreachable).
    const rates = await loadLiveRates();
    cache = rates;
    cachedAt = Date.now();
    res.status(200).json({ success: true, data: rates });
  } catch {
    res.status(200).json({
      success: true,
      data: { ...FALLBACK, source: "fallback", updatedAt: new Date().toISOString() },
    });
  }
};

// Warm the cache on boot so the very first storefront request is instant.
void refreshCache();
