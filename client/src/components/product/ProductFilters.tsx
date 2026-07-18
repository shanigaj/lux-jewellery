"use client";

import { useState } from "react";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  className?: string;
}

const filterOptions = {
  categories: [
    { label: "All Categories", value: "all" },
    { label: "Rings", value: "rings" },
    { label: "Necklaces", value: "necklaces" },
    { label: "Earrings", value: "earrings" },
    { label: "Bracelets", value: "bracelets" },
    { label: "Watches", value: "watches" },
  ],
  metals: [
    { label: "Platinum", value: "platinum" },
    { label: "18K White Gold", value: "white_gold" },
    { label: "18K Yellow Gold", value: "gold" },
    { label: "18K Rose Gold", value: "rose_gold" },
  ],
  shapes: [
    { label: "Round", value: "round" },
    { label: "Princess", value: "princess" },
    { label: "Oval", value: "oval" },
    { label: "Emerald", value: "emerald" },
    { label: "Pear", value: "pear" },
  ]
};

export function ProductFilters({ filters, setFilters, className }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (group: string, value: string) => {
    const current = filters[group] || [];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    
    setFilters({ ...filters, [group]: updated });
  };

  const handlePriceChange = (value: number | readonly number[]) => {
    const val = value as number[];
    setFilters({ ...filters, minPrice: val[0], maxPrice: val[1] });
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 mb-6 border border-border text-sm font-medium uppercase tracking-wider"
      >
        <SlidersHorizontal size={16} />
        Filter Products
      </button>

      {/* Filter Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background lg:static lg:block lg:bg-transparent transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        <div className="flex flex-col h-full lg:block lg:h-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
            <h2 className="font-heading text-lg">Filters</h2>
            <button onClick={() => setIsOpen(false)} className="p-2">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-0 no-scrollbar">
            <Accordion defaultValue={["category", "price", "metal"]} className="w-full">
              {/* Category */}
              <AccordionItem value="category" className="border-border">
                <AccordionTrigger className="text-xs uppercase tracking-wider hover:no-underline font-semibold">
                  Category
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2.5 pt-2">
                    {filterOptions.categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setFilters({ ...filters, category: cat.value })}
                        className={cn(
                          "text-left text-sm transition-colors",
                          (filters.category || "all") === cat.value
                            ? "text-gold font-medium"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price */}
              <AccordionItem value="price" className="border-border">
                <AccordionTrigger className="text-xs uppercase tracking-wider hover:no-underline font-semibold">
                  Price Range
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-1 pt-6 pb-2">
                    <Slider
                      defaultValue={[filters.minPrice || 0, filters.maxPrice || 1500000]}
                      max={2000000}
                      step={10000}
                      onValueChange={handlePriceChange}
                      className="[&_[role=slider]]:border-gold [&_[role=slider]]:bg-gold"
                    />
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <span>₹{(filters.minPrice || 0).toLocaleString()}</span>
                      <span>₹{(filters.maxPrice || 2000000).toLocaleString()}+</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Metal */}
              <AccordionItem value="metal" className="border-border">
                <AccordionTrigger className="text-xs uppercase tracking-wider hover:no-underline font-semibold">
                  Metal
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pt-2">
                    {filterOptions.metals.map((metal) => {
                      const isChecked = (filters.metalType || []).includes(metal.value);
                      return (
                        <label key={metal.value} className="flex items-center gap-3 cursor-pointer group">
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isChecked ? "bg-gold border-gold" : "border-border group-hover:border-gold/50"
                          )}>
                            {isChecked && <Check size={10} className="text-onyx" />}
                          </div>
                          <span className={cn("text-sm", isChecked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                            {metal.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Diamond Shape */}
              <AccordionItem value="shape" className="border-border">
                <AccordionTrigger className="text-xs uppercase tracking-wider hover:no-underline font-semibold">
                  Diamond Shape
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {filterOptions.shapes.map((shape) => {
                      const isChecked = (filters.diamondShape || []).includes(shape.value);
                      return (
                        <button
                          key={shape.value}
                          onClick={() => handleCheckboxChange("diamondShape", shape.value)}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs transition-colors border",
                            isChecked 
                              ? "border-gold bg-gold/10 text-gold" 
                              : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                          )}
                        >
                          {shape.label}
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Mobile Footer */}
          <div className="p-4 border-t border-border lg:hidden">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 bg-gold text-onyx text-sm font-medium uppercase tracking-wider"
            >
              View Results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
