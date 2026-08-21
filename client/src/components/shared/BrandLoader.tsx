import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

interface BrandLoaderProps {
  /** Optional caption under the mark. */
  label?: string;
  /** Fill the viewport (route/page loaders) vs. sit inline in a section. */
  fullscreen?: boolean;
  className?: string;
}

/**
 * Brand-consistent loading state — the Sparenza mark with a soft breathing
 * animation and a gold progress arc. Use anywhere a wait is noticeable.
 */
export function BrandLoader({ label = "Loading", fullscreen = true, className }: BrandLoaderProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center gap-6 bg-background",
        fullscreen ? "min-h-[70vh]" : "py-20",
        className
      )}
    >
      <div className="animate-pulse [animation-duration:1.6s]">
        <Logo size="lg" />
      </div>
      <div className="h-7 w-7 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      {label && (
        <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">{label}…</p>
      )}
    </div>
  );
}
