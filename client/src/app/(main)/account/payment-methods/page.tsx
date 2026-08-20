"use client";

import { CreditCard, Plus, Trash2, Check } from "lucide-react";

export default function PaymentMethodsPage() {
  const cards = [
    {
      id: "1",
      brand: "visa",
      last4: "4242",
      expiry: "12/28",
      name: "Priya Sharma",
      isDefault: true,
    },
    {
      id: "2",
      brand: "mastercard",
      last4: "8888",
      expiry: "09/27",
      name: "Priya Sharma",
      isDefault: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl mb-2">Payment Methods</h1>
          <p className="text-muted-foreground text-sm">
            Manage your saved cards for a seamless checkout experience.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg w-fit">
          <Plus size={16} /> Add New Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border border-border rounded-xl p-6 relative group hover:border-gold/50 transition-colors bg-gradient-to-br from-background to-muted/20"
          >
            {card.isDefault && (
              <div className="absolute top-0 right-0 bg-gold text-onyx text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                <Check size={12} /> Default
              </div>
            )}
            
            <div className="flex items-center justify-between mb-8">
              <CreditCard size={24} className="text-gold" />
              <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                {card.brand}
              </span>
            </div>
            
            <div className="space-y-4">
              <p className="font-mono text-lg tracking-widest">
                **** **** **** {card.last4}
              </p>
              
              <div className="flex justify-between items-end text-sm text-muted-foreground">
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1">Card Holder</p>
                  <p className="font-medium text-foreground">{card.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1">Expires</p>
                  <p className="font-medium text-foreground">{card.expiry}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <button
                aria-label="Remove card"
                className="flex min-h-[40px] min-w-[40px] items-center justify-center p-2 text-muted-foreground hover:text-destructive transition-colors bg-background rounded-full shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground flex items-start gap-3 border border-border">
        <div className="mt-0.5">🔒</div>
        <p>
          We use industry-standard encryption to protect your payment information.
          Your full card details are never stored on our servers.
        </p>
      </div>
    </div>
  );
}
