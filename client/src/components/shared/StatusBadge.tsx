"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  confirmed: {
    label: "Confirmed",
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
  },
  processing: {
    label: "Processing",
    bg: "bg-info/10",
    text: "text-info",
    dot: "bg-info",
  },
  shipped: {
    label: "Shipped",
    bg: "bg-gold/10",
    text: "text-gold",
    dot: "bg-gold",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    bg: "bg-gold/10",
    text: "text-gold",
    dot: "bg-gold",
  },
  delivered: {
    label: "Delivered",
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
  returned: {
    label: "Returned",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  refunded: {
    label: "Refunded",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  active: {
    label: "Active",
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  inactive: {
    label: "Inactive",
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  in_stock: {
    label: "In Stock",
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
  },
  low_stock: {
    label: "Low Stock",
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
  },
  out_of_stock: {
    label: "Out of Stock",
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
