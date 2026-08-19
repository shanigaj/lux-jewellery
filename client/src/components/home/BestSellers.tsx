"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useGetProductsQuery } from "@/store/api/productApi";
import { hasRealImage } from "@/lib/product-image";
import type { IProduct } from "@/types/product.types";

// Rank by rating weighted by review count (0 for unrated pieces).
function popularity(p: IProduct): number {
  return (p.avgRating || 0) * Math.log10((p.reviewCount || 0) + 10);
}

const AUTOPLAY_MS = 3500;

export function BestSellers() {
  const { data, isLoading } = useGetProductsQuery({ limit: 40 });
  const [api, setApi] = useState<CarouselApi>();
  const [paused, setPaused] = useState(false);

  // Auto-advance the carousel; pauses while the pointer is over it.
  useEffect(() => {
    if (!api || paused) return;
    const timer = setInterval(() => {
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [api, paused]);

  // Real bestsellers with distinct photography — flagged first, then popularity.
  const products = useMemo(() => {
    const everything = data?.data ?? [];
    const withArt = everything.filter(hasRealImage);
    const base = withArt.length >= 4 ? withArt : everything;
    return [...base]
      .sort((a, b) => {
        const flag = Number(b.isBestseller) - Number(a.isBestseller);
        return flag !== 0 ? flag : popularity(b) - popularity(a);
      })
      .slice(0, 12);
  }, [data]);

  return (
    <section className="pt-12 md:pt-16 pb-16 md:pb-24 lg:pb-32 bg-gradient-to-b from-muted/40 via-background to-background overflow-hidden">
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

        {/* Carousel */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-muted-foreground">
                Swipe to explore {products.length} bestsellers
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <CarouselPrevious className="static translate-y-0 h-9 w-9" />
                <CarouselNext className="static translate-y-0 h-9 w-9" />
              </div>
            </div>
            <CarouselContent className="-ml-6">
              {products.map((product, index) => (
                <CarouselItem
                  key={product._id}
                  className="pl-6 basis-4/5 sm:basis-1/2 lg:basis-1/4"
                >
                  <ProductCard product={product} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
