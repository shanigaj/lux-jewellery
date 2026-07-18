"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { closeDrawer } from "@/store/slices/cartSlice";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const items = useAppSelector((state) => state.cart.items);
  const isDrawerOpen = useAppSelector((state) => state.cart.isDrawerOpen);
  const dispatch = useAppDispatch();

  const handleWhatsAppInquiry = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '') || '916353784310';
    let text = "Hello, I have an inquiry for the following items from your store:\n\n*CART DETAILS:*\n";
    
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.product.name} (${item.selectedMetal.replace('_', ' ')}, Size ${item.selectedSize || 'N/A'}) - Qty: ${item.quantity} - ₹${item.totalPrice.toLocaleString('en-IN')}\n`;
    });

    const subtotal = getSubtotal();
    text += `\n*Subtotal Estimate:* ₹${subtotal.toLocaleString('en-IN')}`;
    text += `\n\nPlease let me know the availability, final price including taxes, and how to proceed with the payment.`;

    const encodedText = encodeURIComponent(text);
    dispatch(closeDrawer());
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };
  
  const getSubtotal = () => items.reduce((sum, item) => sum + item.totalPrice, 0);
  const getItemCount = () => items.reduce((sum, item) => sum + item.quantity, 0);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeDrawer())}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="font-heading text-lg">Shopping Bag</h2>
                <span className="text-xs bg-gold text-onyx px-2 py-0.5 rounded-full font-medium">
                  {getItemCount()}
                </span>
              </div>
              <button
                onClick={() => dispatch(closeDrawer())}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
                  <h3 className="font-heading text-lg mb-2">Your bag is empty</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Discover our exclusive collections and find your perfect piece.
                  </p>
                  <Link
                    href="/products"
                    onClick={() => dispatch(closeDrawer())}
                    className="text-xs uppercase tracking-widest font-medium text-gold hover:underline"
                  >
                    Explore Collection
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product._id}-${item.variantId || "default"}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    ₹{getSubtotal().toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes and shipping calculated at checkout
                </p>

                {/* CTAs */}
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={() => dispatch(closeDrawer())}
                    className="flex items-center justify-center py-3 border border-border text-sm uppercase tracking-wider font-medium hover:border-gold transition-colors"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="flex items-center justify-center gap-2 py-3 bg-green-600 text-white text-sm uppercase tracking-wider font-medium hover:bg-green-700 transition-colors rounded-md"
                  >
                    WhatsApp <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
