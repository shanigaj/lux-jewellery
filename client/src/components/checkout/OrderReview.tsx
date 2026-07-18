"use client";

import Image from "next/image";
import { ICartItem, IShippingAddress, TPaymentMethod } from "@/types/order.types";
import { useAppSelector } from "@/store/hooks";
import { 
  selectSubtotal, selectCouponDiscount, selectGiftCardAmount, 
  selectTax, selectShipping, selectTotal 
} from "@/store/selectors/cartSelectors";
import { MapPin, CreditCard, ArrowLeft } from "lucide-react";

interface OrderReviewProps {
  shippingAddress: IShippingAddress;
  paymentMethod: TPaymentMethod;
  onBack: () => void;
}

const paymentLabels: Record<TPaymentMethod, string> = {
  stripe: "Stripe (Credit/Debit Card)",
  razorpay: "Razorpay (UPI/Card/NetBanking)",
  paypal: "PayPal",
};

export function OrderReview({ shippingAddress, paymentMethod, onBack }: OrderReviewProps) {
  const items = useAppSelector(state => state.cart.items);
  const coupon = useAppSelector(state => state.cart.coupon);
  const giftCard = useAppSelector(state => state.cart.giftCard);
  const subtotal = useAppSelector(selectSubtotal);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const giftCardAmount = useAppSelector(selectGiftCardAmount);
  const tax = useAppSelector(selectTax);
  const shipping = useAppSelector(selectShipping);
  const total = useAppSelector(selectTotal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl">Review Order</h2>
        <button
          onClick={onBack}
          className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-gold transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={12} /> Edit
        </button>
      </div>

      {/* Shipping Address */}
      <div className="border border-border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin size={16} className="text-gold" />
          Shipping Address
        </div>
        <div className="text-sm text-muted-foreground pl-6">
          <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
          <p className="mt-1">{shippingAddress.phone} • {shippingAddress.email}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border border-border rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <CreditCard size={16} className="text-gold" />
          Payment Method
        </div>
        <p className="text-sm text-muted-foreground pl-6">
          {paymentLabels[paymentMethod]}
        </p>
      </div>

      {/* Order Items */}
      <div className="border border-border rounded-xl p-4">
        <h3 className="text-sm font-medium mb-3">Items ({items.length})</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={`${item.product._id}-${item.variantId}`} className="flex gap-3">
              <div className="relative w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.product.thumbnail || "/images/placeholder.png"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium flex-shrink-0">
                ₹{item.totalPrice.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border border-border rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon ({coupon?.code})</span>
            <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}
        {giftCardAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Gift Card ({giftCard?.code})</span>
            <span>-₹{giftCardAmount.toLocaleString("en-IN")}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">GST (18%)</span>
          <span>₹{tax.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `₹${shipping}`}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-medium text-base">
          <span>Total</span>
          <span className="font-heading text-lg">₹{total.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}
