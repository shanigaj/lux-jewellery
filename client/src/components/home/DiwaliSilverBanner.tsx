"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const banners = [
  {
    id: 1,
    src: "/images/banners/diwali-silver-1-4k.jpg",
    alt: "Diwali Special Offer - 10% OFF on Silver Jewellery",
    title: "Diwali Special Offer",
    subtitle: "10% Off on Pure Silver Jewellery",
    href: "/products?category=silver",
  },
  {
    id: 2,
    src: "/images/banners/diwali-silver-2-4k.jpg",
    alt: "Diwali Festive Offer - 10% OFF on Silver Jewellery",
    title: "Diwali Festive Offer",
    subtitle: "10% Off on Fine Silver Jewellery & Auspicious Gifting",
    href: "/products?category=silver",
  },
];

export function DiwaliSilverBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 35,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sync active dot indicator
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Buttery-smooth autoplay without empty frame flashing
  useEffect(() => {
    if (!emblaApi || isHovered) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 4500);
    return () => clearInterval(timer);
  }, [emblaApi, isHovered]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  return (
    <section className="section-padding py-6 sm:py-10 bg-background">
      <div className="container-luxury">
        
        {/* Festive Header Tag */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">🪔</span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#B8860B] dark:text-[#E5C158]">
              Festive Silver Mahotsav
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Sparkles size={12} className="text-[#B8860B]" />
            <span className="hidden sm:inline">Flat 10% Off On Silver Jewellery</span>
            <span className="sm:hidden">10% Off</span>
          </div>
        </div>

        {/* Carousel Outer Frame */}
        <div
          className="relative group rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_15px_40px_rgba(0,0,0,0.4)] bg-[#1A0A1C]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Continuous Embla Track: Zero gaps between slides */}
          <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex touch-pan-y select-none">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="min-w-0 flex-[0_0_100%] relative aspect-[3072/1023] w-full"
                >
                  <Link
                    href={banner.href}
                    aria-label={banner.alt}
                    className="block relative w-full h-full"
                  >
                    <Image
                      src={banner.src}
                      alt={banner.alt}
                      fill
                      priority
                      unoptimized={true}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1400px"
                      className="object-contain object-center"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Slide Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollPrev();
            }}
            aria-label="Previous Slide"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Next Slide Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollNext();
            }}
            aria-label="Next Slide"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-8 w-8 sm:h-11 sm:w-11 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 group-hover:opacity-100 hover:scale-105 active:scale-95 shadow-lg"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Indicators (Dots + Active Pill) */}
          <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/15">
            {banners.map((banner, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={banner.id}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(index);
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-[#E5C158] shadow-[0_0_10px_rgba(229,193,88,0.8)]"
                      : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
