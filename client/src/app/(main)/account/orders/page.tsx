"use client";

import Link from "next/link";
import Image from "next/image";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Package, ArrowRight, Eye, Loader2 } from "lucide-react";

const statusColors: Record<string, "gold" | "success" | "info" | "warning" | "default"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "gold",
  out_for_delivery: "gold",
  delivered: "success",
  cancelled: "default",
  returned: "warning",
  refunded: "default",
};

export default function OrdersPage() {
  const { data, isLoading } = useGetUserOrdersQuery();
  const orders = data?.orders || [];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container-luxury py-8">
        <Breadcrumb items={[{ label: "My Orders" }]} />

        <AnimatedSection animation="fadeUp" className="mt-8">
          <h1 className="font-heading text-3xl md:text-4xl mb-8">My Orders</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Loader2 className="animate-spin text-gold mb-4" size={32} />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package size={64} className="text-muted-foreground/20 mb-6" />
              <h2 className="font-heading text-2xl mb-3">No Orders Yet</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to see your orders here.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <AnimatedSection
                  key={order._id}
                  animation="fadeUp"
                  delay={index * 0.1}
                >
                  <Link
                    href={`/account/orders/${order.orderNumber}`}
                    className="block border border-border rounded-xl p-4 md:p-6 hover:border-gold/50 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex items-start gap-4">
                        {/* Thumbnail stack */}
                        <div className="relative w-16 h-16 flex-shrink-0">
                          {order.items.slice(0, 2).map((item, i) => (
                            <div
                              key={i}
                              className="absolute bg-muted rounded-lg overflow-hidden border-2 border-background"
                              style={{
                                width: 48,
                                height: 48,
                                left: i * 12,
                                top: i * 4,
                                zIndex: 2 - i,
                              }}
                            >
                              <Image
                                src={item.thumbnail || "/images/placeholder.png"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium">
                              {order.orderNumber}
                            </h3>
                            <StatusBadge
                              status={order.status.replace(/_/g, " ")}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""} •{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.items.map((i) => i.name).join(", ")}
                          </p>
                        </div>
                      </div>

                      {/* Right: Price + Action */}
                      <div className="flex items-center gap-4 md:gap-6">
                        <p className="font-heading text-lg">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </p>
                        <span className="text-muted-foreground group-hover:text-gold transition-colors">
                          <Eye size={18} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
}
