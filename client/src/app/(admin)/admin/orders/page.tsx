"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreHorizontal, Eye, Loader2 } from "lucide-react";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useGetAllOrdersQuery();
  const fetchedOrders = data?.orders || [];

  const filteredOrders = fetchedOrders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.shippingAddress.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.shippingAddress.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Orders</h1>
          <p className="text-sm text-muted-foreground">
            View, track, and manage all customer orders.
          </p>
        </div>
        <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export Orders
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by Order ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Filter size={16} /> More Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium text-right">Items</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-gold mb-2" size={24} />
                    <p className="text-sm text-muted-foreground">Loading orders...</p>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.orderNumber} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">{order.items.length}</td>
                  <td className="px-6 py-4 text-right font-medium">
                    ₹{order.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : ''}
                      ${['shipped', 'out_for_delivery'].includes(order.status) ? 'bg-gold/10 text-gold' : ''}
                      ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-600' : ''}
                      ${order.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : ''}
                      ${order.status === 'cancelled' ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredOrders.length} of {fetchedOrders.length} orders</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 bg-gold text-onyx font-medium rounded">1</button>
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
