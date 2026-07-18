"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { generateInvoice } from "@/lib/data/mock-orders";
import { useGetOrderByIdQuery } from "@/store/api/orderApi";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { OrderTracking } from "@/components/order/OrderTracking";
import { Invoice } from "@/components/order/Invoice";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import { useState } from "react";

const statusColors: Record<string, "gold" | "success" | "info" | "warning" | "default"> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "gold",
  out_for_delivery: "gold",
  delivered: "success",
  cancelled: "default",
};

type TabType = "tracking" | "items" | "invoice";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const order = data?.order;
  const [activeTab, setActiveTab] = useState<TabType>("tracking");

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="container-luxury py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="animate-spin text-gold mb-4" size={32} />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-background min-h-screen pb-20">
        <div className="container-luxury py-8">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package size={64} className="text-muted-foreground/20 mb-6" />
            <h1 className="font-heading text-2xl mb-3">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find an order with this number.
            </p>
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
            >
              <ArrowLeft size={14} /> View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const invoice = generateInvoice(order);

  const tabs: { id: TabType; label: string }[] = [
    { id: "tracking", label: "Tracking" },
    { id: "items", label: "Items" },
    { id: "invoice", label: "Invoice" },
  ];

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container-luxury py-8">
        <Breadcrumb
          items={[
            { label: "My Orders", href: "/account/orders" },
            { label: order.orderNumber },
          ]}
        />

        <AnimatedSection animation="fadeUp" className="mt-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-2xl md:text-3xl">
                  {order.orderNumber}
                </h1>
                <StatusBadge 
                  status={order.status} 
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {" • "}
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
                {" • "}
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>
            <Link
              href="/account/orders"
              className="text-xs uppercase tracking-wider font-medium text-muted-foreground hover:text-gold transition-colors flex items-center gap-1 w-fit"
            >
              <ArrowLeft size={14} /> All Orders
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-gold text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "tracking" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tracking Timeline */}
              <div className="border border-border rounded-xl p-6">
                <h2 className="font-heading text-lg mb-6">Order Status</h2>
                <OrderTracking
                  timeline={order.timeline}
                  currentStatus={order.status}
                  trackingNumber={order.trackingNumber}
                  estimatedDelivery={order.estimatedDelivery}
                />
              </div>

              {/* Shipping & Payment Info */}
              <div className="space-y-6">
                <div className="border border-border rounded-xl p-6">
                  <h3 className="font-heading text-base mb-4">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="text-foreground font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2">{order.shippingAddress.phone}</p>
                  </div>
                </div>

                <div className="border border-border rounded-xl p-6">
                  <h3 className="font-heading text-base mb-4">Payment</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Method</span>
                      <span className="capitalize">{order.payment.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID</span>
                      <span className="font-mono text-xs">{order.payment.transactionId.slice(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="text-green-600 capitalize">{order.payment.status}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 font-medium">
                      <span>Total Paid</span>
                      <span className="font-heading text-gold">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div className="border border-border rounded-xl divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 md:p-6">
                  <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.thumbnail || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      SKU: {item.sku} •{" "}
                      {item.metalType.replace("_", " ")} {item.metalPurity}
                      {item.size && ` • Size ${item.size}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ₹{item.unitPrice.toLocaleString("en-IN")} each
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Price Summary */}
              <div className="p-4 md:p-6">
                <div className="max-w-xs ml-auto space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{order.couponDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{order.taxAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{order.shippingCost === 0 ? "Free" : `₹${order.shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t border-gold">
                    <span>Total</span>
                    <span className="font-heading text-gold">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "invoice" && <Invoice invoice={invoice} />}
        </AnimatedSection>
      </div>
    </div>
  );
}
