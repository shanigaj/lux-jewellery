"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildNotifyMeMessage, getWhatsAppUrl, type ProductInquiry } from "@/lib/whatsapp";

interface NotifyMeButtonProps {
  inquiry: ProductInquiry;
  className?: string;
}

export function NotifyMeButton({ inquiry, className }: NotifyMeButtonProps) {
  const [sent, setSent] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = getWhatsAppUrl(buildNotifyMeMessage(inquiry));
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Notify me when back in stock"
      className={cn(
        "inline-flex items-center justify-center gap-2 py-4 px-8 text-sm font-medium uppercase tracking-wider transition-colors border",
        sent
          ? "border-primary text-primary"
          : "border-foreground text-foreground hover:bg-foreground hover:text-background",
        className
      )}
    >
      {sent ? <Check size={18} /> : <Bell size={18} />}
      {sent ? "We'll notify you" : "Notify Me When Available"}
    </button>
  );
}
