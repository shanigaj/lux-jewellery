"use client";

import { useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { subCategoriesFor } from "@/config/subcategories";
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
    { label: "Diamonds", value: "diamonds" },
  ],
  metals: [
    { label: "Platinum", value: "platinum" },
    { label: "18K White Gold", value: "white_gold" },
    { label: "18K Yellow Gold", value: "gold" },
    { label: "18K Rose Gold", value: "rose_gold" },
  ],
};

// Stable reference so Base UI's uncontrolled Accordion doesn't see the
// defaultValue "change" on every render (which triggers a console warning).
const DEFAULT_OPEN_SECTIONS = ["category", "type", "metal"];

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

  const filterBody = (
    <Accordion defaultValue={DEFAULT_OPEN_SECTIONS} className="w-full">
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
                        onClick={() => setFilters({ ...filters, category: cat.value, subcategory: undefined })}
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

              {/* Type (sub-category) — only for categories that have them. */}
              {subCategoriesFor(filters.category).length > 0 && (
                <AccordionItem value="type" className="border-border">
                  <AccordionTrigger className="text-xs uppercase tracking-wider hover:no-underline font-semibold">
                    Type
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-2.5 pt-2">
                      <button
                        onClick={() => setFilters({ ...filters, subcategory: undefined })}
                        className={cn(
                          "text-left text-sm transition-colors",
                          !filters.subcategory ? "text-gold font-medium" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        All Types
                      </button>
                      {subCategoriesFor(filters.category).map((sub) => (
                        <button
                          key={sub.slug}
                          onClick={() => setFilters({ ...filters, subcategory: sub.slug })}
                          className={cn(
                            "text-left text-sm transition-colors",
                            filters.subcategory === sub.slug
                              ? "text-gold font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Price — temporarily hidden (prices not shown to customers yet).
                  Re-enable by changing `{false && (` back to render this block
                  and adding "price" back to the Accordion defaultValue above. */}
              {false && (
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
              )}

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
                        <button
                          type="button"
                          key={metal.value}
                          onClick={() => handleCheckboxChange("metalType", metal.value)}
                          className="flex items-center gap-3 cursor-pointer group text-left"
                        >
                          <div className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                            isChecked ? "bg-gold border-gold" : "border-border group-hover:border-gold/50"
                          )}>
                            {isChecked && <Check size={10} className="text-onyx" />}
                          </div>
                          <span className={cn("text-sm", isChecked ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                            {metal.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>

    </Accordion>
  );

  return (
    <>
      {/* Mobile: a portal drawer (Radix Sheet) — always a correct full-screen
          overlay with a built-in close button, above the sticky header. */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="lg:hidden w-full flex items-center justify-center gap-2 py-3.5 mb-6 border border-border text-sm font-medium uppercase tracking-wider">
          <SlidersHorizontal size={16} />
          Filter Products
        </SheetTrigger>
        <SheetContent side="left" className="w-[86vw] max-w-[360px] p-0 flex flex-col bg-background">
          <div className="flex items-center h-14 px-4 border-b border-border shrink-0">
            <h2 className="font-heading text-lg">Filters</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 no-scrollbar">{filterBody}</div>
          <div className="p-4 border-t border-border shrink-0">
            <SheetClose className="w-full py-3.5 bg-gold text-onyx text-sm font-medium uppercase tracking-wider">
              View Results
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: inline sidebar */}
      <div className={cn("hidden lg:block", className)}>{filterBody}</div>
    </>
  );
}
