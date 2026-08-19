"use client";

import { useGetMetalRatesQuery } from "@/store/api/metalsApi";

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Indicative rates (₹/gram) so the bar never disappears if the rates request is
// still loading or momentarily unreachable. Live data replaces these as soon as
// it arrives. Kept roughly in sync with the backend's own fallback.
const FALLBACK_RATES = { gold24k: 15550, gold22k: 14250, silver: 232 };

/**
 * Live gold & silver market rates (₹ per gram) for the top bar.
 * Polls every 5 minutes; the backend itself caches hourly.
 */
export function LivePriceTicker() {
  const { data } = useGetMetalRatesQuery(undefined, {
    pollingInterval: 3 * 60 * 1000,
    refetchOnFocus: true,
  });

  // Never render nothing: fall back to indicative rates until live data loads,
  // so the ticker is always present in the top bar.
  const r = data?.data ?? FALLBACK_RATES;

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
