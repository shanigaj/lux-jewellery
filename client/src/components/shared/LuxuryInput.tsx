"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LuxuryInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "underline";
}

const LuxuryInput = React.forwardRef<HTMLInputElement, LuxuryInputProps>(
  (
    {
      className,
      type,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = "default",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] uppercase tracking-luxury font-medium text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            id={inputId}
            className={cn(
              "w-full text-sm font-light tracking-wide text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              variant === "default" &&
                "px-4 py-3 rounded-lg border border-border bg-background hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20",
              variant === "underline" &&
                "px-0 py-3 bg-transparent border-b-2 border-border hover:border-gold/30 focus:border-gold rounded-none",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error &&
                "border-destructive focus:border-destructive focus:ring-destructive/20",
              className
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-[11px] text-destructive font-light tracking-wide">
            {error}
          </p>
        )}

        {hint && !error && (
          <p className="text-[11px] text-muted-foreground font-light">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
LuxuryInput.displayName = "LuxuryInput";

export { LuxuryInput };
