"use client";

import { Printer, X, Truck, Clock, CreditCard, MapPin, User, StickyNote, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";
import { printInvoice } from "@/lib/print-invoice";
import { generateInvoice } from "@/lib/data/mock-orders";
import type { IOrder } from "@/types/order.types";

// ── Helpers ──
const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function statusClass(status: string) {
  if (status === "delivered") return "bg-green-500/10 text-green-600 border-green-500/20";
  if (["shipped", "out_for_delivery"].includes(status)) return "bg-gold/10 text-gold border-gold/20";
  if (status === "confirmed") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
  if (status === "processing") return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  if (status === "pending") return "bg-orange-500/10 text-orange-600 border-orange-500/20";
  if (["cancelled", "returned", "refunded"].includes(status)) return "bg-red-500/10 text-red-500 border-red-500/20";
  return "bg-muted text-muted-foreground border-border";
}

function paymentStatusClass(status: string) {
  if (status === "completed") return "text-green-600";
  if (status === "pending") return "text-orange-500";
  if (status === "failed" || status === "refunded") return "text-red-500";
  return "text-muted-foreground";
}

const sectionHeadCx = "flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2";

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════
interface Props {
  order: IOrder | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: Props) {
  if (!order) return null;

  const sa = order.shippingAddress || {} as Partial<IOrder["shippingAddress"]>;
  const customerName = [sa.firstName, sa.lastName].filter(Boolean).join(" ") || "—";
  const addrParts = [sa.addressLine1, sa.addressLine2, sa.city, sa.state, sa.postalCode, sa.country].filter(Boolean);
  const timeline = order.timeline || [];

  const handlePrintInvoice = () => {
    try {
      const invoice = generateInvoice(order);
      const opened = printInvoice(invoice);
      if (!opened) {
        toast.error("Pop-up blocked — please allow pop-ups for this site");
      }
    } catch {
      toast.error("Failed to generate invoice");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-card border border-border rounded-xl shadow-xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-muted/10 rounded-t-xl">
          <div>
            <h2 className="font-heading text-lg sm:text-xl">{order.orderNumber}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintInvoice}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gold text-onyx rounded-lg hover:bg-gold/90 transition-colors shadow-sm"
              title="Print Invoice"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-4 sm:p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar text-sm">
          {/* Status badge row */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${statusClass(order.status)}`}>
              {order.status.replace(/_/g, " ")}
            </span>
            {order.payment && (
              <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
                order.payment.status === "completed" ? "bg-green-500/10 text-green-600 border-green-500/20"
                : order.payment.status === "pending" ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                : "bg-muted text-muted-foreground border-border"
              }`}>
                Payment: {order.payment.status}
              </span>
            )}
          </div>

          {/* Customer + Payment side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <div className={sectionHeadCx}><User size={13} /> Customer</div>
              <p className="font-medium text-foreground">{customerName}</p>
              {sa.phone && <p className="text-muted-foreground">{sa.phone}</p>}
              {sa.email && <p className="text-muted-foreground break-all">{sa.email}</p>}
            </div>

            {/* Payment */}
            <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <div className={sectionHeadCx}><CreditCard size={13} /> Payment</div>
              <p className="font-medium capitalize">{String(order.payment?.method || "—").replace(/_/g, " ")}</p>
              {order.payment?.transactionId && (
                <p className="text-xs text-muted-foreground break-all">Ref: {order.payment.transactionId}</p>
              )}
              <p className={`text-xs font-medium mt-1 capitalize ${paymentStatusClass(order.payment?.status || "")}`}>
                {order.payment?.status || "—"}
                {order.payment?.paidAt && ` · ${new Date(order.payment.paidAt).toLocaleDateString("en-IN")}`}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          {addrParts.length > 0 && (
            <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <div className={sectionHeadCx}><MapPin size={13} /> Shipping Address</div>
              <p className="text-muted-foreground">{addrParts.join(", ")}</p>
            </div>
          )}

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
              <div className={sectionHeadCx}><Truck size={13} /> Tracking</div>
              <p className="font-medium font-mono text-foreground">{order.trackingNumber}</p>
              {order.estimatedDelivery && (
                <p className="text-xs text-muted-foreground mt-1">Est. delivery: {order.estimatedDelivery}</p>
              )}
            </div>
          )}

          {/* Items */}
          <div>
            <div className={sectionHeadCx}><PackageIcon size={13} /> Items ({order.items.length})</div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Item</th>
                    <th className="px-4 py-2.5 text-center font-medium">Qty</th>
                    <th className="px-4 py-2.5 text-right font-medium">Unit Price</th>
                    <th className="px-4 py-2.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((it, i) => {
                    const item = it as {
                      name?: string; quantity?: number; unitPrice?: number;
                      totalPrice?: number; product?: { name?: string };
                      metalType?: string; metalPurity?: string; size?: string; sku?: string;
                    };
                    const itemName = item.name || item.product?.name || "Item";
                    const meta = [item.metalType, item.metalPurity, item.size ? `Size ${item.size}` : ""]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <tr key={i} className="hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-2.5">
                          <p className="font-medium">{itemName}</p>
                          {(meta || item.sku) && (
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.sku && <span className="font-mono">{item.sku}</span>}
                              {item.sku && meta && " · "}
                              {meta}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">{item.quantity ?? 1}</td>
                        <td className="px-4 py-2.5 text-right text-muted-foreground">{inr(item.unitPrice ?? 0)}</td>
                        <td className="px-4 py-2.5 text-right font-medium">{inr(item.totalPrice ?? 0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{inr(order.subtotal)}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>-{inr(order.couponDiscount)}</span>
                </div>
              )}
              {order.giftCardAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Gift Card</span>
                  <span>-{inr(order.giftCardAmount)}</span>
                </div>
              )}
              {(order.taxAmount || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax ({((order.taxRate || 0) * 100).toFixed(0)}%)</span>
                  <span>{inr(order.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : inr(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gold pt-2 mt-1">
                <span>Grand Total</span>
                <span className="font-heading text-lg text-gold">{inr(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(order.customerNote || order.adminNote) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {order.customerNote && (
                <div className="bg-muted/20 rounded-lg p-3 border border-border/50">
                  <div className={sectionHeadCx}><StickyNote size={13} /> Customer Note</div>
                  <p className="text-muted-foreground text-xs">{order.customerNote}</p>
                </div>
              )}
              {order.adminNote && (
                <div className="bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                  <div className={sectionHeadCx}><StickyNote size={13} /> Admin Note</div>
                  <p className="text-muted-foreground text-xs">{order.adminNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          {timeline.length > 0 && (
            <div>
              <div className={sectionHeadCx}><Clock size={13} /> Order Timeline</div>
              <div className="relative pl-5 border-l-2 border-border/50 space-y-4 ml-1">
                {timeline.map((entry, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[23px] w-3 h-3 rounded-full border-2 ${
                      entry.isCompleted ? "bg-gold border-gold" : "bg-background border-border"
                    }`} />
                    <div>
                      <p className="font-medium text-xs">{entry.title || entry.status}</p>
                      {entry.description && (
                        <p className="text-xs text-muted-foreground">{entry.description}</p>
                      )}
                      {entry.timestamp && (
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                          {new Date(entry.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
