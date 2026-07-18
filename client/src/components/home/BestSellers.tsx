"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, ArrowRight, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const bestSellers = [
  {
    id: "bs-1",
    name: "Royal Heritage Solitaire",
    slug: "royal-heritage-solitaire",
    price: 325000,
    image: "/images/hero-ring.png",
    specs: "2.0ct • Round Brilliant • D/IF",
    soldCount: 1240,
  },
  {
    id: "bs-2",
    name: "Empress Tennis Necklace",
    slug: "empress-tennis-necklace",
    price: 485000,
    image: "/images/products/necklace.png",
    specs: "5.0ct Total • Round • D/VVS1",
    soldCount: 890,
  },
  {
    id: "bs-3",
    name: "Diamond Cascade Earrings",
    slug: "diamond-cascade-earrings",
    price: 195000,
    image: "/images/products/earrings.png",
    specs: "1.5ct Total • Pear • E/VVS2",
    soldCount: 1560,
  },
  {
    id: "bs-4",
    name: "Infinity Diamond Bracelet",
    slug: "infinity-diamond-bracelet",
    price: 275000,
    image: "/images/products/bracelet.png",
    specs: "3.0ct Total • Round • D/VVS1",
    soldCount: 720,
  },
  {
    id: "bs-5",
    name: "Twilight Pear Pendant",
    slug: "twilight-pear-pendant",
    price: 145000,
    image: "/images/products/necklace.png",
    specs: "1.2ct • Pear • F/VS1",
    soldCount: 2100,
  },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <AnimatedSection animation="fadeUp">
            <div className="flex items-center gap-3 mb-4">
              <Flame size={16} className="text-gold" />
              <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium">
                Most Loved
              </p>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
              Best Sellers
            </h2>
            <p className="text-muted-foreground font-light mt-3 max-w-md">
              Our clients&apos; most cherished pieces — proven by thousands of love stories.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fadeUp" delay={0.2}>
            <Link
              href="/products?sort=bestsellers"
              className="group inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              View All Bestsellers
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>

        {/* Horizontal Scroll Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 -mx-4 px-4 lg:mx-0 lg:px-0 scroll-smooth no-scrollbar"
        >
          {bestSellers.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex-shrink-0 w-[280px] lg:w-[300px]"
            >
              <Link href={`/products/${product.slug}`}>
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Sold count badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/90 text-onyx text-[9px] font-semibold uppercase tracking-wider">
                      <Flame size={10} />
                      {product.soldCount.toLocaleString()} sold
                    </span>
                  </div>

                  {/* Hover cart button */}
                  <motion.div
                    className="absolute bottom-4 right-4 z-10 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400"
                  >
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-luxury text-onyx hover:bg-gold transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag size={16} />
                    </button>
                  </motion.div>
                </div>

                {/* Info */}
                <div className="mt-4 space-y-1.5">
                  <h3 className="font-heading text-base text-foreground group-hover:text-gold transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-light">{product.specs}</p>
                  <p className="font-heading text-lg text-foreground">{formatINR(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
