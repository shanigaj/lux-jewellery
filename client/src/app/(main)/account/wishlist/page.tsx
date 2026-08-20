"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProductsQuery } from "@/store/api/productApi";

export default function WishlistPage() {
  // No dedicated wishlist backend yet — showcase real catalogue pieces
  // (with genuine DB photography) instead of hard-coded stock items.
  const { data } = useGetProductsQuery({ limit: 6 });
  const [removed, setRemoved] = useState<string[]>([]);

  const wishlistItems = (data?.data ?? [])
    .filter((p) => !removed.includes(p._id))
    .slice(0, 3)
    .map((p) => ({
      id: p._id,
      name: p.name,
      price: p.basePrice,
      image: p.thumbnail,
      slug: p._id,
      inStock: (p.stockQuantity ?? 0) > 0,
    }));

  const removeItem = (id: string) => {
    setRemoved((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl mb-2">My Wishlist</h1>
        <p className="text-muted-foreground text-sm">
          Save your favorite pieces and move them to your bag when you're ready.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-border rounded-xl">
          <Heart size={64} className="text-muted-foreground/20 mb-6" />
          <h2 className="font-heading text-2xl mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Discover our collections and add your favorite pieces.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative border border-border rounded-xl overflow-hidden hover:border-gold/50 transition-colors"
              >
                {/* Image */}
                <div className="relative aspect-square bg-muted p-4">
                  <Link href={`/products/${item.slug}`}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 flex min-h-[40px] min-w-[40px] items-center justify-center p-2 bg-background/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-destructive hover:bg-background transition-all shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded text-[10px] uppercase tracking-wider font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 bg-background">
                  <Link href={`/products/${item.slug}`}>
                    <h3 className="text-sm font-medium hover:text-gold transition-colors truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="font-heading text-base mt-2 mb-4">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <button
                    disabled={!item.inStock}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={14} />
                    {item.inStock ? "Move to Bag" : "Out of Stock"}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
