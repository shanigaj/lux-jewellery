"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import cloudinaryLoader from "@/lib/cloudinary-loader";
import { useCategoryImages } from "@/lib/useCategoryImages";

// Each tile shows a curated, representative piece so the imagery renders
// instantly — it no longer waits on the full catalogue fetch (which left the
// cards blank for several seconds). The live piece-count below still comes from
// the DB. Swap these URLs for a newer hero piece any time.
const collections = [
  {
    name: "Rings",
    slug: "rings",
    dbCategory: "rings",
    description: "Where love stories begin",
    offset: "lg:mt-0",
    image:
      "https://res.cloudinary.com/dtjxooom/image/upload/v1787247749/sparenza/sparenza-blossom-diamond-engagement-ring/main.webp",
  },
  {
    name: "Necklaces & Pendants",
    slug: "necklaces",
    dbCategory: "necklaces",
    description: "Grace that adorns",
    offset: "lg:mt-14",
    image:
      "https://res.cloudinary.com/dtjxooom/image/upload/v1787247650/sparenza/sparenza-abstract-loop-pendant-necklace-in-gold/main.webp",
  },
  {
    name: "Earrings",
    slug: "earrings",
    dbCategory: "earrings",
    description: "Frames of brilliance",
    offset: "lg:mt-6",
    image:
      "https://res.cloudinary.com/dtjxooom/image/upload/v1787247664/sparenza/sparenza-amethyst-halo-teardrop-drop-earrings/main.webp",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    dbCategory: "bracelets",
    description: "Circles of elegance",
    offset: "lg:mt-20",
    image:
      "https://res.cloudinary.com/dtjxooom/image/upload/v1787247673/sparenza/sparenza-art-deco-diamond-bracelet/main.webp",
  },
];

export function Collections() {
  // Live product list → real per-category counts. (Imagery is curated per tile
  // above so it renders instantly instead of waiting on this fetch.)
  const { products } = useCategoryImages();
  const root = useRef<HTMLElement>(null);

  const countFor = (dbCategory: string) =>
    products.filter((p) => {
      const cat = typeof p.category === "string" ? p.category : p.category?.slug;
      return cat === dbCategory;
    }).length;

  // ── GSAP: an editorial reveal that's distinct from a plain fade-up ──
  // Each card unmasks from the bottom (clip-path) while its photo drifts with a
  // parallax scrub, the eyebrow line draws itself in, and the copy staggers up.
  useGSAP(
    () => {
      // Register client-side only — never at module scope (would run during SSR).
      gsap.registerPlugin(ScrollTrigger);

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Hide the cards from JS (not inline CSS) so that if this effect never
      // runs, they degrade to fully visible instead of staying blank.
      gsap.set(".cx-card", { autoAlpha: 0 });

      // Heading — a soft rise + underline draw.
      gsap.from(".cx-head > *", {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      const cards = gsap.utils.toArray<HTMLElement>(".cx-card");

      cards.forEach((card, i) => {
        const img = card.querySelector<HTMLElement>(".cx-img");
        const copy = card.querySelectorAll<HTMLElement>(".cx-copy > *");

        if (reduce) {
          gsap.set(card, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(copy, { autoAlpha: 1, y: 0 });
          return;
        }

        // Curtain reveal of the whole card.
        gsap
          .timeline({
            scrollTrigger: { trigger: card, start: "top 88%" },
          })
          .fromTo(
            card,
            { clipPath: "inset(100% 0% 0% 0%)", autoAlpha: 0, y: 40 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power4.out",
              delay: i * 0.08,
            }
          )
          .fromTo(
            copy,
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 },
            "-=0.5"
          );

        // Continuous parallax on the photo while the card is in view.
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="section-padding bg-background overflow-hidden"
    >
      <div className="container-luxury">
        {/* Section Header */}
        <div className="cx-head text-center mb-16 max-w-xl mx-auto">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Our Collections
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Explore by Category
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light leading-relaxed">
            Each collection tells a unique story of craftsmanship, heritage, and
            timeless beauty.
          </p>
        </div>

        {/* Editorial column layout — tall portraits with an alternating rhythm */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {collections.map((collection, index) => {
            const count = countFor(collection.dbCategory);
            const countLabel =
              count > 0
                ? `${count} ${count === 1 ? "Piece" : "Pieces"}`
                : "Coming Soon";
            return (
              <Link
                key={collection.slug}
                href={`/categories/${collection.slug}`}
                className={cn("cx-card group block", collection.offset)}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[3/4]">
                  {/* Parallax photo (taller than frame so drift never gaps) */}
                  <div className="cx-img absolute -inset-y-[10%] inset-x-0 will-change-transform">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      loader={cloudinaryLoader}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10 transition-colors duration-500 group-hover:from-black/80" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl" />

                  {/* Index number */}
                  <span className="absolute top-5 left-5 font-heading text-sm text-white/70 tracking-widest">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Hover arrow */}
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/25 flex items-center justify-center text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <ArrowUpRight size={16} />
                  </span>

                  {/* Content */}
                  <div className="cx-copy absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10">
                    <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-2">
                      {countLabel}
                    </p>
                    <h3 className="font-heading text-xl sm:text-2xl text-white leading-tight transition-transform duration-500 group-hover:-translate-y-0.5">
                      {collection.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 font-light mt-1">
                      {collection.description}
                    </p>
                    {/* Gold underline that draws on hover */}
                    <span className="mt-4 block h-px w-8 bg-gold/80 origin-left transition-transform duration-500 group-hover:scale-x-[3]" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
