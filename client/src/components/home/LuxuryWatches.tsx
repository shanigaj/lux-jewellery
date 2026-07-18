"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Shield } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const watches = [
  {
    id: "w-1",
    name: "Royal Chronograph",
    slug: "royal-chronograph",
    price: "₹12,50,000",
    tagline: "Swiss Movement • 18K Gold",
    image: "/images/products/watch.png",
  },
  {
    id: "w-2",
    name: "Diamond Constellation",
    slug: "diamond-constellation",
    price: "₹8,75,000",
    tagline: "Automatic • Diamond Bezel",
    image: "/images/products/watch.png",
  },
  {
    id: "w-3",
    name: "Heritage Tourbillon",
    slug: "heritage-tourbillon",
    price: "₹24,00,000",
    tagline: "Limited Edition • Platinum",
    image: "/images/products/watch.png",
  },
];

export function LuxuryWatches() {
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
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {watches.map((watch) => (
            <StaggerItem key={watch.id}>
              <Link href={`/watches/${watch.slug}`}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                  className="group relative bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-gold/20 hover:shadow-luxury-lg transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={watch.image}
                      alt={watch.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Content — overlapping the image */}
                  <div className="relative -mt-20 px-6 pb-6 z-10">
                    <p className="text-[10px] uppercase tracking-luxury text-gold font-medium mb-2">
                      {watch.tagline}
                    </p>
                    <h3 className="font-heading text-xl text-foreground group-hover:text-gold transition-colors mb-2">
                      {watch.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="font-heading text-lg text-foreground">
                        {watch.price}
                      </p>
                      <ArrowRight
                        size={16}
                        className="text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-gold transition-all duration-400"
                      />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
