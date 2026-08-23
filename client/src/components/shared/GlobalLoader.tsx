import { cn } from "@/lib/utils";

/**
 * Instant, brand-consistent full-screen loader.
 *
 * Pure inline SVG + CSS animation — NO images or fonts to fetch — so it paints
 * on the very first frame. Used as the Redux-persist rehydration fallback
 * (see Providers) and the root route loading UI, so visitors see the Sparenza
 * mark immediately instead of a blank screen while the app boots.
 */
export function GlobalLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background",
        className
      )}
    >
      {/* Floating, glowing diamond */}
      <div className="relative">
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-float text-gold"
          aria-hidden="true"
        >
          <path d="M12 2L2 9L12 22L22 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M2 9H22" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 2L8 9L12 22L16 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gold/20 blur-xl animate-glow" />
      </div>

      {/* Wordmark */}
      <p className="mt-6 font-heading text-xl tracking-wide text-foreground">
        Sparenza <span className="text-gold">&amp; Co.</span>
      </p>

      {/* Spinner — clear "still working" cue */}
      <div className="mt-6 h-6 w-6 rounded-full border-2 border-gold/25 border-t-gold animate-spin" />
    </div>
  );
}
