"use client";

import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted mb-6">
        {icon || <PackageOpen size={24} className="text-muted-foreground" />}
      </div>

      <h3 className="font-heading text-xl text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground font-light max-w-sm leading-relaxed mb-6">
          {description}
        </p>
      )}

      {action}
    </div>
  );
}
