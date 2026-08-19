"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionCardProps {
  name: string;
  slug: string;
  description: string;
  productCount: number;
  gradient?: string;
  className?: string;
  index?: number;
}

export function CollectionCard({
  name,
  slug,
  description,
  productCount,
  gradient = "from-[#1A1814] to-[#2A2520]",
  className,
  index = 0,
}: CollectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("group", className)}
    >
      <Link href={`/categories/${slug}`}>
        <div className="relative overflow-hidden rounded-xl aspect-[16/10] cursor-pointer">
          {/* Background */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105",
              gradient
            )}
          />

          {/* Decorative diamond pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%">
              <pattern
                id={`col-${slug}`}
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M20 0L40 20L20 40L0 20Z"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
              <rect width="100%" height="100%" fill={`url(#col-${slug})`} />
            </svg>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-2">
                  {productCount} Pieces
                </p>
                <h3 className="font-heading text-2xl md:text-3xl text-white mb-2">
                  {name}
                </h3>
                <p className="text-sm text-white/60 font-light max-w-xs">
                  {description}
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500"
              >
                <ArrowUpRight size={18} />
              </motion.div>
            </div>
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}
