"use client";

import { useState } from "react";
import { Loader2, Lock, Smartphone, CreditCard, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RazorpayPaymentProps {
  onComplete: (transactionId: string) => void;
  amount: number;
}

type RazorpayMethod = "upi" | "card" | "netbanking";

export function RazorpayPayment({ onComplete, amount }: RazorpayPaymentProps) {
  const [method, setMethod] = useState<RazorpayMethod>("upi");
  const [upiId, setUpiId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate Razorpay payment
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const mockTxnId = `rzp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onComplete(mockTxnId);
    setIsProcessing(false);
  };

  const isValid = method === "upi" ? upiId.includes("@") : true;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-12 h-8 bg-[#072654] rounded flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">Razorpay</span>
        </div>
        <span className="text-sm font-medium">Pay with Razorpay</span>
      </div>

      {/* Method Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "upi" as const, label: "UPI", icon: Smartphone },
          { id: "card" as const, label: "Card", icon: CreditCard },
          { id: "netbanking" as const, label: "Net Banking", icon: Building2 },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 border rounded-lg transition-colors text-xs",
              method === m.id
                ? "border-gold bg-gold/5 text-foreground"
                : "border-border text-muted-foreground hover:border-gold/50"
            )}
          >
            <m.icon size={18} />
            {m.label}
          </button>
        ))}
      </div>

      {/* UPI */}
      {method === "upi" && (
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            className="w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      )}

      {/* Card */}
      {method === "card" && (
        <div className="bg-muted/30 p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            You will be redirected to Razorpay's secure payment page to enter card details.
          </p>
        </div>
      )}

      {/* Net Banking */}
      {method === "netbanking" && (
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
            Select Bank
          </label>
          <select className="w-full bg-transparent border border-border py-2.5 px-3 text-sm rounded-lg focus:outline-none focus:border-gold transition-colors">
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="kotak">Kotak Mahindra Bank</option>
          </select>
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={!isValid || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#072654] text-white text-sm uppercase tracking-widest font-medium hover:bg-[#0a3a7d] transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
        <Lock size={10} /> Secured by Razorpay
      </p>
    </div>
  );
}
