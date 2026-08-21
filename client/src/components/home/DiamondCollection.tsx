/* eslint-disable react-hooks/purity */
"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Gem } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useCategoryImages } from "@/lib/useCategoryImages";

const diamondShapes = [
  { name: "Round Brilliant", pieces: 342, slug: "round" },
  { name: "Princess Cut", pieces: 189, slug: "princess" },
  { name: "Oval", pieces: 156, slug: "oval" },
  { name: "Emerald", pieces: 98, slug: "emerald" },
  { name: "Pear", pieces: 127, slug: "pear" },
  { name: "Marquise", pieces: 64, slug: "marquise" },
];

export function DiamondCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { heroImage } = useCategoryImages();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-20 -bottom-20">
        <Image
          src={heroImage}
          alt="Diamond Collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />
      </motion.div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-gold/40"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <AnimatedSection animation="fadeRight">
            <div className="flex items-center gap-3 mb-6">
              <Gem size={16} className="text-gold" />
              <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium">
                The 4Cs of Excellence
              </p>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Our Diamond{" "}
              <span className="text-gradient-gold">Collection</span>
            </h2>

            <div className="w-16 h-px bg-gold mb-8" />

            <p className="text-white/50 font-light leading-relaxed text-base mb-6">
              Every diamond in our collection is hand-selected by our GIA-certified
              gemologists. We accept only the top 1% of the world&apos;s diamonds —
              those that possess extraordinary fire, brilliance, and scintillation.
            </p>

            <p className="text-white/50 font-light leading-relaxed text-base mb-10">
              From classic round brilliants to modern fancy shapes, find the
              diamond that speaks to your soul.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 sm:gap-8 mb-12">
              {[
                { value: "10,000+", label: "Certified Diamonds" },
                { value: "D-F", label: "Color Range" },
                { value: "IF-VVS", label: "Clarity Range" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-heading text-gold">{stat.value}</p>
                  <p className="text-[9px] sm:text-[10px] uppercase tracking-luxury text-white/40 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/categories/diamonds"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-onyx text-sm font-medium uppercase tracking-wider rounded-full hover:bg-gold-light transition-all duration-500 hover:shadow-gold-lg"
            >
              Explore Diamonds
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>

          {/* Right — Diamond Shapes Grid */}
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {diamondShapes.map((shape, index) => (
                <motion.div
                  key={shape.slug}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <Link
                    href="/categories/diamonds"
                    className="group block p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-gold/30 hover:bg-white/10 transition-all duration-500 text-center"
                  >
                    {/* Diamond icon */}
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        className="w-10 h-10 text-gold/60 group-hover:text-gold transition-colors"
                      >
                        <path
                          d="M20 4L6 16L20 36L34 16Z"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinejoin="round"
                        />
                        <path d="M6 16H34" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-medium text-white group-hover:text-gold transition-colors mb-1">
                      {shape.name}
                    </h4>
                    <p className="text-[10px] text-white/40 tracking-wider">
                      {shape.pieces} pieces
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
