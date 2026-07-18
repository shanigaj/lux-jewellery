"use client";

import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  showLine?: boolean;
}

export function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  className,
  showLine = true,
}: SectionHeadingProps) {
  return (
    <AnimatedSection
      animation="fadeUp"
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
          {subtitle}
        </p>
      )}

      <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 text-balance">
        {title}
      </h2>

      {showLine && (
        <div
          className={cn(
            "w-12 h-px bg-gold mt-4",
            align === "center" ? "mx-auto" : ""
          )}
        />
      )}

      {description && (
        <p
          className={cn(
            "text-muted-foreground font-light leading-relaxed mt-6",
            align === "center" ? "max-w-md mx-auto" : "max-w-lg"
          )}
        >
          {description}
        </p>
      )}
    </AnimatedSection>
  );
}
