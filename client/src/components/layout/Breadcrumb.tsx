"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("py-4", className)}
    >
      <ol className="flex items-center gap-1.5 text-[11px] tracking-wider">
        <li>
          <Link
            href="/"
            className="text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1"
          >
            <Home size={12} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight size={10} className="text-muted-foreground/50" />
              {isLast || !item.href ? (
                <span className="text-foreground font-medium uppercase">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-gold transition-colors uppercase"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
