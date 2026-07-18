"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (value > min) onChange(value - 1);
  };

  const increase = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-border rounded-full",
        className
      )}
    >
      <button
        onClick={decrease}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          size === "sm" ? "w-8 h-8" : "w-10 h-10"
        )}
        aria-label="Decrease quantity"
      >
        <Minus size={size === "sm" ? 12 : 14} />
      </button>

      <span
        className={cn(
          "font-medium text-foreground select-none min-w-[2rem] text-center",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {value}
      </span>

      <button
        onClick={increase}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center rounded-full hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
          size === "sm" ? "w-8 h-8" : "w-10 h-10"
        )}
        aria-label="Increase quantity"
      >
        <Plus size={size === "sm" ? 12 : 14} />
      </button>
    </div>
  );
}
