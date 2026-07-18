"use client";

import { useAppSelector } from "@/store/hooks";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyState } from "@/components/shared/EmptyState";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const wishlist = useAppSelector((state) => state.product.wishlist);

  return (
    <div className="bg-background min-h-screen">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "My Wishlist" },
          ]}
        />
        
        <div className="mt-8 mb-12">
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon={<Heart size={28} className="text-muted-foreground" />}
            title="Your wishlist is empty"
            description="Explore our collections and save your favorite pieces here."
          />
        ) : (
          <ProductGrid products={wishlist} isLoading={false} />
        )}
      </div>
    </div>
  );
}
