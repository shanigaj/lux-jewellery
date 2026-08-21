"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { useGetProductsQuery } from "@/store/api/productApi";
import { hasRealImage } from "@/lib/product-image";

// A curated row of real diamond pieces (the API resolves `diamonds` to every
// diamond-set piece across the catalogue).
export function DiamondShowcase() {
  const { data, isLoading } = useGetProductsQuery({ category: "diamonds", limit: 12 });

  const products = useMemo(() => {
    const all = data?.data ?? [];
    const real = all.filter(hasRealImage);
    return (real.length >= 4 ? real : all).slice(0, 4);
  }, [data]);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-luxury">
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            The Diamond Edit
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Pure Brilliance
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Hand-selected diamond pieces from across our collections — where fire,
            brilliance and craftsmanship meet.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-6 lg:gap-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  variant="featured"
                  index={index}
                />
              ))}
        </div>

        <AnimatedSection animation="fadeUp" delay={0.4} className="text-center mt-10">
          <Link
            href="/categories/diamonds"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-foreground text-foreground text-[12px] font-medium uppercase tracking-wider rounded-full hover:bg-foreground hover:text-background transition-all duration-500"
          >
            View All Diamonds
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
