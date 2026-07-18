"use client";

import { useAppSelector } from "@/store/hooks";
import { 
  selectSubtotal, selectCouponDiscount, selectGiftCardAmount, 
  selectTax, selectShipping, selectTotal, selectItemCount 
} from "@/store/selectors/cartSelectors";

interface OrderSummaryProps {
  compact?: boolean;
}

export function OrderSummary({ compact = false }: OrderSummaryProps) {
  const coupon = useAppSelector(state => state.cart.coupon);
  const giftCard = useAppSelector(state => state.cart.giftCard);
  const subtotal = useAppSelector(selectSubtotal);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const giftCardAmount = useAppSelector(selectGiftCardAmount);
  const tax = useAppSelector(selectTax);
  const shipping = useAppSelector(selectShipping);
  const total = useAppSelector(selectTotal);
  const itemCount = useAppSelector(selectItemCount);

  return (
    <div className="space-y-3 text-sm">
      {!compact && (
        <h3 className="font-heading text-lg mb-4">
          Order Summary ({itemCount} items)
        </h3>
      )}

      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>₹{subtotal.toLocaleString("en-IN")}</span>
      </div>

      {couponDiscount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Coupon {coupon?.code && `(${coupon.code})`}</span>
          <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
        </div>
      )}

      {giftCardAmount > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Gift Card {giftCard?.code && `(${giftCard.code})`}</span>
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
  );
}
