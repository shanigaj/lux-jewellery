"use client";

import { SlidersHorizontal, Check } from "lucide-react";
import { SECTION_CATALOG, PRESETS } from "@/lib/invoice-builder/config";
import type { InvoiceConfig, PresetKey, SectionKey } from "@/lib/invoice-builder/types";
import { Toggle } from "./ui";

interface Props {
  config: InvoiceConfig;
  onConfig: (next: InvoiceConfig) => void;
  onPreset: (key: PresetKey) => void;
}

export function FieldSettingsPanel({ config, onConfig, onPreset }: Props) {
  const toggleSection = (key: SectionKey, value: boolean) =>
    onConfig({ ...config, sections: { ...config.sections, [key]: value }, preset: "custom" });

  const toggleField = (key: string, value: boolean) =>
    onConfig({ ...config, fields: { ...config.fields, [key]: value }, preset: "custom" });

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <SlidersHorizontal size={15} className="text-gold" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Category Preset</h3>
        </div>
        <p className="text-[11px] text-muted-foreground mb-3">
          A preset flips which fields show — your entered data is never erased.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((p) => {
            const active = config.preset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onPreset(p.key)}
                className={`text-left rounded-lg border p-2.5 transition-colors ${
                  active
                    ? "border-gold bg-gold/10"
                    : "border-border hover:border-gold/50 bg-background"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{p.label}</span>
                  {active && <Check size={13} className="text-gold" />}
                </div>
                <span className="block text-[10px] text-muted-foreground mt-0.5 leading-snug">
                  {p.description}
                </span>
              </button>
            );
          })}
        </div>
        {config.preset === "custom" && (
          <p className="text-[11px] text-gold mt-2">Custom configuration</p>
        )}
      </div>

      {/* Field groups */}
      <div className="space-y-3">
        {SECTION_CATALOG.map((section) => {
          const sectionOn = config.sections[section.key];
          return (
            <div key={section.key} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-muted/40 px-3 py-2">
                <span className="text-xs font-bold uppercase tracking-wider">{section.label}</span>
                {section.optional ? (
                  <Toggle
                    checked={sectionOn}
                    onChange={(v) => toggleSection(section.key, v)}
                    label={`${section.label} section`}
                    hideLabel
                  />
                ) : (
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Always on
                  </span>
                )}
              </div>
              {sectionOn && (
                <div className="px-3 py-1 divide-y divide-border/40">
                  {section.fields.map((f) => (
                    <Toggle
                      key={f.key}
                      label={f.label}
                      hint={f.essential ? "Required" : undefined}
                      checked={f.essential ? true : config.fields[f.key] !== false}
                      disabled={f.essential}
                      onChange={(v) => toggleField(f.key, v)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
        <Check size={12} className="text-green-600" /> Settings are saved automatically on this device.
      </p>
    </div>
  );
}
