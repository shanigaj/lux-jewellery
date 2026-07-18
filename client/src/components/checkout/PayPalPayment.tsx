"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

interface PayPalPaymentProps {
  onComplete: (transactionId: string) => void;
  amount: number;
}

export function PayPalPayment({ onComplete, amount }: PayPalPaymentProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate PayPal redirect + capture
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const mockTxnId = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onComplete(mockTxnId);
    setIsProcessing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">PayPal</span>
        </div>
        <span className="text-sm font-medium">Pay with PayPal</span>
      </div>

      <div className="bg-muted/30 border border-border rounded-lg p-6 text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-[#003087]/10 rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="40" height="40" className="fill-[#003087]">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 6.082-8.558 6.082h-2.19a1.59 1.59 0 0 0-1.576 1.353l-1.12 7.106-.322 2.04a.64.64 0 0 0 .633.74h3.39c.524 0 .967-.382 1.05-.9l.095-.532.688-4.359.044-.24a1.044 1.044 0 0 1 1.033-.884h.65c4.213 0 7.51-1.711 8.471-6.66.402-2.068.194-3.794-.64-5.01z"/>
          </svg>
        </div>

        <div>
          <h3 className="font-medium text-sm mb-1">Quick & Secure Checkout</h3>
          <p className="text-xs text-muted-foreground">
            You will be redirected to PayPal to complete your payment of{" "}
            <strong>₹{amount.toLocaleString("en-IN")}</strong>
          </p>
        </div>
      </div>

      <button
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FFC439] text-[#003087] text-sm uppercase tracking-widest font-bold hover:bg-[#f0b72f] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Connecting to PayPal...
          </>
        ) : (
          <>
            <Lock size={14} /> Pay with PayPal
          </>
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Lock size={10} /> Buyer Protection Included
      </p>
    </div>
  );
}
