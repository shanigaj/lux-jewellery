"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildInquiryMessage, getWhatsAppUrl, type ProductInquiry } from "@/lib/whatsapp";

interface WhatsAppInquiryButtonProps {
  inquiry: ProductInquiry;
  label?: string;
  className?: string;
  iconSize?: number;
}

export function WhatsAppInquiryButton({
  inquiry,
  label = "Enquire on WhatsApp",
  className,
  iconSize = 18,
}: WhatsAppInquiryButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Safe inside a wrapping <Link>: don't navigate, just open WhatsApp.
    e.preventDefault();
    e.stopPropagation();
    const url = getWhatsAppUrl(buildInquiryMessage(inquiry));
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center gap-2 py-4 px-8 text-sm font-medium uppercase tracking-wider transition-colors",
        "bg-[#25D366] text-white hover:bg-[#1ebe5b]",
        className
      )}
    >
      <MessageCircle size={iconSize} />
      {label}
    </button>
  );
}
