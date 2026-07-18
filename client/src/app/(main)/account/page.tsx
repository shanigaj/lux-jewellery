"use client";

import Link from "next/link";
import { Package, Heart, Gift, ArrowRight, CalendarDays, Crown } from "lucide-react";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";

export default function AccountOverviewPage() {
  const { data } = useGetUserOrdersQuery();
  const recentOrder = data?.orders?.[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl mb-2">My Account</h1>
        <p className="text-muted-foreground">
          Manage your orders, profile, and luxury preferences.
        </p>
      </div>

      {/* Stats/Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Orders", value: "3", icon: Package, href: "/account/orders" },
          { label: "Wishlist", value: "12", icon: Heart, href: "/account/wishlist" },
          { label: "Appointments", value: "1", icon: CalendarDays, href: "/account/appointments" },
          { label: "Reward Points", value: "2,500", icon: Gift, href: "/account/rewards" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-border rounded-xl p-4 md:p-6 hover:border-gold/50 transition-colors bg-muted/10 group flex flex-col items-center justify-center text-center"
          >
            <stat.icon size={24} className="text-gold mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-heading text-2xl mb-1">{stat.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier Status */}
        <div className="border border-border rounded-xl p-6 bg-gradient-to-br from-background to-gold/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Crown size={120} />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm uppercase tracking-wider font-medium text-gold mb-2">
              Lux Tier Status
            </h2>
            <p className="font-heading text-3xl mb-1">Platinum Member</p>
            <p className="text-sm text-muted-foreground mb-6">
              You are 1,500 points away from the Diamond Tier.
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Platinum</span>
                <span>Diamond</span>
              </div>
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gold w-[60%]" />
              </div>
            </div>

            <Link
              href="/account/rewards"
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline mt-6 font-medium"
            >
              View Benefits <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Order */}
        <div className="border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-xl">Recent Order</h2>
            <Link
              href="/account/orders"
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-gold transition-colors"
            >
              View All
            </Link>
          </div>

          {recentOrder ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Order #</span>
                  <span className="font-medium text-sm">{recentOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm">
                    {new Date(recentOrder.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm capitalize text-gold font-medium">
                    {recentOrder.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              
              <Link
                href={`/account/orders/${recentOrder.orderNumber}`}
                className="w-full flex items-center justify-center gap-2 py-3 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors mt-6 rounded-lg"
              >
                Track Order
              </Link>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Package size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">You have no recent orders.</p>
              <Link
                href="/products"
                className="text-sm text-gold hover:underline font-medium"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
