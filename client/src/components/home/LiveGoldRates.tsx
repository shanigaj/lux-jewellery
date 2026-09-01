"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Info } from "lucide-react";
import { useGetMetalRatesQuery, type IMetalRates } from "@/store/api/metalsApi";

/* ─────────────────────────────────────────────────────────────
   Live Precious Metal Rates — Indian jewellery-industry standard.

   Shows ONLY the live benchmark metal rates (no making charges, GST,
   diamond or wastage — those are added at billing). Three cards:
   24K (999), 22K (916 hallmark) and Silver (999). Auto-refreshes
   every 5 minutes. Luxury black + gold treatment, fully responsive.
   ───────────────────────────────────────────────────────────── */

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

type CardSpec = {
  metal: string;
  purity: string;
  hallmark: string;
  perGram: number;
  secondaryLabel: string;
  secondaryValue: string;
  tone: "gold" | "silver";
};

export function LiveGoldRates({ initialData }: { initialData?: IMetalRates }) {
  const { data, isFetching, refetch } = useGetMetalRatesQuery(undefined, {
    pollingInterval: 5 * 60 * 1000, // auto-refresh every 5 minutes
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Prefer the live client query; fall back to the server-rendered rates so the
  // cards always paint real numbers on first load (and never hang on skeletons
  // if the client-side request is momentarily unavailable — e.g. cross-origin).
  const r = data?.data ?? initialData;

  // Format the timestamp on the client only, to avoid an SSR/CSR hydration
  // mismatch (server and browser locales/timezones differ).
  const [updatedText, setUpdatedText] = useState<string>("");
  useEffect(() => {
    if (!r?.updatedAt) return;
    setUpdatedText(
      new Date(r.updatedAt).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  }, [r?.updatedAt]);

  const cards: CardSpec[] = r
    ? [
        {
          metal: "24K Gold",
          purity: "999",
          hallmark: "Fine Gold",
          perGram: r.gold24k,
          secondaryLabel: "Per 10 Gram",
          secondaryValue: inr(r.gold24k * 10),
          tone: "gold",
        },
        {
          metal: "22K Gold",
          purity: "916",
          hallmark: "Hallmark",
          perGram: r.gold22k,
          secondaryLabel: "Per 10 Gram",
          secondaryValue: inr(r.gold22k * 10),
          tone: "gold",
        },
        {
          metal: "Silver",
          purity: "999",
          hallmark: "Fine Silver",
          perGram: r.silver,
          secondaryLabel: "Per Kilogram",
          secondaryValue: inr(r.silver * 1000),
          tone: "silver",
        },
      ]
    : [];

  return (
    <section className="relative overflow-hidden bg-[#0A0908] py-16 md:py-24">
      {/* Ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-10 text-center md:mb-14">
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-400">
              Live
            </span>
          </div>

          <h2 className="font-heading text-3xl text-[#F5F0E8] md:text-4xl lg:text-5xl">
            Today&rsquo;s <span className="text-[#C9A96E]">Metal Rates</span>
          </h2>
          <div className="mx-auto mt-5 h-px w-12 bg-[#C9A96E]" />
          <p className="mx-auto mt-5 max-w-md text-sm font-light text-[#F5F0E8]/50">
            Live benchmark rates for pure gold &amp; silver — updated automatically
            every 5 minutes.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {!r
            ? Array.from({ length: 3 }).map((_, i) => <RateCardSkeleton key={i} />)
            : cards.map((c) => <RateCard key={c.metal} {...c} />)}
        </div>

        {/* Meta row: last updated + manual refresh */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
          <p className="text-xs text-[#F5F0E8]/40">
            Last Updated:{" "}
            <span className="font-medium text-[#F5F0E8]/70">
              {updatedText || "—"}
            </span>
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A96E]/25 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#C9A96E] transition-colors hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/10"
          >
            <RefreshCw size={12} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-2.5 rounded-lg border border-[#C9A96E]/12 bg-[#C9A96E]/[0.04] px-5 py-4">
          <Info size={15} className="mt-0.5 shrink-0 text-[#C9A96E]/70" />
          <p className="text-center text-xs leading-relaxed text-[#F5F0E8]/55">
            Final jewellery price will be calculated during billing with making
            charges, GST, diamond and wastage.
          </p>
        </div>
      </div>
    </section>
  );
}

function RateCard({
  metal,
  purity,
  hallmark,
  perGram,
  secondaryLabel,
  secondaryValue,
  tone,
}: CardSpec) {
  const isGold = tone === "gold";
  const accent = isGold ? "#C9A96E" : "#C7CCD1";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 sm:p-7"
      style={{
        borderColor: `${accent}26`,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      {/* Top hairline accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between">
        <div>
          <h3
            className="font-heading text-2xl"
            style={{ color: isGold ? "#F5E7C6" : "#EDF0F3" }}
          >
            {metal}
          </h3>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.2em] text-[#F5F0E8]/40">
            {hallmark}
          </p>
        </div>
        <span
          className="rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider"
          style={{
            color: accent,
            borderColor: `${accent}40`,
            background: `${accent}14`,
          }}
        >
          {purity}
        </span>
      </div>

      {/* Primary price — per gram */}
      <div className="mt-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#F5F0E8]/40">
          Price / Gram
        </p>
        <p
          className="mt-1 font-heading text-4xl font-light tracking-tight"
          style={{ color: isGold ? "#EFD9A6" : "#F0F2F4" }}
        >
          {inr(perGram)}
        </p>
      </div>

      {/* Secondary price — per 10g / per kg */}
      <div
        className="mt-5 flex items-center justify-between border-t pt-4"
        style={{ borderColor: `${accent}1f` }}
      >
        <span className="text-xs text-[#F5F0E8]/45">{secondaryLabel}</span>
        <span className="text-sm font-medium text-[#F5F0E8]/85">
          {secondaryValue}
        </span>
      </div>
    </div>
  );
}

function RateCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-7">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-28 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-6 w-12 animate-pulse rounded-full bg-white/10" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
        <div className="h-9 w-40 animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-5 border-t border-white/5 pt-4">
        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}
