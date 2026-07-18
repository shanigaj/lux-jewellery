"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { useGetProductsQuery } from "@/store/api/productApi";

export function BestSellers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetProductsQuery({ limit: 8 });
  const products = data?.data ?? [];

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
              href="/products"
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
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[280px] lg:w-[300px]">
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((product, index) => (
                <div key={product._id} className="flex-shrink-0 w-[280px] lg:w-[300px]">
                  <ProductCard product={product} index={index} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
