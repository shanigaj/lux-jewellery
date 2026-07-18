"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const collections = [
  {
    name: "Engagement Rings",
    slug: "engagement-rings",
    description: "Where love stories begin",
    image: "/images/hero-ring.png",
    count: 186,
    gradient: "from-[#C9A96E]/20 via-transparent to-transparent",
  },
  {
    name: "Necklaces & Pendants",
    slug: "necklaces",
    description: "Grace that adorns",
    image: "/images/products/necklace.png",
    count: 124,
    gradient: "from-[#B76E79]/20 via-transparent to-transparent",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Frames of brilliance",
    image: "/images/products/earrings.png",
    count: 98,
    gradient: "from-[#E8D5B5]/20 via-transparent to-transparent",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Circles of elegance",
    image: "/images/products/bracelet.png",
    count: 67,
    gradient: "from-[#C9A96E]/20 via-transparent to-transparent",
  },
];

export function Collections() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-luxury">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Our Collections
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Explore by Category
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
            Each collection tells a unique story of craftsmanship,
            heritage, and timeless beauty.
          </p>
        </AnimatedSection>

        {/* Collections Grid — 2 large + 2 small */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "group relative",
                index < 2 ? "lg:col-span-2 lg:row-span-1" : "lg:col-span-2"
              )}
            >
              <Link href={`/collections/${collection.slug}`}>
                <div
                  className={cn(
                    "relative overflow-hidden rounded-2xl cursor-pointer",
                    index < 2 ? "aspect-[16/10]" : "aspect-[16/9]"
                  )}
                >
                  {/* Image */}
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-500" />
                  <div className={cn("absolute inset-0 bg-gradient-to-t", collection.gradient, "opacity-60")} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <motion.div
                      initial={false}
                      className="transform transition-transform duration-500 group-hover:-translate-y-2"
                    >
                      <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-2">
                        {collection.count} Pieces
                      </p>
                      <h3 className="font-heading text-2xl md:text-3xl text-white mb-1">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-white/60 font-light">
                        {collection.description}
                      </p>
                    </motion.div>

                    {/* Hover Arrow */}
                    <motion.div
                      className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                    >
                      <ArrowUpRight size={16} />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
