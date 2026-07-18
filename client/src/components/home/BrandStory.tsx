"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function BrandStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);

  return (
    <section ref={ref} className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-b from-onyx via-[#1A1814] to-onyx"
      >
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <pattern id="story-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#story-pattern)" />
          </svg>
        </div>
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Visual */}
          <AnimatedSection animation="fadeRight">
            <div className="relative">
              {/* Main image placeholder */}
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-[#2A2520] to-[#1A1814] border border-gold/10">
                <div className="h-full flex items-center justify-center">
                  <motion.svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <circle cx="100" cy="100" r="90" stroke="#C9A96E" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="100" cy="100" r="70" stroke="#C9A96E" strokeWidth="0.3" opacity="0.2" />
                    <circle cx="100" cy="100" r="50" stroke="#C9A96E" strokeWidth="0.3" opacity="0.15" />
                    <path d="M100 30L60 80L100 170L140 80Z" stroke="#C9A96E" strokeWidth="1" fill="none" opacity="0.5" />
                    <path d="M60 80H140" stroke="#C9A96E" strokeWidth="0.5" opacity="0.3" />
                  </motion.svg>
                </div>
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 md:right-8 bg-card border border-border/50 rounded-xl p-6 shadow-luxury-lg"
              >
                <p className="text-3xl font-heading text-gold">30+</p>
                <p className="text-[10px] uppercase tracking-luxury text-muted-foreground mt-1">
                  Years of Mastery
                </p>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
                  Our Heritage
                </p>
                <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-2">
                  A Legacy of
                  <br />
                  <span className="text-gradient-gold">Extraordinary</span> Craft
                </h2>
              </div>

              <div className="w-12 h-px bg-gold" />

              <p className="text-white/60 font-light leading-relaxed">
                For over three decades, our master artisans have dedicated their lives
                to perfecting the art of diamond jewellery. Every piece that leaves our
                atelier carries within it the spirit of unwavering commitment to
                excellence.
              </p>

              <p className="text-white/60 font-light leading-relaxed">
                We source only the most exceptional diamonds — each one hand-selected
                for its unique fire, brilliance, and character. Our standards exceed
                industry benchmarks because true luxury accepts no compromise.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-4">
                {[
                  { value: "10K+", label: "Pieces Crafted" },
                  { value: "50+", label: "Master Artisans" },
                  { value: "99%", label: "Client Satisfaction" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <p className="text-2xl md:text-3xl font-heading text-gold">
                      {stat.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-luxury text-white/40 mt-1">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  );
}
