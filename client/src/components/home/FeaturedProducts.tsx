"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { useGetProductsQuery } from "@/store/api/productApi";
import { hasRealImage } from "@/lib/product-image";

export function FeaturedProducts() {
  // Pull a wide set and surface pieces that have real, distinct photography
  // (avoids the repeated stock-image seed products dominating the home page).
  const { data, isLoading } = useGetProductsQuery({ limit: 40 });
  const products = useMemo(() => {
    const all = data?.data ?? [];
    const real = all.filter(hasRealImage);
    return (real.length >= 4 ? real : all).slice(0, 4);
  }, [data]);

  return (
    <section className="pt-16 md:pt-24 lg:pt-32 pb-14 md:pb-16 bg-muted/30">
      <div className="container-luxury">
        {/* Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Curated for You
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Featured Masterpieces
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Handpicked from our finest collections, each piece represents the pinnacle of diamond craftsmanship.
          </p>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  variant="featured"
                  index={index}
                />
              ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fadeUp" delay={0.4} className="text-center mt-10">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-foreground text-foreground text-[12px] font-medium uppercase tracking-wider rounded-full hover:bg-foreground hover:text-background transition-all duration-500"
          >
            View All Collections
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
