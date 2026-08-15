"use client";

import { useMemo, useState } from "react";
import { Calculator, RefreshCw, Globe, IndianRupee, Gem } from "lucide-react";
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

// India: 3% GST on metal/diamond value, 5% GST on making charges.
const GST_METAL = 0.03;
const GST_MAKING = 0.05;
const GST_DIAMOND = 0.03; // finished diamond jewellery

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className={`flex items-center justify-between py-2 ${strong ? "border-t border-border mt-1 pt-3" : ""}`}>
    <span className={strong ? "font-medium text-foreground" : "text-muted-foreground"}>{label}</span>
    <span className={strong ? "font-heading text-lg text-foreground" : "text-foreground"}>{value}</span>
  </div>
);

function Field({ label, value, set, step = 1, hint }: { label: string; value: number; set: (n: number) => void; step?: number; hint?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      <input type="number" value={value} step={step} min={0} onChange={(e) => set(Number(e.target.value))} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold" />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

// ── Metal jewellery calculator ──────────────────────────────
function MetalCalculator({ rates }: { rates?: Record<MetalKey, number> }) {
  const [metal, setMetal] = useState<MetalKey>("gold22k");
  const [weight, setWeight] = useState(10);
  const [makingPct, setMakingPct] = useState(12);
  const [wastagePct, setWastagePct] = useState(3);
  const [stoneValue, setStoneValue] = useState(0);
  const [importDutyPct, setImportDutyPct] = useState(5);
  const [destVatPct, setDestVatPct] = useState(0);

  const ratePerGram = rates ? rates[metal] : 0;

  const c = useMemo(() => {
    const metalValue = ratePerGram * weight;
    const wastageValue = metalValue * (wastagePct / 100);
    const makingValue = metalValue * (makingPct / 100);
    const materialBase = metalValue + wastageValue + stoneValue;
    const subtotal = materialBase + makingValue;
    const gstMetal = materialBase * GST_METAL;
    const gstMaking = makingValue * GST_MAKING;
    const domesticTotal = subtotal + gstMetal + gstMaking;
    const importDuty = subtotal * (importDutyPct / 100);
    const destVat = (subtotal + importDuty) * (destVatPct / 100);
    const internationalTotal = subtotal + importDuty + destVat;
    return { metalValue, wastageValue, makingValue, subtotal, gstMetal, gstMaking, domesticTotal, importDuty, destVat, internationalTotal };
  }, [ratePerGram, weight, wastagePct, makingPct, stoneValue, importDutyPct, destVatPct]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
        <Field label="Weight (grams)" value={weight} set={setWeight} step={0.1} />
        <Field label="Making charge (%)" value={makingPct} set={setMakingPct} />
        <Field label="Wastage (%)" value={wastagePct} set={setWastagePct} />
        <Field label="Stone / diamond value (₹)" value={stoneValue} set={setStoneValue} step={1000} />
        <div className="pt-2 border-t border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1"><Globe size={12} /> Export settings</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Import duty %" value={importDutyPct} set={setImportDutyPct} step={0.5} />
            <Field label="Dest. VAT %" value={destVatPct} set={setDestVatPct} step={0.5} />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-heading text-lg flex items-center gap-2 mb-4"><IndianRupee size={18} /> India (GST)</h2>
        <div className="text-sm">
          <Row label={`Metal (${weight}g)`} value={inr(c.metalValue)} />
          <Row label={`Wastage (${wastagePct}%)`} value={inr(c.wastageValue)} />
          <Row label={`Making (${makingPct}%)`} value={inr(c.makingValue)} />
          {stoneValue > 0 && <Row label="Stone / diamond" value={inr(stoneValue)} />}
          <Row label="Subtotal" value={inr(c.subtotal)} />
          <Row label="GST 3% (metal)" value={inr(c.gstMetal)} />
          <Row label="GST 5% (making)" value={inr(c.gstMaking)} />
          <Row label="Total payable" value={inr(c.domesticTotal)} strong />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-heading text-lg flex items-center gap-2 mb-4"><Globe size={18} /> Export / International</h2>
        <div className="text-sm">
          <Row label="Subtotal (ex-GST)" value={inr(c.subtotal)} />
          <Row label={`Import duty (${importDutyPct}%)`} value={inr(c.importDuty)} />
          <Row label={`Destination VAT (${destVatPct}%)`} value={inr(c.destVat)} />
          <Row label="Landed price" value={inr(c.internationalTotal)} strong />
          <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
            Indian GST is zero-rated on exports; the buyer&apos;s country levies import duty and local VAT/GST.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Diamond calculator (Rapaport / 4Cs) ─────────────────────
// Indicative multipliers relative to a G · VS1 baseline (= 1.0).
const COLOR_MULT: Record<string, number> = { D: 1.35, E: 1.25, F: 1.15, G: 1.0, H: 0.9, I: 0.8, J: 0.7, K: 0.6 };
const CLARITY_MULT: Record<string, number> = { FL: 1.6, IF: 1.45, VVS1: 1.3, VVS2: 1.2, VS1: 1.0, VS2: 0.9, SI1: 0.75, SI2: 0.62, I1: 0.4 };
const CUTS: Record<string, number> = { Excellent: 1.0, "Very Good": 0.95, Good: 0.88, Fair: 0.78 };
const COLORS = Object.keys(COLOR_MULT);
const CLARITIES = Object.keys(CLARITY_MULT);

function DiamondCalculator() {
  const [carat, setCarat] = useState(1);
  const [color, setColor] = useState("F");
  const [clarity, setClarity] = useState("VS1");
  const [cut, setCut] = useState("Excellent");
  const [ratePerCarat, setRatePerCarat] = useState(350000); // ₹ from Rapaport / supplier list
  const [certCost, setCertCost] = useState(8000);
  const [setting, setSetting] = useState(0);

  const c = useMemo(() => {
    const cutMult = CUTS[cut] ?? 1;
    const colorMult = COLOR_MULT[color] ?? 1;
    const clarityMult = CLARITY_MULT[clarity] ?? 1;
    const gradeMult = cutMult * colorMult * clarityMult;
    const diamondValue = carat * ratePerCarat * gradeMult;
    const subtotal = diamondValue + certCost + setting;
    const gst = subtotal * GST_DIAMOND;
    const total = subtotal + gst;
    const effPerCarat = carat > 0 ? total / carat : 0;
    return { cutMult, colorMult, clarityMult, gradeMult, diamondValue, subtotal, gst, total, effPerCarat };
  }, [carat, color, clarity, cut, ratePerCarat, certCost, setting]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 lg:col-span-2">
        <h2 className="font-heading text-lg flex items-center gap-2"><Gem size={18} /> The 4Cs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Field label="Carat" value={carat} set={setCarat} step={0.01} />
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Cut</label>
            <select value={cut} onChange={(e) => setCut(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
              {Object.keys(CUTS).map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Colour</label>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
              {COLORS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Clarity</label>
            <select value={clarity} onChange={(e) => setClarity(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold">
              {CLARITIES.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
          <Field label="Base rate ₹/carat (G · VS1)" value={ratePerCarat} set={setRatePerCarat} step={5000} hint="Rapaport/supplier rate for a G · VS1 stone; colour & clarity adjust automatically" />
          <Field label="Certification (GIA) ₹" value={certCost} set={setCertCost} step={1000} />
          <Field label="Setting / mount ₹" value={setting} set={setSetting} step={1000} />
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Diamonds are priced per carat from the Rapaport list for the exact colour + clarity, then adjusted for
          cut and market demand. Price is <em>not</em> linear with weight — enter the per-carat rate for the
          stone&apos;s size tier (rates jump at 0.50/0.70/1.00/1.50/2.00/3.00 ct).
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="font-heading text-lg flex items-center gap-2 mb-4"><IndianRupee size={18} /> Price (India)</h2>
        <div className="text-sm">
          <Row label="Grade" value={`${carat}ct · ${color} · ${clarity} · ${cut}`} />
          <Row label={`Grade factor`} value={`×${c.gradeMult.toFixed(2)}`} />
          <Row label="Diamond value" value={inr(c.diamondValue)} />
          {certCost > 0 && <Row label="Certification" value={inr(certCost)} />}
          {setting > 0 && <Row label="Setting / mount" value={inr(setting)} />}
          <Row label="Subtotal" value={inr(c.subtotal)} />
          <Row label="GST 3%" value={inr(c.gst)} />
          <Row label="Total payable" value={inr(c.total)} strong />
          <Row label="Effective ₹/carat" value={inr(c.effPerCarat)} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPricingPage() {
  const { data, isFetching, refetch } = useGetMetalRatesQuery();
  const rates = data?.data;
  const [tab, setTab] = useState<"metal" | "diamond">("metal");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl flex items-center gap-2"><Calculator size={22} /> Pricing & Tax Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Live rates → jewellery &amp; diamond pricing with GST and export duty. Admin-only, not shown on the storefront.
          </p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Refresh rates
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([["metal", "Metal Jewellery"], ["diamond", "Diamond"]] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === k ? "bg-onyx dark:bg-gold text-white dark:text-onyx" : "border border-border hover:bg-muted"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Live rate strip (metal tab) */}
      {tab === "metal" && (
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
      )}

      {tab === "metal" ? <MetalCalculator rates={rates} /> : <DiamondCalculator />}
    </div>
  );
}
