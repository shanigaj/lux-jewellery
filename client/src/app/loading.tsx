export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background">
      {/* Animated Diamond */}
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="animate-float text-gold"
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

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl animate-glow" />
      </div>

      {/* Brand */}
      <div className="mt-6 text-center">
        <p className="text-xs uppercase tracking-luxury-wide text-muted-foreground font-light">
          Sparenza &amp; Co.
        </p>
      </div>

      {/* Loading bar */}
      <div className="mt-8 w-32 h-px bg-border overflow-hidden rounded-full">
        <div className="h-full bg-gold animate-shimmer" style={{ width: "100%" }} />
      </div>
    </div>
  );
}
