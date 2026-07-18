import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {/* 404 Number */}
        <div className="relative mb-8">
          <p className="text-[120px] md:text-[160px] font-heading font-bold text-border/30 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gold"
            >
              <path
                d="M12 2L2 9L12 22L22 9L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M2 9H22" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 2L8 9L12 22L16 9L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-luxury-wide text-gold mb-4">
          Page Not Found
        </p>

        <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
          This Page Has Vanished
        </h1>

        <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
          Like the rarest diamond, the page you&apos;re looking for is beyond our
          reach. Let us guide you back to our collection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-onyx text-sm font-medium rounded-full hover:bg-gold-light transition-all duration-300"
          >
            Return Home
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-border text-foreground text-sm font-medium rounded-full hover:bg-muted transition-colors"
          >
            Browse Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
