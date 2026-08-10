"use client";

import { getWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Always-visible WhatsApp enquiry button (bottom-left, so it never overlaps
 * the Style Assistant widget at bottom-right). Core conversion path for the
 * enquiry-based storefront.
 */
export function FloatingWhatsApp() {
  const href = getWhatsAppUrl(
    "Hello Sparenza & Co., I'd like to know more about your jewellery."
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-24 right-4 sm:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxury transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/60"
    >
      {/* Soft pulse to draw the eye */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping [animation-duration:2.5s]" />
      <svg
        viewBox="0 0 32 32"
        className="relative z-10 h-7 w-7 fill-current"
        aria-hidden="true"
      >
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.593 4.463 1.72 6.404L3.2 28.8l6.57-1.717a12.74 12.74 0 0 0 6.234 1.588h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.752-9.055A12.72 12.72 0 0 0 16.004 3.2Zm0 23.04h-.004a10.63 10.63 0 0 1-5.417-1.483l-.389-.231-4.028 1.053 1.074-3.928-.253-.403a10.6 10.6 0 0 1-1.626-5.648c0-5.867 4.775-10.64 10.643-10.64 2.842 0 5.513 1.108 7.523 3.12a10.57 10.57 0 0 1 3.117 7.526c0 5.867-4.775 10.641-10.643 10.641Zm5.834-7.968c-.32-.16-1.892-.933-2.185-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.213-.373.24-.693.08-.32-.16-1.35-.498-2.571-1.587-.95-.848-1.592-1.895-1.779-2.215-.186-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.735-.986-2.375-.26-.624-.524-.54-.72-.55l-.613-.011c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.146 3.093 1.306 3.307.16.213 2.256 3.445 5.466 4.83.764.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.892-.773 2.159-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373Z" />
      </svg>
    </a>
  );
}
