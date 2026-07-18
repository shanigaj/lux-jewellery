"use client";

import { motion } from "framer-motion";
import { IProduct } from "@/types/product.types";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchX } from "lucide-react";

interface ProductGridProps {
  products: IProduct[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<SearchX size={28} className="text-muted-foreground" />}
        title="No Products Found"
        description="We couldn't find any products matching your current filters. Try adjusting your search criteria."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: (index % 12) * 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* We use the existing ProductCard but pass the IProduct data appropriately */}
          <ProductCard 
            product={product}
          />
        </motion.div>
      ))}
    </div>
  );
}
