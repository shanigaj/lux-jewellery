"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-luxury text-muted-foreground hidden sm:inline-block">
        Sort By
      </span>
      <Select value={value} onValueChange={(val: any) => onChange(val as string)}>
        <SelectTrigger className="w-[180px] bg-background border-border hover:border-gold/50 focus:ring-gold/30 rounded-none transition-colors">
          <SelectValue placeholder="Featured" />
        </SelectTrigger>
        <SelectContent className="bg-background border-border rounded-none shadow-luxury">
          <SelectItem value="featured" className="hover:bg-muted focus:bg-muted text-sm cursor-pointer">
            Featured
          </SelectItem>
          <SelectItem value="newest" className="hover:bg-muted focus:bg-muted text-sm cursor-pointer">
            New Arrivals
          </SelectItem>
          <SelectItem value="price-asc" className="hover:bg-muted focus:bg-muted text-sm cursor-pointer">
            Price: Low to High
          </SelectItem>
          <SelectItem value="price-desc" className="hover:bg-muted focus:bg-muted text-sm cursor-pointer">
            Price: High to Low
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
