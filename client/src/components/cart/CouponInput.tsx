"use client";

import { useState } from "react";
import { Tag, Loader2, X, CheckCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { applyCoupon, removeCoupon } from "@/store/slices/cartSlice";
import { selectSubtotal, selectCouponDiscount } from "@/store/selectors/cartSelectors";
import { ICoupon } from "@/types/order.types";

// Mock coupons for demo
const MOCK_COUPONS: Record<string, ICoupon> = {
  LUXE20: {
    _id: "c1",
    code: "LUXE20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 25000,
    maxDiscount: 15000,
    expiresAt: "2027-12-31T23:59:59Z",
    isActive: true,
    usageLimit: 100,
    usedCount: 12,
  },
  DIAMOND10: {
    _id: "c2",
    code: "DIAMOND10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 10000,
    expiresAt: "2027-12-31T23:59:59Z",
    isActive: true,
    usageLimit: 500,
    usedCount: 45,
  },
  FLAT5000: {
    _id: "c3",
    code: "FLAT5000",
    discountType: "flat",
    discountValue: 5000,
    minOrderAmount: 50000,
    expiresAt: "2027-12-31T23:59:59Z",
    isActive: true,
    usageLimit: 50,
    usedCount: 3,
  },
};

export function CouponInput() {
  const coupon = useAppSelector(state => state.cart.coupon);
  const dispatch = useAppDispatch();
  const subtotal = useAppSelector(selectSubtotal);
  const couponDiscount = useAppSelector(selectCouponDiscount);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = MOCK_COUPONS[code.trim().toUpperCase()];
    if (!found) {
      setError("Invalid coupon code");
      setIsLoading(false);
      return;
    }

    if (!found.isActive || new Date(found.expiresAt) < new Date()) {
      setError("This coupon has expired");
      setIsLoading(false);
      return;
    }

    if (subtotal < found.minOrderAmount) {
      setError(`Minimum order: ₹${found.minOrderAmount.toLocaleString("en-IN")}`);
      setIsLoading(false);
      return;
    }

    dispatch(applyCoupon(found));
    setCode("");
    setIsLoading(false);
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between bg-gold/5 border border-gold/20 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <div>
            <p className="text-sm font-medium">{coupon.code}</p>
            <p className="text-xs text-muted-foreground">
              -₹{couponDiscount.toLocaleString("en-IN")} off
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(removeCoupon())}
          className="p-1 hover:text-destructive transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Coupon code"
            className="w-full bg-transparent border border-border py-2.5 pl-9 pr-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors uppercase tracking-wider"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={isLoading || !code.trim()}
          className="px-4 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-wider font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Try: LUXE20, DIAMOND10, or FLAT5000
      </p>
    </div>
  );
}
