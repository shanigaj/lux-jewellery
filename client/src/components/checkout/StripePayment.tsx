"use client";

import { useState } from "react";
import { CreditCard, Loader2, Lock } from "lucide-react";
import { TPaymentMethod } from "@/types/order.types";

interface StripePaymentProps {
  onComplete: (transactionId: string) => void;
  amount: number;
}

export function StripePayment({ onComplete, amount }: StripePaymentProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + " / " + cleaned.slice(2);
    }
    return cleaned;
  };

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate Stripe payment
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const mockTxnId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onComplete(mockTxnId);
    setIsProcessing(false);
  };

  const isValid = cardNumber.replace(/\s/g, "").length === 16 && expiry.length >= 7 && cvc.length >= 3 && name.length >= 2;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">stripe</span>
        </div>
        <span className="text-sm font-medium">Pay with Card</span>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
            Card Number
          </label>
          <div className="relative">
            <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="w-full bg-transparent border border-border py-2.5 pl-10 pr-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors tracking-wider"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name on card"
            className="w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              Expiry
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM / YY"
              className="w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors tracking-wider"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors tracking-wider"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={!isValid || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#635BFF] text-white text-sm uppercase tracking-widest font-medium hover:bg-[#5147e5] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Processing...
          </>
        ) : (
          <>
            <Lock size={14} /> Pay ₹{amount.toLocaleString("en-IN")}
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Lock size={10} /> Secured by Stripe encryption
      </p>
    </div>
  );
}
