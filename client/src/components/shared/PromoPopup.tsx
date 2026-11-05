"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

/**
 * First-load promotional popup (ecommerce-style).
 *
 * Shows a festive offer banner the first time the site is opened in a browsing
 * session, with a clear close button, backdrop-click and Escape to dismiss.
 * Once dismissed it stays hidden for the rest of the session so it never nags
 * on every page navigation; it reappears on a fresh visit.
 *
 * To run a new campaign, bump CAMPAIGN_KEY and swap the image/href below.
 */
const CAMPAIGN_KEY = "promo-popup-diwali-2026";
const OPEN_DELAY_MS = 900; // small delay so it feels intentional, not jarring

export default function PromoPopup() {
  const [open, setOpen] = useState(false);

  // Decide whether to show it, shortly after first load.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(CAMPAIGN_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private mode / blocked) — show anyway.
    }
    if (dismissed) return;

    const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(CAMPAIGN_KEY, "1");
    } catch {
      // ignore — a non-persisted dismissal is fine.
    }
  }, []);

  // Lock body scroll + close on Escape while the popup is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Diwali special offer"
      onClick={close}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[600px] animate-in zoom-in-95 fade-in-0 duration-300"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Close offer"
          className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-10 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white text-onyx shadow-[0_6px_20px_rgba(0,0,0,0.45)] border border-black/10 flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:rotate-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Banner — clicking it goes to the offer and closes the popup */}
        <Link
          href="/products?category=silver"
          onClick={close}
          aria-label="Shop the Diwali collection — 10% off"
          className="block relative w-full aspect-[1599/794] overflow-hidden rounded-xl sm:rounded-2xl border border-[#D4AF37]/50 shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
        >
          <Image
            src="/images/banners/diwali-celebration-popup.jpg"
            alt="A Celebration of Light this Diwali — Flat 10% off. Discover the collection."
            fill
            priority
            sizes="(max-width: 640px) 92vw, 600px"
            className="object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
