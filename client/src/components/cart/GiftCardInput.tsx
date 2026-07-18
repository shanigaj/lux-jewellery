"use client";

import { useState } from "react";
import { Gift, Loader2, X, CheckCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { applyGiftCard, removeGiftCard } from "@/store/slices/cartSlice";
import { selectGiftCardAmount } from "@/store/selectors/cartSelectors";
import { IGiftCard } from "@/types/order.types";

// Mock gift cards for demo
const MOCK_GIFT_CARDS: Record<string, IGiftCard> = {
  "GIFT-LUX-1000": {
    _id: "gc1",
    code: "GIFT-LUX-1000",
    balance: 10000,
    originalBalance: 10000,
    expiresAt: "2027-12-31T23:59:59Z",
    isActive: true,
  },
  "GIFT-DIAMOND-5000": {
    _id: "gc2",
    code: "GIFT-DIAMOND-5000",
    balance: 50000,
    originalBalance: 50000,
    expiresAt: "2027-12-31T23:59:59Z",
    isActive: true,
  },
};

export function GiftCardInput() {
  const giftCard = useAppSelector(state => state.cart.giftCard);
  const dispatch = useAppDispatch();
  const giftCardAmount = useAppSelector(selectGiftCardAmount);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = MOCK_GIFT_CARDS[code.trim().toUpperCase()];
    if (!found) {
      setError("Invalid gift card code");
      setIsLoading(false);
      return;
    }

    if (!found.isActive || found.balance <= 0) {
      setError("This gift card has no remaining balance");
      setIsLoading(false);
      return;
    }

    dispatch(applyGiftCard(found));
    setCode("");
    setIsLoading(false);
  };

  if (giftCard) {
    return (
      <div className="flex items-center justify-between bg-gold/5 border border-gold/20 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-500" />
          <div>
            <p className="text-sm font-medium">{giftCard.code}</p>
            <p className="text-xs text-muted-foreground">
              Applied: -₹{giftCardAmount.toLocaleString("en-IN")} • Balance: ₹{giftCard.balance.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
        <button
          onClick={() => dispatch(removeGiftCard())}
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
          <Gift size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="Gift card code"
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
        Try: GIFT-LUX-1000 or GIFT-DIAMOND-5000
      </p>
    </div>
  );
}
