"use client";

import { useState } from "react";
import { Ruler, Scroll, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RING_SIZES,
  BRACELET_SIZES,
  NECKLACE_LENGTHS,
  nearestUsRingSize,
} from "@/lib/size-guide";

type GuideTab = "ring" | "bracelet" | "necklace";

const TABS: { id: GuideTab; label: string; icon: typeof Ruler }[] = [
  { id: "ring", label: "Ring Size", icon: Ruler },
  { id: "bracelet", label: "Bracelet & Bangle", icon: Scroll },
  { id: "necklace", label: "Necklace & Chain", icon: Gem },
];

export function SizeGuideContent({ compact = false }: { compact?: boolean }) {
  const [tab, setTab] = useState<GuideTab>("ring");
  const [stringCm, setStringCm] = useState("");

  const measured = parseFloat(stringCm);
  const suggestedSize =
    !isNaN(measured) && measured > 0 ? nearestUsRingSize(measured * 10) : null;

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex gap-2 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px",
              tab === t.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ring" && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-[2px] border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2.5 text-left font-medium">US</th>
                  <th className="px-3 py-2.5 text-left font-medium">UK</th>
                  <th className="px-3 py-2.5 text-left font-medium">India</th>
                  <th className="px-3 py-2.5 text-left font-medium">Diameter</th>
                  <th className="px-3 py-2.5 text-left font-medium">Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RING_SIZES.map((row) => (
                  <tr key={row.us} className="tabular-nums">
                    <td className="px-3 py-2 font-medium text-foreground">{row.us}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.uk}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.india}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.diameterMm} mm</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.circumferenceMm} mm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick measure-at-home calculator */}
          <div className="rounded-[2px] border border-border bg-muted/20 p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gold">
              Measure at home
            </p>
            <p className="mb-3 text-sm font-light leading-relaxed text-muted-foreground">
              Wrap a strip of paper or string around the base of your finger, mark where it
              overlaps, then measure the length in centimetres against a ruler.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted-foreground">
                  Measurement (cm)
                </span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={stringCm}
                  onChange={(e) => setStringCm(e.target.value)}
                  placeholder="e.g. 5.4"
                  className="w-36 rounded-[2px] border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </label>
              {suggestedSize && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Your size ≈ </span>
                  <span className="font-heading text-lg text-primary">US {suggestedSize}</span>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              For the most accurate fit, we recommend an in-boutique sizing during a{" "}
              <a href="/book-appointment" className="text-primary hover:underline">
                private appointment
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {tab === "bracelet" && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-[2px] border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2.5 text-left font-medium">Size</th>
                  <th className="px-3 py-2.5 text-left font-medium">Wrist (cm)</th>
                  <th className="px-3 py-2.5 text-left font-medium">Recommended band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {BRACELET_SIZES.map((row) => (
                  <tr key={row.label} className="tabular-nums">
                    <td className="px-3 py-2 font-medium text-foreground">{row.label}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.wristCm}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.bandCm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-light leading-relaxed text-muted-foreground">
            Wrap a soft measuring tape (or string, then measure it against a ruler) snugly around
            your wrist, just below the bone. For bangles, measure across your knuckles with your
            thumb tucked in — the bangle needs to pass over your hand.
          </p>
        </div>
      )}

      {tab === "necklace" && (
        <div className="space-y-6">
          <div className="overflow-x-auto rounded-[2px] border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-3 py-2.5 text-left font-medium">Length</th>
                  <th className="px-3 py-2.5 text-left font-medium">Style</th>
                  <th className="px-3 py-2.5 text-left font-medium">Sits at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {NECKLACE_LENGTHS.map((row) => (
                  <tr key={row.inches}>
                    <td className="px-3 py-2 font-medium tabular-nums text-foreground">
                      {row.inches}&Prime;
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{row.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.sitsAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm font-light leading-relaxed text-muted-foreground">
            To find your ideal length, drape a string around your neck at the length you&apos;d
            like it to fall, then measure the string.
          </p>
        </div>
      )}

      {!compact && (
        <p className="pt-2 text-xs text-muted-foreground">
          All measurements are approximate. Between sizes? We recommend sizing up for comfort.
        </p>
      )}
    </div>
  );
}
