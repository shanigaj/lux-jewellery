"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { 
  selectSubtotal, selectCouponDiscount, selectGiftCardAmount, 
  selectTax, selectShipping, selectTotal, selectItemCount 
} from "@/store/selectors/cartSelectors";
import { clearCart } from "@/store/slices/cartSlice";
import { CartItem } from "@/components/cart/CartItem";
import { CouponInput } from "@/components/cart/CouponInput";
import { GiftCardInput } from "@/components/cart/GiftCardInput";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export default function CartPage() {
  const items = useAppSelector((state) => state.cart.items);
  const subtotal = useAppSelector(selectSubtotal);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const giftCardAmount = useAppSelector(selectGiftCardAmount);
  const tax = useAppSelector(selectTax);
  const shipping = useAppSelector(selectShipping);
  const total = useAppSelector(selectTotal);
  const itemCount = useAppSelector(selectItemCount);
  const dispatch = useAppDispatch();

  const handleWhatsAppInquiry = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace('+', '') || '916353784310';
    let text = "Hello, I have an inquiry for the following items from your store:\n\n*CART DETAILS:*\n";
    
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.product.name} (${item.selectedMetal.replace('_', ' ')}, Size ${item.selectedSize || 'N/A'}) - Qty: ${item.quantity} - ₹${item.totalPrice.toLocaleString('en-IN')}\n`;
    });

    text += `\n*Subtotal:* ₹${subtotal.toLocaleString('en-IN')}`;
    if (couponDiscount > 0) text += `\n*Coupon Discount:* -₹${couponDiscount.toLocaleString('en-IN')}`;
    if (giftCardAmount > 0) text += `\n*Gift Card:* -₹${giftCardAmount.toLocaleString('en-IN')}`;
    text += `\n*GST (18%):* ₹${tax.toLocaleString('en-IN')}`;
    text += `\n*Shipping:* ${shipping === 0 ? 'Free' : `₹${shipping}`}`;
    text += `\n*TOTAL ESTIMATE:* ₹${total.toLocaleString('en-IN')}\n\nPlease let me know the availability and how to proceed with the payment.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, '_blank');
  };
  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="container-luxury py-8">
          <Breadcrumb items={[{ label: "Shopping Bag" }]} />
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={64} className="text-muted-foreground/20 mb-6" />
            <h1 className="font-heading text-3xl mb-3">Your Bag is Empty</h1>
            <p className="text-muted-foreground max-w-md mb-8">
              Discover our exquisite collections of diamond jewellery crafted for moments that last forever.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors"
            >
              Explore Collection <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container-luxury py-8">
        <Breadcrumb items={[{ label: "Shopping Bag" }]} />

        <AnimatedSection animation="fadeUp" className="mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="font-heading text-3xl md:text-4xl">
              Shopping Bag ({itemCount})
            </h1>
            <button
              onClick={() => dispatch(clearCart())}
              className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-destructive transition-colors w-fit"
            >
              Clear Bag
            </button>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Items */}
          <div className="lg:col-span-2">
            <AnimatedSection animation="fadeUp" delay={0.1}>
              <div className="border border-border rounded-xl p-4 md:p-6">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product._id}-${item.variantId || "default"}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-gold transition-colors mt-6"
              >
                <ArrowLeft size={14} /> Continue Shopping
              </Link>
            </AnimatedSection>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fadeUp" delay={0.2}>
              <div className="border border-border rounded-xl p-6 sticky top-24 space-y-6">
                <h2 className="font-heading text-lg">Order Summary</h2>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {giftCardAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Gift Card</span>
                      <span>-₹{giftCardAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString("en-IN")}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-border pt-3 flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span className="font-heading text-lg">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Coupon & Gift Card */}
                <div className="space-y-4 border-t border-border pt-4">
                  <CouponInput />
                  <GiftCardInput />
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 text-white text-sm uppercase tracking-widest font-medium hover:bg-green-700 transition-colors rounded-lg"
                >
                  Inquire via WhatsApp <ArrowRight size={14} />
                </button>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Truck size={18} className="text-gold" />
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      Free Shipping<br />over ₹50K
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <Shield size={18} className="text-gold" />
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      Secure<br />Payment
                    </span>
                  </div>
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <RotateCcw size={18} className="text-gold" />
                    <span className="text-[10px] text-muted-foreground leading-tight">
                      30-Day<br />Returns
                    </span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
