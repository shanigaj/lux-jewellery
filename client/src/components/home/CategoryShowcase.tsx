"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    description: "From solitaires to eternity bands",
    count: 156,
    gradient: "from-[#C9A96E]/10 to-[#E8D5B5]/5",
    accent: "bg-gold/10",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    description: "Pendants, chains, and statement pieces",
    count: 98,
    gradient: "from-[#B76E79]/10 to-[#D4A0A7]/5",
    accent: "bg-rose-gold/10",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "Studs, hoops, and chandelier styles",
    count: 124,
    gradient: "from-[#E5E4E2]/20 to-[#F5F5F5]/5",
    accent: "bg-platinum/20",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "Tennis, bangles, and cuffs",
    count: 67,
    gradient: "from-[#C9A96E]/10 to-[#F7E7CE]/5",
    accent: "bg-champagne/20",
  },
];

export function CategoryShowcase() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-luxury">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Explore by Category
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Discover Our World
          </h2>
          <div className="line-separator mt-4" />
        </AnimatedSection>

        {/* Category Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <StaggerItem key={category.slug}>
              <Link href={`/categories/${category.slug}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-8 h-[280px] flex flex-col justify-between hover:border-gold/20 hover:shadow-luxury-lg transition-all duration-500"
                >
                  {/* Background Gradient */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      category.gradient
                    )}
                  />

                  {/* Decorative Circle */}
                  <div
                    className={cn(
                      "absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500",
                      category.accent
                    )}
                  />

                  {/* Diamond Icon */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-muted/80 group-hover:bg-gold/10 transition-colors duration-500">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-gold"
                      >
                        <path
                          d="M12 2L2 9L12 22L22 9L12 2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-xl text-foreground group-hover:text-gold transition-colors duration-300">
                        {category.name}
                      </h3>
                      <ArrowUpRight
                        size={18}
                        className="text-muted-foreground opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 group-hover:text-gold"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground font-light mb-3">
                      {category.description}
                    </p>
                    <span className="text-[10px] uppercase tracking-luxury text-gold/80">
                      {category.count} Pieces
                    </span>
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
