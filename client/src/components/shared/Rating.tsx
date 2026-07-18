"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  showCount?: boolean;
  count?: number;
  className?: string;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export function Rating({
  value,
  maxStars = 5,
  size = "md",
  showValue = false,
  showCount = false,
  count = 0,
  className,
  interactive = false,
  onChange,
}: RatingProps) {
  const sizeMap = {
    sm: { star: 12, text: "text-xs" },
    md: { star: 16, text: "text-sm" },
    lg: { star: 20, text: "text-base" },
  };

  const handleClick = (star: number) => {
    if (interactive && onChange) {
      onChange(star);
    }
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.floor(value);
          const isHalf = !isFilled && starValue - 0.5 <= value;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              className={cn(
                "transition-colors duration-200",
                interactive && "cursor-pointer hover:scale-110"
              )}
              aria-label={`${starValue} star${starValue > 1 ? "s" : ""}`}
            >
              <Star
                size={sizeMap[size].star}
                className={cn(
                  "transition-colors duration-200",
                  isFilled
                    ? "fill-gold text-gold"
                    : isHalf
                    ? "fill-gold/50 text-gold"
                    : "fill-transparent text-border"
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={cn("font-medium text-foreground", sizeMap[size].text)}>
          {value.toFixed(1)}
        </span>
      )}

      {showCount && count > 0 && (
        <span className={cn("text-muted-foreground", sizeMap[size].text)}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}
