"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Rating } from "@/components/shared/Rating";

const featuredProducts = [
  {
    id: "fp-1",
    name: "Celestial Solitaire Ring",
    slug: "celestial-solitaire-ring",
    category: "Rings",
    price: 185000,
    salePrice: undefined,
    image: "/images/hero-ring.png",
    specs: "1.5ct • Round • D • VVS1",
    rating: 4.9,
    reviews: 127,
    badge: "New",
    badgeClass: "badge-new",
  },
  {
    id: "fp-2",
    name: "Aurora Diamond Pendant",
    slug: "aurora-diamond-pendant",
    category: "Necklaces",
    price: 95000,
    salePrice: 82000,
    image: "/images/products/necklace.png",
    specs: "0.75ct • Oval • E • VS1",
    rating: 4.8,
    reviews: 89,
    badge: "Sale",
    badgeClass: "badge-sale",
  },
  {
    id: "fp-3",
    name: "Eternal Tennis Bracelet",
    slug: "eternal-tennis-bracelet",
    category: "Bracelets",
    price: 275000,
    salePrice: undefined,
    image: "/images/products/bracelet.png",
    specs: "3.0ct • Round • D • VVS2",
    rating: 5.0,
    reviews: 203,
    badge: "Bestseller",
    badgeClass: "badge-gold",
  },
  {
    id: "fp-4",
    name: "Radiance Drop Earrings",
    slug: "radiance-drop-earrings",
    category: "Earrings",
    price: 125000,
    salePrice: undefined,
    image: "/images/products/earrings.png",
    specs: "1.0ct • Pear • F • VVS1",
    rating: 4.7,
    reviews: 64,
    badge: null,
    badgeClass: null,
  },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FeaturedProducts() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-luxury">
        {/* Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Curated for You
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Featured Masterpieces
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Handpicked from our finest collections, each piece represents the pinnacle of diamond craftsmanship.
          </p>
        </AnimatedSection>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <Link href={`/products/${product.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className={cn("text-[9px]", product.badgeClass)}>
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    {[Heart, Eye].map((Icon, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        style={{ transitionDelay: `${i * 75}ms` }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        aria-label={i === 0 ? "Add to wishlist" : "Quick view"}
                      >
                        <Icon size={15} className="text-foreground" />
                      </motion.button>
                    ))}
                  </div>

                  {/* Add to Cart Slide-up */}
                  <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <button
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-onyx/90 backdrop-blur-sm text-white text-[11px] font-medium uppercase tracking-wider hover:bg-gold hover:text-onyx transition-colors duration-300"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <ShoppingBag size={13} />
                      Add to Cart
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-5 space-y-2">
                  <p className="text-[10px] uppercase tracking-luxury text-gold font-medium">
                    {product.category}
                  </p>
                  <h3 className="font-heading text-base text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-light">{product.specs}</p>
                  <Rating value={product.rating} size="sm" showCount count={product.reviews} />
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-base text-foreground">
                      {formatINR(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatINR(product.price)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection animation="fadeUp" delay={0.4} className="text-center mt-14">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-foreground text-foreground text-[12px] font-medium uppercase tracking-wider rounded-full hover:bg-foreground hover:text-background transition-all duration-500"
          >
            View All Collections
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
