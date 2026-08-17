"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { useCategoryImages } from "@/lib/useCategoryImages";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    title: "Beyond Expectations",
    text: "The engagement ring my fiancé chose from Sparenza & Co. is absolutely breathtaking. The diamond brilliance is unlike anything I've ever seen. The attention to detail in the platinum setting is truly remarkable. Every time I look at my hand, I fall in love all over again.",
    product: "Celestial Solitaire Ring",
    category: "rings",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: 2,
    name: "Rajesh Kapoor",
    location: "Delhi, India",
    rating: 5,
    title: "Exceptional Service & Quality",
    text: "I've purchased jewellery from many luxury brands across the world, but Sparenza & Co. stands apart. Their concierge service made the entire experience feel exclusive and personal. The tennis bracelet I bought for our anniversary exceeded every expectation.",
    product: "Heritage Tennis Bracelet",
    category: "bracelets",
    date: "1 month ago",
    verified: true,
  },
  {
    id: 3,
    name: "Ananya Desai",
    location: "Bangalore, India",
    rating: 5,
    title: "My Everyday Luxury",
    text: "The Aurora pendant has become my signature piece. It catches light beautifully and I receive compliments everywhere I go. The craftsmanship is impeccable — you can feel the quality the moment you hold it. Worth every penny.",
    product: "Aurora Diamond Pendant",
    category: "necklaces",
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: 4,
    name: "Vikram Mehta",
    location: "Hyderabad, India",
    rating: 5,
    title: "Perfect Anniversary Gift",
    text: "Surprised my wife with the Radiance Drop Earrings for our 10th anniversary. The tears of joy said it all. The packaging, the presentation, the reveal — Sparenza & Co. made every moment magical. This is what luxury should feel like.",
    product: "Radiance Drop Earrings",
    category: "earrings",
    date: "1 week ago",
    verified: true,
  },
];

export function CustomerReviews() {
  const [current, setCurrent] = useState(0);
  const { imageFor } = useCategoryImages();

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  const review = reviews[current];

  return (
    <section className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-luxury">
        {/* Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Client Stories
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Voices of Elegance
          </h2>
          <div className="line-separator mt-4 mb-6" />

          {/* Aggregate rating */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-gold text-gold" />
              ))}
            </div>
            <span className="text-sm text-foreground font-medium">4.9/5</span>
            <span className="text-sm text-muted-foreground">from 2,847 reviews</span>
          </div>
        </AnimatedSection>

        {/* Review Carousel */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                {/* Product Image */}
                <div className="lg:col-span-2">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={imageFor(review.category)}
                      alt={review.product}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[9px] uppercase tracking-luxury text-gold">Purchased</p>
                      <p className="text-sm text-white font-heading">{review.product}</p>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="lg:col-span-3">
                  <Quote size={36} className="text-gold/20 mb-6" strokeWidth={1} />

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-gold text-gold" />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl md:text-2xl text-foreground mb-4">
                    &ldquo;{review.title}&rdquo;
                  </h3>

                  {/* Text */}
                  <p className="text-muted-foreground font-light leading-relaxed mb-8 text-sm md:text-base">
                    {review.text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{review.name}</p>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[9px] font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.location} • {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all duration-300"
              aria-label="Previous review"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    current === index ? "bg-gold w-6" : "bg-border hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-gold hover:text-gold transition-all duration-300"
              aria-label="Next review"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
