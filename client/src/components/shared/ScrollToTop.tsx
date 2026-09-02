"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Next's App Router doesn't reliably reset the scroll position to the top when
 * navigating between two pages that share a dynamic segment (e.g. product →
 * product via a related / recently-viewed link) or that render a client-side
 * loading state first — so the new page can open scrolled to the middle/bottom.
 *
 * This forces the top on every pathname change, while leaving in-page `#anchor`
 * links to do their own scrolling.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
