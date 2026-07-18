/* eslint-disable react-hooks/purity */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    subtitle: "The Celestial Collection",
    title: "Diamonds That\nCapture Starlight",
    description:
      "Each stone is hand-selected for its extraordinary fire and brilliance, set by master craftsmen with over three decades of expertise.",
    cta: "Explore Collection",
    href: "/collections/celestial",
    image: "/images/hero-ring.png",
  },
  {
    id: 2,
    subtitle: "Bridal Elegance",
    title: "Begin Your\nForever Story",
    description:
      "Discover engagement rings and wedding bands that symbolize your unique love story, crafted with GIA-certified diamonds.",
    cta: "View Bridal",
    href: "/collections/bridal",
    image: "/images/collections/hero-collection.png",
  },
  {
    id: 3,
    subtitle: "Limited Edition",
    title: "The Art of\nRare Beauty",
    description:
      "Only 25 pieces crafted worldwide. Exceptional D-color flawless diamonds in designs that transcend time.",
    cta: "Discover Now",
    href: "/collections/limited-edition",
    image: "/images/products/necklace.png",
  },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const slide = slides[current];

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-onyx">
      {/* Video Background Layer */}
      <motion.div style={{ y: parallaxY }} className="absolute inset-0 scale-110">
        {/* Using gradient overlay since we don't have a real video file */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C0B09] via-[#1A1814] to-[#0C0B09]" />

        {/* Animated particle field */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Diamond pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <pattern id="hero-diamonds" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-diamonds)" />
          </svg>
        </div>
      </motion.div>

      {/* Slide Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Gradients over image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 h-full container-luxury flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                custom={direction}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -60, opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Subtitle with line */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-12 h-px bg-gold origin-left"
                  />
                  <span className="text-[11px] uppercase tracking-luxury-wide text-gold font-medium">
                    {slide.subtitle}
                  </span>
                </motion.div>

                {/* Title */}
                <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-8 whitespace-pre-line">
                  {slide.title.split("\n").map((line, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  ))}
                </h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="text-white/50 text-base md:text-lg font-light leading-relaxed mb-12 max-w-lg"
                >
                  {slide.description}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Link
                    href={slide.href}
                    className="group relative inline-flex items-center gap-3 px-10 py-4.5 overflow-hidden rounded-full text-sm font-medium uppercase tracking-wider"
                  >
                    <span className="absolute inset-0 bg-gold transition-all duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gold-light opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative text-onyx">{slide.cta}</span>
                    <ArrowRight size={16} className="relative text-onyx transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-3 px-10 py-4.5 border border-white/20 text-white text-sm font-medium uppercase tracking-wider rounded-full hover:border-gold/50 hover:text-gold transition-all duration-500 backdrop-blur-sm"
                  >
                    View All Pieces
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side — Floating diamond shape */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-80 h-80"
            >
              {/* Rotating rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 320 320" fill="none" className="w-full h-full">
                  <circle cx="160" cy="160" r="150" stroke="#C9A96E" strokeWidth="0.3" opacity="0.3" />
                  <circle cx="160" cy="160" r="120" stroke="#C9A96E" strokeWidth="0.2" opacity="0.2" strokeDasharray="4 8" />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <svg viewBox="0 0 320 320" fill="none" className="w-full h-full">
                  <circle cx="160" cy="160" r="135" stroke="#E8D5B5" strokeWidth="0.2" opacity="0.15" strokeDasharray="2 12" />
                </svg>
              </motion.div>

              {/* Central diamond */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="140" height="180" viewBox="0 0 140 180" fill="none">
                  <defs>
                    <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="#E8D5B5" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#C9A96E" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <path d="M70 10L20 60L70 170L120 60Z" stroke="url(#heroGrad)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                  <path d="M20 60H120" stroke="url(#heroGrad)" strokeWidth="1" opacity="0.6" />
                  <path d="M70 10L45 60L70 170L95 60L70 10" stroke="url(#heroGrad)" strokeWidth="0.8" fill="none" opacity="0.4" />
                  {/* Sparkles */}
                  <circle cx="70" cy="10" r="3" fill="#C9A96E" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="20" cy="60" r="2" fill="#E8D5B5" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="120" cy="60" r="2" fill="#E8D5B5" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>

              {/* Ambient glow */}
              <div className="absolute inset-12 rounded-full bg-gold/8 blur-[60px] animate-glow" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Controls */}
      <div className="absolute bottom-10 left-0 right-0 z-20">
        <div className="container-luxury flex items-center justify-between">
          {/* Slide counter */}
          <div className="flex items-center gap-6">
            <span className="text-white/40 text-sm font-heading">
              {String(current + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <motion.div
                    className="h-0.5 rounded-full bg-white/30"
                    animate={{
                      width: current === index ? 40 : 16,
                      backgroundColor: current === index ? "#C9A96E" : "rgba(255,255,255,0.3)",
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </button>
              ))}
            </div>
            <span className="text-white/40 text-sm font-heading">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="hidden md:flex flex-col items-center gap-2"
          >
            <span className="text-[9px] uppercase tracking-luxury-wide text-white/30">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
          </motion.div>

          {/* Arrow Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setDirection(-1); setCurrent((prev) => (prev - 1 + slides.length) % slides.length); }}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:border-gold/40 hover:text-gold transition-all duration-300 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => { setDirection(1); setCurrent((prev) => (prev + 1) % slides.length); }}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-white/15 text-white/50 hover:border-gold/40 hover:text-gold transition-all duration-300 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
