"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectTotal, selectItemCount } from "@/store/selectors/cartSelectors";
import { clearCart } from "@/store/slices/cartSlice";
import { IShippingAddress, TPaymentMethod } from "@/types/order.types";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { PaymentMethods } from "@/components/checkout/PaymentMethods";
import { StripePayment } from "@/components/checkout/StripePayment";
import { RazorpayPayment } from "@/components/checkout/RazorpayPayment";
import { PayPalPayment } from "@/components/checkout/PayPalPayment";
import { OrderReview } from "@/components/checkout/OrderReview";
import { GiftOptions, type GiftOptionsValue } from "@/components/checkout/GiftOptions";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { ArrowRight, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useAppSelector((state) => state.cart.items);
  const total = useAppSelector(selectTotal);
  const itemCount = useAppSelector(selectItemCount);
  const dispatch = useAppDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("stripe");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [giftOptions, setGiftOptions] = useState<GiftOptionsValue>({ giftWrap: false, giftNote: "" });

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="container-luxury py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={64} className="text-muted-foreground/20 mb-6" />
            <h1 className="font-heading text-3xl mb-3">Nothing to Checkout</h1>
            <p className="text-muted-foreground mb-8">Add items to your bag first.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (data: IShippingAddress) => {
    setShippingAddress(data);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentComplete = (transactionId: string) => {
    // In a real app, this would create an order via API
    toast.success("Payment successful!");
    handlePlaceOrder(transactionId);
  };

  const handlePlaceOrder = async (transactionId?: string) => {
    setIsPlacingOrder(true);

    // Simulate order creation API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderNumber = `LUX-${Date.now().toString(36).toUpperCase()}`;

    // Clear cart and redirect
    dispatch(clearCart());
    router.push(`/order-success?order=${orderNumber}`);
  };

  const slideVariants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "Shopping Bag", href: "/cart" },
            { label: "Checkout" },
          ]}
        />

        {/* Steps */}
        <div className="mt-8 mb-12">
          <CheckoutSteps currentStep={currentStep} />
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <motion.div
                key="shipping"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  defaultValues={shippingAddress || undefined}
                />
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div
                key="payment"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <PaymentMethods
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />

                {/* Payment Form based on selection */}
                <div className="border border-border rounded-xl p-6">
                  {paymentMethod === "stripe" && (
                    <StripePayment
                      amount={total}
                      onComplete={handlePaymentComplete}
                    />
                  )}
                  {paymentMethod === "razorpay" && (
                    <RazorpayPayment
                      amount={total}
                      onComplete={handlePaymentComplete}
                    />
                  )}
                  {paymentMethod === "paypal" && (
                    <PayPalPayment
                      amount={total}
                      onComplete={handlePaymentComplete}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={14} /> Back to Shipping
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors"
                  >
                    Review Order <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && shippingAddress && (
              <motion.div
                key="review"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <OrderReview
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  onBack={() => setCurrentStep(1)}
                />

                <GiftOptions value={giftOptions} onChange={setGiftOptions} />

                {/* Place Order */}
                <button
                  onClick={() => handlePlaceOrder()}
                  disabled={isPlacingOrder}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-onyx dark:bg-gold text-white dark:text-onyx text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order • ₹{total.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                {/* Back */}
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full text-center text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Payment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
