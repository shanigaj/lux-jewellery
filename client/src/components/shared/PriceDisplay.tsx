"use client";

import { cn } from "@/lib/utils";
import { formatPrice, calculateDiscount } from "@/lib/formatters";

interface PriceDisplayProps {
  basePrice: number;
  salePrice?: number;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDiscount?: boolean;
  layout?: "inline" | "stacked";
}

export function PriceDisplay({
  basePrice,
  salePrice,
  currency = "INR",
  size = "md",
  className,
  showDiscount = true,
  layout = "inline",
}: PriceDisplayProps) {
  const hasDiscount = salePrice && salePrice < basePrice;
  const discount = hasDiscount ? calculateDiscount(basePrice, salePrice) : 0;

  const sizeClasses = {
    sm: { current: "text-sm", original: "text-xs", badge: "text-[9px] px-1.5 py-0.5" },
    md: { current: "text-lg", original: "text-sm", badge: "text-[10px] px-2 py-0.5" },
    lg: { current: "text-2xl", original: "text-base", badge: "text-xs px-2.5 py-1" },
  };

  return (
    <div
      className={cn(
        "flex gap-2",
        layout === "stacked" ? "flex-col items-start" : "flex-row items-center flex-wrap",
        className
      )}
    >
      {/* Current Price */}
      <span
        className={cn(
          "font-heading font-medium tracking-wide text-foreground",
          sizeClasses[size].current
        )}
      >
        {formatPrice(hasDiscount ? salePrice : basePrice, currency)}
      </span>

      {/* Original Price (struck through) */}
      {hasDiscount && (
        <span
          className={cn(
            "text-muted-foreground line-through font-light",
            sizeClasses[size].original
          )}
        >
          {formatPrice(basePrice, currency)}
        </span>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscount && discount > 0 && (
        <span
          className={cn(
            "inline-flex items-center font-sans font-medium uppercase tracking-wider rounded-full bg-success/10 text-success border border-success/20",
            sizeClasses[size].badge
          )}
        >
          {discount}% off
        </span>
      )}
    </div>
  );
}
