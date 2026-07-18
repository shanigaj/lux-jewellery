"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Gem,
  Truck,
  RefreshCcw,
  Award,
  HeartHandshake,
} from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const trustBadges = [
  {
    icon: Gem,
    title: "GIA Certified",
    description: "Every diamond comes with international certification",
  },
  {
    icon: ShieldCheck,
    title: "BIS Hallmarked",
    description: "Guaranteed purity of gold and platinum",
  },
  {
    icon: Truck,
    title: "Insured Delivery",
    description: "Fully insured & secure complimentary shipping",
  },
  {
    icon: RefreshCcw,
    title: "Lifetime Exchange",
    description: "Exchange or upgrade your jewellery anytime",
  },
  {
    icon: Award,
    title: "30-Day Returns",
    description: "Hassle-free returns within 30 days",
  },
  {
    icon: HeartHandshake,
    title: "Concierge Service",
    description: "Personal styling & purchase assistance",
  },
];

export function TrustBadges() {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            The LUX Promise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            Why Choose LUX Diamonds
          </h2>
          <div className="line-separator mt-4" />
        </AnimatedSection>

        {/* Trust Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustBadges.map((badge) => (
            <StaggerItem key={badge.title}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group flex items-start gap-5 p-6 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all duration-500"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-gold/10 group-hover:bg-gold/15 transition-colors duration-500">
                  <badge.icon
                    size={20}
                    className="text-gold"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-gold transition-colors duration-300">
                    {badge.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
