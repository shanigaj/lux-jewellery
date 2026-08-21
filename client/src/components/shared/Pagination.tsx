"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Build a compact page list: 1 … (c-1) c (c+1) … last — never the full 140 numbers.
function buildPages(current: number, total: number): (number | "…")[] {
  const pages: (number | "…")[] = [];
  const add = (p: number) => pages.push(p);

  const window = 1; // neighbours on each side of the current page
  const first = 1;
  const last = total;

  const left = Math.max(first, current - window);
  const right = Math.min(last, current + window);

  add(first);
  if (left > first + 1) pages.push("…");
  for (let p = left; p <= right; p++) if (p !== first && p !== last) add(p);
  if (right < last - 1) pages.push("…");
  if (last !== first) add(last);

  return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  return (
    <div className={cn("flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap", className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full border border-border hover:border-gold text-muted-foreground hover:text-gold transition-colors disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex items-center gap-1 sm:gap-1.5">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-6 sm:w-8 text-center text-sm text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={currentPage === p ? "page" : undefined}
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full text-sm transition-colors",
                currentPage === p
                  ? "bg-gold text-onyx font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full border border-border hover:border-gold text-muted-foreground hover:text-gold transition-colors disabled:opacity-50 disabled:hover:border-border disabled:hover:text-muted-foreground disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
