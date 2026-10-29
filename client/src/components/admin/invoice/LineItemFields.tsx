"use client";

// A single editable product row driven by the shared invoice field config.
// Used by both the Invoice Builder (settings/format) and the Create Walk-in
// Order modal, so the two always show the same category-wise fields.
import { Trash2 } from "lucide-react";
import type { LineItem, PricingInfo } from "@/lib/invoice-builder/types";
import { itemTotal } from "@/lib/invoice-builder/calc";
import { TextInput, NumberInput, SelectInput, TextArea } from "./ui";

export function LineItemFields({
  item,
  index,
  mode,
  f,
  money,
  canRemove,
  onChange,
  onRemove,
  showCost = false,
}: {
  item: LineItem;
  index: number;
  mode: PricingInfo["mode"];
  f: (key: string) => boolean;
  money: (v: number) => string;
  canRemove: boolean;
  onChange: (patch: Partial<LineItem>) => void;
  onRemove: () => void;
  /** Show the internal factory cost / profit field (admin order entry only). */
  showCost?: boolean;
}) {
  const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
  const lineTotal = itemTotal(item, mode);
  const lineCost = (Number(item.costPrice) || 0) * qty;
  const lineProfit = lineTotal - lineCost;
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground">Item {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <TextInput label="Product Name" className="sm:col-span-2" value={item.name} onChange={(v) => onChange({ name: v })} placeholder="e.g. Diamond Solitaire Ring" />
        {f("item.sku") && <TextInput label="SKU / Code" value={item.sku} onChange={(v) => onChange({ sku: v })} />}
        {f("item.category") && <TextInput label="Category" value={item.category} onChange={(v) => onChange({ category: v })} />}
        {f("item.description") && <TextArea label="Description" className="sm:col-span-2" value={item.description} onChange={(v) => onChange({ description: v })} />}
        {f("item.image") && <TextInput label="Image URL" className="sm:col-span-2" value={item.imageUrl} onChange={(v) => onChange({ imageUrl: v })} />}

        {f("item.metal") && (
          <>
            <SelectInput
              label="Metal Type"
              value={item.metalType || ""}
              onChange={(v) => onChange({ metalType: v as LineItem["metalType"] })}
              options={[
                { value: "", label: "—" },
                { value: "silver", label: "Silver" },
                { value: "gold", label: "Gold" },
                { value: "white_gold", label: "White Gold" },
                { value: "rose_gold", label: "Rose Gold" },
                { value: "platinum", label: "Platinum" },
                { value: "other", label: "Other" },
              ]}
            />
            <SelectInput
              label="Purity"
              value={item.metalPurity || ""}
              onChange={(v) => onChange({ metalPurity: v as LineItem["metalPurity"] })}
              options={[
                { value: "", label: "—" },
                { value: "925", label: "925 Silver" },
                { value: "14K", label: "14K" },
                { value: "18K", label: "18K" },
                { value: "22K", label: "22K" },
                { value: "24K", label: "24K" },
                { value: "950Pt", label: "950 Platinum" },
                { value: "custom", label: "Custom" },
              ]}
            />
          </>
        )}
        {f("item.weight") && (
          <>
            <NumberInput label="Gross Weight (g)" value={item.grossWeight} onChange={(v) => onChange({ grossWeight: v })} />
            <NumberInput label="Net Weight (g)" value={item.netWeight} onChange={(v) => onChange({ netWeight: v })} />
          </>
        )}
        {f("item.metalRate") && mode === "detailed" && (
          <>
            <NumberInput label="Metal Rate / g" value={item.metalRate} onChange={(v) => onChange({ metalRate: v })} />
            <NumberInput label="Metal Value (override)" value={item.metalValueOverride} onChange={(v) => onChange({ metalValueOverride: v })} placeholder="Auto = rate × net wt" />
          </>
        )}

        {f("item.stone") && (
          <>
            <SelectInput
              label="Stone Type"
              value={item.stoneType || ""}
              onChange={(v) => onChange({ stoneType: v as LineItem["stoneType"] })}
              options={[
                { value: "", label: "—" },
                { value: "natural_diamond", label: "Natural Diamond" },
                { value: "lab_diamond", label: "Lab-Grown Diamond" },
                { value: "cz", label: "American Diamond (CZ)" },
                { value: "gemstone", label: "Gemstone" },
                { value: "other", label: "Other" },
              ]}
            />
            <NumberInput label="Stone Weight (ct)" value={item.stoneWeight} onChange={(v) => onChange({ stoneWeight: v })} />
            {mode === "detailed" && (
              <NumberInput label="Stone Value" value={item.stoneValue} onChange={(v) => onChange({ stoneValue: v })} />
            )}
          </>
        )}
        {f("item.stoneQuality") && (
          <>
            <TextInput label="Color" value={item.stoneColor} onChange={(v) => onChange({ stoneColor: v })} />
            <TextInput label="Clarity" value={item.stoneClarity} onChange={(v) => onChange({ stoneClarity: v })} />
            <TextInput label="Cut" value={item.stoneCut} onChange={(v) => onChange({ stoneCut: v })} />
            <TextInput label="Quality / Grade" value={item.stoneQuality} onChange={(v) => onChange({ stoneQuality: v })} />
          </>
        )}

        {f("item.ringSize") && <TextInput label="Ring Size" value={item.ringSize} onChange={(v) => onChange({ ringSize: v })} />}
        {f("item.length") && <TextInput label="Chain / Bracelet Length" value={item.length} onChange={(v) => onChange({ length: v })} />}

        {mode === "detailed" && f("item.makingCharges") && (
          <NumberInput label="Making Charges" value={item.makingCharges} onChange={(v) => onChange({ makingCharges: v })} />
        )}
        {mode === "detailed" && f("item.wastageCharges") && (
          <NumberInput label="Wastage Charges" value={item.wastageCharges} onChange={(v) => onChange({ wastageCharges: v })} />
        )}
        {mode === "detailed" && f("item.otherCharges") && (
          <NumberInput label="Other Charges" value={item.otherCharges} onChange={(v) => onChange({ otherCharges: v })} />
        )}

        {mode === "simple" && (
          <NumberInput label="Unit Price" value={item.unitPrice} onChange={(v) => onChange({ unitPrice: v })} />
        )}
        <NumberInput label="Quantity" value={item.quantity} min={1} onChange={(v) => onChange({ quantity: Math.max(1, Math.floor(v ?? 1)) })} />
        {f("item.discount") && (
          <NumberInput label="Item Discount" value={item.discount} onChange={(v) => onChange({ discount: v })} />
        )}
        {showCost && (
          <div className="sm:col-span-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 items-end">
              <NumberInput
                label="Factory Cost / unit (internal)"
                value={item.costPrice}
                onChange={(v) => onChange({ costPrice: v })}
                placeholder="What we paid per piece"
              />
              {lineCost > 0 && (
                <div className="text-xs text-muted-foreground sm:text-right">
                  Cost <span className="font-medium text-foreground">{money(lineCost)}</span>
                  <span className="mx-1.5">·</span>
                  Profit{" "}
                  <span className={`font-semibold ${lineProfit >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {money(lineProfit)}
                  </span>
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground/80">Internal only — never shown on the customer invoice.</p>
          </div>
        )}
      </div>

      <div className="mt-2 text-right text-sm">
        <span className="text-muted-foreground mr-2">Line Total</span>
        <span className="font-semibold text-foreground">{money(lineTotal)}</span>
      </div>
    </div>
  );
}
