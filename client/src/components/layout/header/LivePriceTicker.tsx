"use client";

import { useGetMetalRatesQuery } from "@/store/api/metalsApi";

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export type MetalTickerRates = { gold24k: number; gold22k: number; silver: number };

// Indicative rates (₹/gram) — a last-resort so the bar never disappears if both
// the server-rendered rates and the client request are unavailable.
const FALLBACK_RATES: MetalTickerRates = { gold24k: 15550, gold22k: 14250, silver: 232 };

/**
 * Live gold & silver market rates (₹ per gram) for the top bar.
 * `initialRates` is fetched on the server so the correct numbers are painted in
 * the very first HTML (no visible "stale → live" flip); the client query then
 * keeps them fresh. Polls every 3 minutes; the backend itself caches hourly.
 */
export function LivePriceTicker({ initialRates }: { initialRates?: MetalTickerRates }) {
  const { data } = useGetMetalRatesQuery(undefined, {
    pollingInterval: 3 * 60 * 1000,
    refetchOnFocus: true,
  });

  // Prefer live client data; before it arrives use the server-rendered rates
  // (so first paint is already correct), then the indicative fallback.
  const r = data?.data ?? initialRates ?? FALLBACK_RATES;

  const items = [
    { label: "Gold 24K", value: fmt(r.gold24k), hideOnMobile: false },
    { label: "Gold 22K", value: fmt(r.gold22k), hideOnMobile: true },
    { label: "Silver", value: fmt(r.silver), hideOnMobile: false },
  ];

  return (
    <div
      className="flex items-center gap-2.5 sm:gap-3 text-[11px] tracking-wide max-w-full overflow-x-auto no-scrollbar"
      aria-label="Live metal rates"
    >
      <span className="flex items-center gap-1.5 text-gold font-medium shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        LIVE
      </span>
      {items.map((it, i) => (
        <span
          key={it.label}
          className={`items-center gap-1.5 shrink-0 whitespace-nowrap ${it.hideOnMobile ? "hidden sm:flex" : "flex"}`}
        >
          {i > 0 && <span className="hidden sm:inline w-px h-3 bg-white/20" />}
          <span className="text-white/50">{it.label}</span>
          <span className="text-white/90 font-medium">{it.value}</span>
          <span className="hidden md:inline text-white/40">/g</span>
        </span>
      ))}
    </div>
  );
}
