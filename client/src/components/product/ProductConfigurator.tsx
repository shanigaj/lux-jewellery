"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { TMetalType, IProductVariant } from "@/types/product.types";
import { Ruler } from "lucide-react";
import { SizeGuideModal } from "@/components/shared/SizeGuideModal";

interface ProductConfiguratorProps {
  basePrice: number;
  variants: IProductVariant[];
  defaultMetal: TMetalType;
  onPriceChange: (price: number) => void;
  /** Reports the current metal (as a readable colour name) and size selection. */
  onSelectionChange?: (selection: { metal: string; size: string }) => void;
}

const metalColors: Record<string, string> = {
  platinum: "bg-slate-200",
  white_gold: "bg-zinc-100",
  gold: "bg-yellow-400",
  rose_gold: "bg-rose-300",
  silver: "bg-gray-300",
};

const metalNames: Record<string, string> = {
  platinum: "Platinum",
  white_gold: "18K White Gold",
  gold: "18K Yellow Gold",
  rose_gold: "18K Rose Gold",
  silver: "Sterling Silver",
};

export function ProductConfigurator({
  basePrice,
  variants,
  defaultMetal,
  onPriceChange,
  onSelectionChange,
}: ProductConfiguratorProps) {
  const [selectedMetal, setSelectedMetal] = useState<TMetalType>(defaultMetal || "platinum");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Report the initial selection once mounted, and whenever it changes.
  useEffect(() => {
    onSelectionChange?.({ metal: metalNames[selectedMetal] || selectedMetal, size: selectedSize });
  }, [selectedMetal, selectedSize, onSelectionChange]);

  // Extract unique metals and sizes from variants
  const availableMetals = Array.from(new Set(variants.map(v => v.metalType as TMetalType)));
  const availableSizes = Array.from(new Set(variants.filter(v => v.size).map(v => v.size as string))).sort();

  // Fallbacks if no variants exist
  const displayMetals = availableMetals.length > 0 ? availableMetals : ["platinum", "gold", "rose_gold", "white_gold"] as TMetalType[];
  const displaySizes = availableSizes.length > 0 ? availableSizes : ["4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8"];

  const handleMetalSelect = (metal: TMetalType) => {
    setSelectedMetal(metal);
    
    // Find matching variant to update price
    const variant = variants.find(v => v.metalType === metal && (!selectedSize || v.size === selectedSize));
    if (variant) {
      onPriceChange(basePrice + variant.priceModifier);
    } else {
      // Mock price adjustment based on metal if no exact variant
      let modifier = 0;
      if (metal === "platinum") modifier = 35000;
      if (metal === "gold") modifier = -10000;
      onPriceChange(basePrice + modifier);
    }
  };

  const handleSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    setSelectedSize(size);

    const variant = variants.find(v => v.metalType === selectedMetal && v.size === size);
    if (variant) {
      onPriceChange(basePrice + variant.priceModifier);
    }
  };

  return (
    <div className="space-y-8 py-6 border-y border-border my-8">
      {/* Metal Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-luxury font-medium">
            Metal
          </label>
          <span className="text-sm text-muted-foreground">{metalNames[selectedMetal]}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {displayMetals.map((metal) => (
            <button
              key={metal}
              onClick={() => handleMetalSelect(metal)}
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all p-1",
                selectedMetal === metal ? "border-gold scale-110" : "border-transparent hover:border-border"
              )}
              title={metalNames[metal]}
            >
              <div className={cn("w-full h-full rounded-full shadow-inner", metalColors[metal])} />
            </button>
          ))}
        </div>
      </div>

      {/* Ring Size */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-luxury font-medium">
            Ring Size
          </label>
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            className="text-xs text-gold hover:underline flex items-center gap-1"
          >
            <Ruler size={12} />
            Size Guide
          </button>
        </div>
        <div className="relative">
          <select
            value={selectedSize}
            onChange={handleSizeSelect}
            className="w-full appearance-none bg-transparent border border-border px-4 py-3 rounded-none focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm transition-colors cursor-pointer"
          >
            <option value="" disabled>Select a size</option>
            {displaySizes.map(size => (
              <option key={size} value={size}>US {size}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </div>
  );
}
