"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Shield } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { useGetProductsQuery } from "@/store/api/productApi";

export function LuxuryWatches() {
  const { data, isLoading } = useGetProductsQuery({ category: "watches" });
  const watches = data?.data ?? [];

  // Hide the whole section if there are no watches and we're done loading.
  if (!isLoading && watches.length === 0) return null;

  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
          <AnimatedSection animation="fadeRight">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={16} className="text-gold" />
              <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium">
                Timeless Luxury
              </p>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Luxury Watches
            </h2>
            <div className="w-12 h-px bg-gold mb-6" />
            <p className="text-muted-foreground font-light leading-relaxed mb-6">
              Masterpieces of horological artistry, each watch is a statement
              of refined taste. Swiss movements encased in precious metals,
              adorned with diamonds.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield size={14} className="text-gold" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} className="text-gold" />
                <span>Swiss Movement</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeLeft" delay={0.2} className="hidden lg:block">
            <div className="relative aspect-square max-w-md ml-auto">
              <Image
                src="/images/products/watch.png"
                alt="Luxury Watch"
                fill
                className="object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/10" />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-5 py-4 shadow-luxury-lg"
              >
                <p className="text-2xl font-heading text-gold">100%</p>
                <p className="text-[9px] uppercase tracking-luxury text-muted-foreground mt-0.5">
                  Authentic Swiss
                </p>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>

        {/* Watches Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : watches.map((watch, index) => (
                <ProductCard
                  key={watch._id}
                  product={watch}
                  variant="featured"
                  index={index}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
