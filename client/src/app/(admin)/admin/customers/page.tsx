"use client";

import { useState } from "react";
import { Search, Filter, Download, Mail, MoreVertical } from "lucide-react";

// Mock Customer Data
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    tier: "platinum",
    totalOrders: 12,
    totalSpent: 1250000,
    lastOrder: "2026-07-15",
    status: "active"
  },
  {
    id: "CUST-002",
    name: "Rahul Verma",
    email: "rahul@example.com",
    phone: "+91 91234 56789",
    tier: "gold",
    totalOrders: 5,
    totalSpent: 450000,
    lastOrder: "2026-06-20",
    status: "active"
  },
  {
    id: "CUST-003",
    name: "Anjali Gupta",
    email: "anjali@example.com",
    phone: "+91 99887 76655",
    tier: "diamond",
    totalOrders: 28,
    totalSpent: 4850000,
    lastOrder: "2026-07-10",
    status: "active"
  },
  {
    id: "CUST-004",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 98765 12345",
    tier: "silver",
    totalOrders: 1,
    totalSpent: 75000,
    lastOrder: "2026-07-16",
    status: "inactive"
  }
];

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");

  const filteredCustomers = mockCustomers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium font-heading">
                        {customer.name.split(" ").map(n => n[0]).join("")}
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
                      day: "numeric", month: "short", year: "numeric"
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
                      <button className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border" title="Send Email">
                        <Mail size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border" title="More">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Showing {filteredCustomers.length} of {mockCustomers.length} customers</p>
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
