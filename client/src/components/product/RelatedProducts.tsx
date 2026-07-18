"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProduct } from "@/types/product.types";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  products: IProduct[];
  title?: string;
}

export function RelatedProducts({ products, title = "You May Also Like" }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const amount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: dir === "left" ? scrollLeft - amount : scrollLeft + amount,
        behavior: "smooth",
      });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="py-16 border-t border-border">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-heading text-2xl md:text-3xl">{title}</h2>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory no-scrollbar"
      >
        {products.map((product, idx) => (
          <div key={product._id} className="min-w-[260px] md:min-w-[280px] lg:min-w-[300px] snap-start shrink-0">
            <ProductCard product={product} index={idx} />
          </div>
        ))}
      </div>
    </div>
  );
}
