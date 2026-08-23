import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The single, app-wide loading screen — the Sparenza logo with a soft
 * breathing pulse and a gold spinner. Used everywhere a wait is shown
 * (Redux-persist rehydration in Providers, route loading.tsx files, and
 * client data fetches) so visitors only ever see one consistent loader.
 *
 * The logo is a tiny (~52KB, priority-loaded) PNG, so this paints quickly.
 */
export function GlobalLoader({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-background",
        className
      )}
    >
      <div className="animate-pulse [animation-duration:1.6s]">
        <Image
          src="/images/logo-sparenza-v3.png"
          alt="Sparenza & Co."
          width={200}
          height={100}
          priority
          className="h-auto w-[180px] object-contain"
        />
      </div>
      <div className="h-6 w-6 rounded-full border-2 border-gold/25 border-t-gold animate-spin" />
    </div>
  );
}
