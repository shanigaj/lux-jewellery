"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { ICartItem } from "@/types/order.types";
import { useAppDispatch } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/store/slices/cartSlice";

interface CartItemProps {
  item: ICartItem;
  compact?: boolean;
}

const metalLabels: Record<string, string> = {
  gold: "Yellow Gold",
  white_gold: "White Gold",
  rose_gold: "Rose Gold",
  platinum: "Platinum",
  silver: "Silver",
};

export function CartItem({ item, compact = false }: CartItemProps) {
  const dispatch = useAppDispatch();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b border-border last:border-0"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
        <Image
          src={item.product.thumbnail || "/images/placeholder.png"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h4 className="text-sm font-medium truncate">{item.product.name}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {metalLabels[item.selectedMetal] || item.selectedMetal} • {item.selectedPurity}
              {item.selectedSize && ` • Size ${item.selectedSize}`}
            </p>
          </div>
          <button
            onClick={() => dispatch(removeFromCart({ productId: item.product._id, variantId: item.variantId }))}
            className="text-muted-foreground hover:text-destructive transition-colors p-1 flex-shrink-0"
            aria-label="Remove item"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Quantity Controls */}
          {!compact && (
            <div className="flex items-center gap-1 border border-border rounded-sm">
              <button
                onClick={() =>
                  dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity - 1, variantId: item.variantId }))
                }
                disabled={item.quantity <= 1}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              >
                <Minus size={12} />
              </button>
              <span className="text-xs font-medium w-6 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(updateQuantity({ productId: item.product._id, quantity: item.quantity + 1, variantId: item.variantId }))
                }
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
          {compact && (
            <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
          )}

          {/* Price */}
          <p className="text-sm font-medium">
            ₹{item.totalPrice.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
