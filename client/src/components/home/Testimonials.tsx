"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Rating } from "@/components/shared/Rating";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The engagement ring my fiancé chose from LUX Diamonds is breathtaking. The diamond brilliance is unlike anything I've ever seen. The attention to detail in the setting is truly remarkable.",
    product: "Celestial Solitaire Ring",
  },
  {
    id: 2,
    name: "Rajesh Kapoor",
    location: "Delhi",
    rating: 5,
    text: "I've purchased jewellery from many luxury brands, but LUX Diamonds stands apart. Their concierge service made the entire experience feel exclusive and personal.",
    product: "Heritage Tennis Bracelet",
  },
  {
    id: 3,
    name: "Ananya Desai",
    location: "Bangalore",
    rating: 5,
    text: "The Aurora pendant is my everyday luxury. It catches light beautifully and I receive compliments everywhere. Worth every penny — this is true craftsmanship.",
    product: "Aurora Diamond Pendant",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-luxury">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Voices of Elegance
          </h2>
          <div className="line-separator mt-4" />
        </AnimatedSection>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative bg-card rounded-xl border border-border/50 p-8 hover:border-gold/15 hover:shadow-luxury transition-all duration-500"
            >
              {/* Quote Icon */}
              <Quote
                size={28}
                className="text-gold/20 mb-6"
                strokeWidth={1}
              />

              {/* Rating */}
              <Rating value={testimonial.rating} size="sm" className="mb-4" />

              {/* Testimonial Text */}
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 line-clamp-4">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Divider */}
              <div className="w-8 h-px bg-gold/30 mb-4" />

              {/* Author */}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {testimonial.location}
                </p>
                <p className="text-[10px] text-gold uppercase tracking-wider mt-2">
                  Purchased: {testimonial.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
