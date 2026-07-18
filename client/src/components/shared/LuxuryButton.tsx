"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const luxuryButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary gold button
        primary:
          "bg-gold text-onyx hover:bg-gold-light hover:shadow-gold active:scale-[0.98] rounded-full uppercase tracking-wider text-[12px]",
        // Secondary outlined button
        secondary:
          "border border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full uppercase tracking-wider text-[12px]",
        // Ghost button
        ghost:
          "text-foreground hover:bg-muted rounded-full uppercase tracking-wider text-[12px]",
        // Outlined gold
        outline:
          "border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold rounded-full uppercase tracking-wider text-[12px]",
        // Dark solid
        dark:
          "bg-onyx text-white hover:bg-onyx/90 rounded-full uppercase tracking-wider text-[12px]",
        // Destructive
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 rounded-full uppercase tracking-wider text-[12px]",
        // Link style
        link:
          "text-gold underline-offset-4 hover:underline text-sm p-0 h-auto",
        // Icon only
        icon:
          "rounded-full border border-border hover:border-gold/30 hover:text-gold hover:bg-muted",
      },
      size: {
        sm: "h-9 px-5 text-[11px]",
        md: "h-11 px-7 text-[12px]",
        lg: "h-13 px-9 text-[13px]",
        xl: "h-14 px-11 text-[13px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof luxuryButtonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(luxuryButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
LuxuryButton.displayName = "LuxuryButton";

export { LuxuryButton, luxuryButtonVariants };
