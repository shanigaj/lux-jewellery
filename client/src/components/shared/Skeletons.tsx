"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ── Product Card Skeleton ──
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className="aspect-square rounded-lg shimmer" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-16 rounded shimmer" />
        <Skeleton className="h-5 w-3/4 rounded shimmer" />
        <Skeleton className="h-3 w-1/2 rounded shimmer" />
        <Skeleton className="h-4 w-24 rounded shimmer" />
      </div>
    </div>
  );
}

// ── Product Grid Skeleton ──
export function ProductGridSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Hero Skeleton ──
export function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] lg:h-[90vh] bg-background">
      <div className="container-luxury h-full flex items-center">
        <div className="max-w-xl space-y-6">
          <Skeleton className="h-4 w-40 bg-foreground/10 rounded shimmer" />
          <Skeleton className="h-14 w-96 bg-foreground/10 rounded shimmer" />
          <Skeleton className="h-14 w-80 bg-foreground/10 rounded shimmer" />
          <Skeleton className="h-px w-16 bg-foreground/10 shimmer" />
          <Skeleton className="h-4 w-72 bg-foreground/10 rounded shimmer" />
          <Skeleton className="h-4 w-64 bg-foreground/10 rounded shimmer" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-44 bg-foreground/10 rounded-[2px] shimmer" />
            <Skeleton className="h-12 w-32 bg-foreground/10 rounded-[2px] shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section Header Skeleton ──
export function SectionHeaderSkeleton() {
  return (
    <div className="text-center space-y-4">
      <Skeleton className="h-3 w-28 mx-auto rounded shimmer" />
      <Skeleton className="h-10 w-72 mx-auto rounded shimmer" />
      <Skeleton className="h-px w-12 mx-auto shimmer" />
      <Skeleton className="h-4 w-80 mx-auto rounded shimmer" />
    </div>
  );
}

// ── Text Block Skeleton ──
export function TextBlockSkeleton({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4 rounded shimmer",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  );
}
