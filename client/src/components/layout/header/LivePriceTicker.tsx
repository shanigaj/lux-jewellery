"use client";

import { useGetMetalRatesQuery } from "@/store/api/metalsApi";

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/**
 * Live gold & silver market rates (₹ per gram) for the top bar.
 * Polls every 5 minutes; the backend itself caches hourly.
 */
export function LivePriceTicker() {
  const { data } = useGetMetalRatesQuery(undefined, {
    pollingInterval: 5 * 60 * 1000,
    refetchOnFocus: true,
  });

  const r = data?.data;
  if (!r) return null;

  const items = [
    { label: "Gold 24K", value: fmt(r.gold24k) },
    { label: "Gold 22K", value: fmt(r.gold22k) },
    { label: "Silver", value: fmt(r.silver) },
  ];

  return (
    <div className="flex items-center gap-3 text-[11px] tracking-wide" aria-label="Live metal rates">
      <span className="flex items-center gap-1.5 text-gold font-medium">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
        </span>
        LIVE
      </span>
      {items.map((it, i) => (
        <span key={it.label} className="flex items-center gap-1.5">
          {i > 0 && <span className="hidden sm:inline w-px h-3 bg-white/20" />}
          <span className="text-white/50">{it.label}</span>
          <span className="text-white/90 font-medium">{it.value}</span>
          <span className="hidden md:inline text-white/40">/g</span>
        </span>
      ))}
    </div>
  );
}
