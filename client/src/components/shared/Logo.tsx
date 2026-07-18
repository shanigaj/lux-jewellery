"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  showTagline?: boolean;
}

export function Logo({
  variant = "default",
  size = "md",
  className,
  showTagline = false,
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  const variantClasses = {
    default: "text-foreground",
    light: "text-white",
    dark: "text-foreground",
  };

  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col items-center", className)}
      aria-label="LUX DIAMONDS - Home"
    >
      {/* Diamond Icon */}
      <div className="relative mb-1">
        <svg
          width={size === "lg" ? 32 : size === "md" ? 24 : 18}
          height={size === "lg" ? 32 : size === "md" ? 24 : 18}
          viewBox="0 0 24 24"
          fill="none"
          className={cn(
            "transition-transform duration-500 group-hover:rotate-12",
            variant === "light" ? "text-white" : "text-gold"
          )}
        >
          <path
            d="M12 2L2 9L12 22L22 9L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M2 9H22"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 2L8 9L12 22L16 9L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        {/* Sparkle effect on hover */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-sparkle" />
      </div>

      {/* Brand Name */}
      <span
        className={cn(
          "font-heading font-semibold tracking-luxury",
          sizeClasses[size],
          variantClasses[variant]
        )}
      >
        LUX
      </span>

      {/* Sub Brand */}
      <span
        className={cn(
          "text-[9px] tracking-luxury-wide font-sans font-light uppercase -mt-0.5",
          variant === "light" ? "text-white/70" : "text-muted-foreground"
        )}
      >
        DIAMONDS
      </span>

      {/* Tagline */}
      {showTagline && (
        <span
          className={cn(
            "text-[8px] tracking-luxury font-sans font-light uppercase mt-2",
            variant === "light" ? "text-white/50" : "text-muted-foreground/60"
          )}
        >
          Where Brilliance Meets Artistry
        </span>
      )}
    </Link>
  );
}
