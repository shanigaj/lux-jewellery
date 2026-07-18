"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { Rating } from "@/components/shared/Rating";
import { Badge } from "@/components/ui/badge";
import type { IProduct } from "@/types/product.types";

interface ProductCardProps {
  product: IProduct;
  className?: string;
  variant?: "default" | "compact" | "featured";
  index?: number;
}

import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleWishlist } from "@/store/slices/productSlice";

export function ProductCard({
  product,
  className,
  variant = "default",
  index = 0,
}: ProductCardProps) {
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector((state) => state.product.wishlist);
  const isWishlisted = wishlist.some((p) => p._id === product._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("group relative", className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg bg-muted",
            variant === "featured" ? "aspect-[3/4]" : "aspect-square"
          )}
        >
          {product.thumbnail && (
            <Image 
              src={product.thumbnail} 
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <Badge className="badge-new text-[9px]">New</Badge>
            )}
            {hasDiscount && (
              <Badge className="badge-sale text-[9px]">Sale</Badge>
            )}
            {product.isBestseller && (
              <Badge className="badge-gold text-[9px]">Bestseller</Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              aria-label="Add to wishlist"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                dispatch(toggleWishlist(product));
              }}
            >
              <Heart size={15} className={cn("transition-colors", isWishlisted ? "fill-gold text-gold" : "text-foreground hover:text-gold")} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75"
              aria-label="Quick view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Eye size={15} className="text-foreground hover:text-gold transition-colors" />
            </motion.button>
          </div>

          {/* Add to Cart Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <button
              className="w-full flex items-center justify-center gap-2 py-3 bg-onyx/90 dark:bg-gold/90 backdrop-blur-sm text-white dark:text-onyx text-[11px] font-medium uppercase tracking-wider hover:bg-onyx dark:hover:bg-gold transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ShoppingBag size={13} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          {/* Category */}
          <p className="text-[10px] uppercase tracking-luxury text-gold font-medium">
            {typeof product.category === "object"
              ? product.category.name
              : "Diamond Jewellery"}
          </p>

          {/* Name */}
          <h3 className="font-heading text-base text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          {/* Diamond Specs Mini */}
          {product.diamondSpecs && (
            <p className="text-[11px] text-muted-foreground font-light">
              {product.diamondSpecs.caratWeight}ct •{" "}
              {product.diamondSpecs.shape} •{" "}
              {product.diamondSpecs.clarity} •{" "}
              {product.diamondSpecs.color}
            </p>
          )}

          {/* Rating */}
          {product.avgRating > 0 && (
            <Rating
              value={product.avgRating}
              size="sm"
              showCount
              count={product.reviewCount}
            />
          )}

          {/* Price */}
          <PriceDisplay
            basePrice={product.basePrice}
            salePrice={product.salePrice}
            size="sm"
          />
        </div>
      </Link>
    </motion.div>
  );
}
