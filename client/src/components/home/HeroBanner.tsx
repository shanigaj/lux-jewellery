/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const slides = [
  {
    id: 1,
    subtitle: "The Celestial Collection",
    lead: "Diamonds that capture",
    em: "starlight",
    tail: "",
    description:
      "Each stone is hand-selected for its extraordinary fire and brilliance, set by master craftsmen with over three decades of expertise.",
    cta: "Explore Collection",
    href: "/collections/celestial",
  },
  {
    id: 2,
    subtitle: "Bridal Elegance",
    lead: "Begin your",
    em: "forever",
    tail: "story",
    description:
      "Discover engagement rings and wedding bands that symbolize your unique love story, crafted with GIA-certified diamonds.",
    cta: "View Bridal",
    href: "/collections/bridal",
  },
  {
    id: 3,
    subtitle: "Limited Edition",
    lead: "The art of",
    em: "rare beauty",
    tail: "",
    description:
      "Only 25 pieces crafted worldwide. Exceptional D-color flawless diamonds in designs that transcend time.",
    cta: "Discover Now",
    href: "/collections/limited-edition",
  },
];

// Soft bokeh points — subtle shimmer that plays even before a real video loads.
const bokeh = [
  { x: 78, y: 20, s: 120, c: "#0B5D3B", d: 1.2 },
  { x: 64, y: 62, s: 100, c: "#7E6222", d: 2.1 },
  { x: 88, y: 74, s: 80, c: "#0B5D3B", d: 0.6 },
  { x: 50, y: 36, s: 70, c: "#7E6222", d: 2.6 },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Respect reduced-motion: pause the background video.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && videoRef.current) videoRef.current.pause();
  }, []);

  const slide = slides[current];
  const waHref = getWhatsAppUrl(
    `Hello LUX DIAMONDS, I'd like to enquire about the ${slide.subtitle}.`
  );

  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden bg-background">
      {/* ── Layer 0: luxurious bokeh shimmer (always present) ── */}
      <div className="pointer-events-none absolute inset-0">
        {bokeh.map((b, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.s,
              height: b.s,
              backgroundColor: b.c,
              opacity: 0.035,
            }}
            animate={{ opacity: [0.02, 0.045, 0.02], scale: [1, 1.15, 1] }}
            transition={{ duration: 9 + i, repeat: Infinity, delay: b.d, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Layer 1: background video (poster = existing hero image as graceful fallback) ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-ring.png"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Layer 2: cream scrim — enough on the left for text, clears out so the video shows ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-background/15" />

      {/* subtle diamond pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <pattern id="hero-diamonds" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="#0B5D3B" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-diamonds)" />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="container-luxury relative z-10 flex min-h-[90vh] items-center">
        <div className="max-w-2xl py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -24, opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Kicker */}
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-12 origin-left bg-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
                  {slide.subtitle}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-5xl leading-[1.05] text-foreground [text-shadow:0_2px_28px_rgba(247,243,236,0.85)] md:text-6xl lg:text-7xl">
                {slide.lead}{" "}
                <em className="italic text-primary">{slide.em}</em>
                {slide.tail ? <> {slide.tail}</> : null}
              </h1>

              {/* Description */}
              <p className="mt-7 max-w-md text-base font-light leading-relaxed text-muted-foreground">
                {slide.description}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={slide.href}
                  className="group inline-flex items-center gap-3 rounded-[2px] bg-primary px-9 py-4 text-[12px] font-semibold uppercase tracking-wider text-primary-foreground transition-all duration-500 hover:bg-[#0A4E32] hover:shadow-md"
                >
                  {slide.cta}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[2px] border border-foreground/25 bg-background/40 px-9 py-4 text-[12px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm transition-all duration-500 hover:border-primary"
                >
                  Enquire on <span className="text-gold">WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Slide indicator ── */}
      <div className="container-luxury absolute inset-x-0 bottom-10 z-10 flex items-center gap-6">
        <span className="font-heading text-sm text-muted-foreground tabular-nums">
          {String(current + 1).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="py-2"
            >
              <motion.span
                className="block h-px rounded-full"
                animate={{
                  width: current === index ? 40 : 16,
                  backgroundColor: current === index ? "#7E6222" : "#C9BFAB",
                }}
                transition={{ duration: 0.5 }}
              />
            </button>
          ))}
        </div>
        <span className="font-heading text-sm text-muted-foreground tabular-nums">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
