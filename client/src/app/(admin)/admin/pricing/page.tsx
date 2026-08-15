"use client";

import { useMemo, useState } from "react";
import { Calculator, RefreshCw, Globe, IndianRupee } from "lucide-react";
import { useGetMetalRatesQuery } from "@/store/api/metalsApi";

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

type MetalKey = "gold24k" | "gold22k" | "gold18k" | "silver";

const METAL_LABELS: Record<MetalKey, string> = {
  gold24k: "Gold 24K",
  gold22k: "Gold 22K",
  gold18k: "Gold 18K",
  silver: "Silver",
};

// India: 3% GST on metal value, 5% GST on making charges.
const GST_METAL = 0.03;
const GST_MAKING = 0.05;

export default function AdminPricingPage() {
  const { data, isFetching, refetch } = useGetMetalRatesQuery();
  const rates = data?.data;

  const [metal, setMetal] = useState<MetalKey>("gold22k");
  const [weight, setWeight] = useState(10);
  const [makingPct, setMakingPct] = useState(12);
  const [wastagePct, setWastagePct] = useState(3);
  const [stoneValue, setStoneValue] = useState(0);
  const [importDutyPct, setImportDutyPct] = useState(5);
  const [destVatPct, setDestVatPct] = useState(0);

  const ratePerGram = rates ? rates[metal] : 0;

  const calc = useMemo(() => {
    const metalValue = ratePerGram * weight;
    const wastageValue = metalValue * (wastagePct / 100);
    const makingValue = metalValue * (makingPct / 100);
    const materialBase = metalValue + wastageValue + stoneValue; // GST-3% base
    const subtotal = materialBase + makingValue;

    // Domestic (India) — 3% on materials, 5% on making.
    const gstMetal = materialBase * GST_METAL;
    const gstMaking = makingValue * GST_MAKING;
    const domesticTotal = subtotal + gstMetal + gstMaking;

    // International — Indian GST is zero-rated on exports; destination charges apply.
    const importDuty = subtotal * (importDutyPct / 100);
    const destVat = (subtotal + importDuty) * (destVatPct / 100);
    const internationalTotal = subtotal + importDuty + destVat;

    return {
      metalValue, wastageValue, makingValue, stoneValue, subtotal,
      gstMetal, gstMaking, domesticTotal,
      importDuty, destVat, internationalTotal,
    };
  }, [ratePerGram, weight, wastagePct, makingPct, stoneValue, importDutyPct, destVatPct]);

  const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
    <div className={`flex items-center justify-between py-2 ${strong ? "border-t border-border mt-1 pt-3" : ""}`}>
      <span className={strong ? "font-medium text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={strong ? "font-heading text-lg text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl flex items-center gap-2"><Calculator size={22} /> Pricing & Tax Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Live metal rates → jewellery price with Indian GST and export duty. Admin-only, not shown on the storefront.
          </p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Refresh rates
        </button>
      </div>

      {/* Live rate strip */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
        <span className="text-xs uppercase tracking-wider text-gold font-medium">Live · ₹/gram</span>
        {rates ? (
          (Object.keys(METAL_LABELS) as MetalKey[]).map((k) => (
            <span key={k} className="flex items-center gap-2">
              <span className="text-muted-foreground">{METAL_LABELS[k]}</span>
              <span className="font-medium">{inr(rates[k])}</span>
            </span>
          ))
        ) : (
          <span className="text-muted-foreground">Loading rates…</span>
        )}
        <span className="text-xs text-muted-foreground ml-auto">
          {rates ? `${rates.source === "live" ? "Live market" : "Indicative"} · ${new Date(rates.updatedAt).toLocaleTimeString("en-IN")}` : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-heading text-lg">Inputs</h2>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Metal / Purity</label>
            <select value={metal} onChange={(e) => setMetal(e.target.value as MetalKey)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
              {(Object.keys(METAL_LABELS) as MetalKey[]).map((k) => (
                <option key={k} value={k}>{METAL_LABELS[k]} — {rates ? inr(rates[k]) : "…"}/g</option>
              ))}
            </select>
          </div>

          {[
            { label: "Weight (grams)", value: weight, set: setWeight, step: 0.1 },
            { label: "Making charge (%)", value: makingPct, set: setMakingPct, step: 1 },
            { label: "Wastage (%)", value: wastagePct, set: setWastagePct, step: 1 },
            { label: "Stone / diamond value (₹)", value: stoneValue, set: setStoneValue, step: 1000 },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</label>
              <input type="number" value={f.value} step={f.step} min={0} onChange={(e) => f.set(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
            </div>
          ))}

          <div className="pt-2 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1"><Globe size={12} /> Export settings</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">Import duty (%)</label>
                <input type="number" value={importDutyPct} step={0.5} min={0} onChange={(e) => setImportDutyPct(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Destination VAT (%)</label>
                <input type="number" value={destVatPct} step={0.5} min={0} onChange={(e) => setDestVatPct(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
              </div>
            </div>
          </div>
        </div>

        {/* Domestic */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-lg flex items-center gap-2 mb-4"><IndianRupee size={18} /> India (GST)</h2>
          <div className="text-sm">
            <Row label={`Metal (${weight}g)`} value={inr(calc.metalValue)} />
            <Row label={`Wastage (${wastagePct}%)`} value={inr(calc.wastageValue)} />
            <Row label={`Making (${makingPct}%)`} value={inr(calc.makingValue)} />
            {stoneValue > 0 && <Row label="Stone / diamond" value={inr(calc.stoneValue)} />}
            <Row label="Subtotal" value={inr(calc.subtotal)} />
            <Row label="GST 3% (metal)" value={inr(calc.gstMetal)} />
            <Row label="GST 5% (making)" value={inr(calc.gstMaking)} />
            <Row label="Total payable" value={inr(calc.domesticTotal)} strong />
          </div>
        </div>

        {/* International */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="font-heading text-lg flex items-center gap-2 mb-4"><Globe size={18} /> Export / International</h2>
          <div className="text-sm">
            <Row label="Subtotal (ex-GST)" value={inr(calc.subtotal)} />
            <Row label={`Import duty (${importDutyPct}%)`} value={inr(calc.importDuty)} />
            <Row label={`Destination VAT (${destVatPct}%)`} value={inr(calc.destVat)} />
            <Row label="Landed price" value={inr(calc.internationalTotal)} strong />
            <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
              Indian GST is zero-rated on exports; the buyer&apos;s country levies import duty and local VAT/GST. Rates vary by destination — set them above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
