"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        {/* Diamond Icon */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-destructive"
          >
            <path
              d="M12 2L2 9L12 22L22 9L12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
          </svg>
        </div>

        <p className="text-[10px] uppercase tracking-luxury-wide text-gold mb-4">
          Something Went Wrong
        </p>

        <h1 className="font-heading text-3xl text-foreground mb-4">
          An Unexpected Error
        </h1>

        <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
          We apologize for the inconvenience. Our team has been notified and is
          working to resolve this issue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-onyx text-sm font-medium rounded-full hover:bg-gold-light transition-colors"
          >
            <RefreshCcw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground text-sm font-medium rounded-full hover:bg-muted transition-colors"
          >
            <Home size={14} />
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
