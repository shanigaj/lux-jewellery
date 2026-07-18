"use client";

import { cn } from "@/lib/utils";
import { TPaymentMethod } from "@/types/order.types";
import { CreditCard, Smartphone, Shield } from "lucide-react";

interface PaymentMethodsProps {
  selected: TPaymentMethod;
  onSelect: (method: TPaymentMethod) => void;
}

const methods = [
  {
    id: "stripe" as const,
    name: "Credit / Debit Card",
    description: "Visa, Mastercard, Amex via Stripe",
    icon: CreditCard,
    color: "#635BFF",
    badge: "stripe",
  },
  {
    id: "razorpay" as const,
    name: "UPI / Card / Net Banking",
    description: "UPI, Cards, Net Banking via Razorpay",
    icon: Smartphone,
    color: "#072654",
    badge: "Razorpay",
  },
  {
    id: "paypal" as const,
    name: "PayPal",
    description: "Pay securely with your PayPal account",
    icon: Shield,
    color: "#003087",
    badge: "PayPal",
  },
];

export function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-xl mb-4">Payment Method</h2>

      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={cn(
            "w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left",
            selected === method.id
              ? "border-gold bg-gold/5 shadow-sm"
              : "border-border hover:border-gold/50"
          )}
        >
          {/* Radio */}
          <div
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
              selected === method.id ? "border-gold" : "border-muted-foreground/30"
            )}
          >
            {selected === method.id && (
              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
            )}
          </div>

          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${method.color}15` }}
          >
            <method.icon size={20} style={{ color: method.color }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{method.name}</p>
            <p className="text-xs text-muted-foreground">{method.description}</p>
          </div>

          {/* Badge */}
          <div
            className="px-2 py-1 rounded text-[9px] font-bold text-white flex-shrink-0"
            style={{ backgroundColor: method.color }}
          >
            {method.badge}
          </div>
        </button>
      ))}
    </div>
  );
}
