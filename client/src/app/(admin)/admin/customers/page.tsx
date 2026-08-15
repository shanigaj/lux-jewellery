"use client";

import { useMemo, useState } from "react";
import { Search, Filter, Download, Mail, MoreVertical } from "lucide-react";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";

type Tier = "diamond" | "platinum" | "gold" | "silver";

interface DerivedCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: Tier;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
  status: "active" | "inactive";
}

function tierFor(spent: number): Tier {
  if (spent >= 2_000_000) return "diamond";
  if (spent >= 500_000) return "platinum";
  if (spent >= 100_000) return "gold";
  return "silver";
}

const ACTIVE_WINDOW_MS = 180 * 24 * 60 * 60 * 1000;

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  // Real CRM: unique customers aggregated from orders (no users endpoint exists).
  const { data, isLoading } = useGetAllOrdersQuery();

  const customers = useMemo<DerivedCustomer[]>(() => {
    const orders = data?.orders ?? [];
    const byEmail = new Map<string, DerivedCustomer>();

    for (const o of orders) {
      const addr = o.shippingAddress;
      const email = (addr?.email || o.user || "guest").toLowerCase();
      const name = [addr?.firstName, addr?.lastName].filter(Boolean).join(" ") || "Guest";
      const existing = byEmail.get(email);
      const amount = o.totalAmount || 0;

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += amount;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
      } else {
        byEmail.set(email, {
          id: email,
          name,
          email: addr?.email || "—",
          phone: addr?.phone || "—",
          tier: "silver",
          totalOrders: 1,
          totalSpent: amount,
          lastOrder: o.createdAt,
          status: "active",
        });
      }
    }

    const now = Date.now();
    return Array.from(byEmail.values())
      .map((c): DerivedCustomer => ({
        ...c,
        tier: tierFor(c.totalSpent),
        status: now - new Date(c.lastOrder).getTime() <= ACTIVE_WINDOW_MS ? "active" : "inactive",
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [data]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Customers</h1>
          <p className="text-sm text-muted-foreground">
            Manage your client base, view purchase history, and tier status.
          </p>
        </div>
        <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export Customers
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Name or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold"
            >
              <option value="all">All Tiers</option>
              <option value="diamond">Diamond</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Info</th>
                <th className="px-6 py-4 font-medium">Tier</th>
                <th className="px-6 py-4 font-medium text-right">Orders</th>
                <th className="px-6 py-4 font-medium text-right">Total Spent</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    Loading customers…
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    No customers yet — they appear here once orders are placed.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium font-heading">
                          {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                        ${customer.tier === 'diamond' ? 'bg-purple-500/10 text-purple-600' : ''}
                        ${customer.tier === 'platinum' ? 'bg-slate-300/30 text-slate-700 dark:text-slate-300' : ''}
                        ${customer.tier === 'gold' ? 'bg-gold/10 text-gold' : ''}
                        ${customer.tier === 'silver' ? 'bg-muted text-muted-foreground' : ''}
                      `}>
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">{customer.totalOrders}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      ₹{customer.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(customer.lastOrder).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                        customer.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={customer.email !== "—" ? `mailto:${customer.email}` : undefined} className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border" title="Send Email">
                          <Mail size={14} />
                        </a>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border" title="More">
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredCustomers.length} of {customers.length} customers</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 bg-gold text-onyx font-medium rounded">1</button>
            <button className="px-3 py-1 border border-border rounded disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
