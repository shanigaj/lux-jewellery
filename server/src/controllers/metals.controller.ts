import { Request, Response } from "express";

const TROY_OZ_IN_GRAMS = 31.1035;
const CACHE_TTL_MS = 60 * 60 * 1000; // refresh at most hourly

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
const FALLBACK: Omit<MetalRates, "updatedAt" | "source"> = {
  currency: "INR",
  gold24k: 7450,
  gold22k: 6830,
  gold18k: 5590,
  silver: 95,
  usdInr: 85,
};

let cache: MetalRates | null = null;
let cachedAt = 0;

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
  // Gold per-gram INR (all karats), no key required.
  const goldInr = await fetchJson("https://api.goldprice.dev/v1/carat?currency=INR");
  // Gold & silver spot in USD/oz, no key required.
  const xau = await fetchJson("https://api.gold-api.com/price/XAU");
  const xag = await fetchJson("https://api.gold-api.com/price/XAG");

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

  return {
    currency: "INR",
    gold24k: Number.isFinite(gold24k) ? Math.round(gold24k) : FALLBACK.gold24k,
    gold22k: Number.isFinite(gold22k) ? Math.round(gold22k) : FALLBACK.gold22k,
    gold18k: Number.isFinite(gold18k) ? Math.round(gold18k) : FALLBACK.gold18k,
    silver: Math.round(silver),
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
    if (cache && Date.now() - cachedAt < CACHE_TTL_MS) {
      res.status(200).json({ success: true, data: cache });
      return;
    }
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
