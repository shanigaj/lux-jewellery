"use client";

import { useState, useMemo } from "react";
import { Search, Download, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/store/api/orderApi";
import { exportCsv } from "@/lib/export-csv";
import { Modal } from "@/components/admin/Modal";
import type { IOrder } from "@/types/order.types";

const STATUSES = ["pending", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
const PER_PAGE = 12;

function statusClass(status: string) {
  if (status === "delivered") return "bg-green-500/10 text-green-600";
  if (["shipped", "out_for_delivery"].includes(status)) return "bg-gold/10 text-gold";
  if (status === "processing") return "bg-blue-500/10 text-blue-600";
  if (status === "pending") return "bg-orange-500/10 text-orange-600";
  if (status === "cancelled") return "bg-muted text-muted-foreground";
  return "bg-muted text-muted-foreground";
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<IOrder | null>(null);

  const { data, isLoading } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const fetchedOrders = data?.orders || [];

  const filteredOrders = useMemo(
    () =>
      fetchedOrders.filter((o) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          o.orderNumber.toLowerCase().includes(q) ||
          o.shippingAddress.firstName.toLowerCase().includes(q) ||
          o.shippingAddress.lastName.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "all" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [fetchedOrders, searchTerm, statusFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const pageOrders = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const changeStatus = async (order: IOrder, status: string) => {
    try {
      await updateStatus({ id: order._id, status }).unwrap();
      toast.success(`Order marked ${status.replace(/_/g, " ")}`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleExport = () => {
    if (!filteredOrders.length) return toast.error("Nothing to export");
    exportCsv(
      "orders.csv",
      filteredOrders.map((o) => ({
        order: o.orderNumber,
        date: new Date(o.createdAt).toLocaleDateString("en-IN"),
        customer: `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`,
        phone: o.shippingAddress.phone,
        items: o.items.length,
        total: o.totalAmount,
        status: o.status,
      })),
      [
        { key: "order", header: "Order" },
        { key: "date", header: "Date" },
        { key: "customer", header: "Customer" },
        { key: "phone", header: "Phone" },
        { key: "items", header: "Items" },
        { key: "total", header: "Total (INR)" },
        { key: "status", header: "Status" },
      ]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Orders</h1>
          <p className="text-sm text-muted-foreground">View, track, and manage all customer orders.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export Orders
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold capitalize"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium text-right">Items</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-gold mb-2" size={24} /><p className="text-sm text-muted-foreground">Loading orders...</p></td></tr>
              ) : pageOrders.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground text-sm">No orders match your filters.</td></tr>
              ) : pageOrders.map((order) => (
                <tr key={order._id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">{order.items.length}</td>
                  <td className="px-6 py-4 text-right font-medium">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => changeStatus(order, e.target.value)}
                      className={`text-[10px] uppercase tracking-wider font-bold rounded-full px-2.5 py-1 outline-none cursor-pointer border-0 ${statusClass(order.status)}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-card text-foreground capitalize">{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewing(order)} aria-label="View order" className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Page {page} of {totalPages} · {filteredOrders.length} orders</p>
          <div className="flex gap-1 items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
            <span className="px-3 py-1 bg-gold text-onyx font-medium rounded">{page}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Order detail */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing ? `Order ${viewing.orderNumber}` : ""} size="max-w-2xl">
        {viewing && (
          <div className="space-y-5 text-sm">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Customer</p>
                <p className="font-medium">{viewing.shippingAddress.firstName} {viewing.shippingAddress.lastName}</p>
                <p className="text-muted-foreground">{viewing.shippingAddress.phone}</p>
                {viewing.shippingAddress.email && <p className="text-muted-foreground break-all">{viewing.shippingAddress.email}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusClass(viewing.status)}`}>{viewing.status.replace(/_/g, " ")}</span>
                <p className="text-muted-foreground mt-2">{new Date(viewing.createdAt).toLocaleString("en-IN")}</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Shipping address</p>
              <p className="text-muted-foreground">
                {[viewing.shippingAddress.addressLine1, viewing.shippingAddress.addressLine2, viewing.shippingAddress.city, viewing.shippingAddress.state, viewing.shippingAddress.postalCode, viewing.shippingAddress.country].filter(Boolean).join(", ")}
              </p>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr><th className="px-4 py-2 text-left font-medium">Item</th><th className="px-4 py-2 text-right font-medium">Qty</th><th className="px-4 py-2 text-right font-medium">Price</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {viewing.items.map((it, i) => {
                    const item = it as { name?: string; quantity?: number; price?: number; totalPrice?: number; product?: { name?: string } };
                    return (
                      <tr key={i}>
                        <td className="px-4 py-2">{item.name || item.product?.name || "Item"}</td>
                        <td className="px-4 py-2 text-right">{item.quantity ?? 1}</td>
                        <td className="px-4 py-2 text-right">₹{(item.totalPrice ?? item.price ?? 0).toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between border-t border-border pt-3 font-medium">
              <span>Total</span>
              <span className="font-heading text-lg">₹{viewing.totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
