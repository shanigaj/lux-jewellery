"use client";

import { useMemo, useState } from "react";
import { Search, Download, Mail, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useGetAllOrdersQuery } from "@/store/api/orderApi";
import { useGetUsersQuery } from "@/store/api/userApi";
import { exportCsv } from "@/lib/export-csv";
import { Modal } from "@/components/admin/Modal";

type Tier = "diamond" | "platinum" | "gold" | "silver";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: Tier;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string | null;
  registered: boolean;
  status: "active" | "inactive";
}

function tierFor(spent: number): Tier {
  if (spent >= 2_000_000) return "diamond";
  if (spent >= 500_000) return "platinum";
  if (spent >= 100_000) return "gold";
  return "silver";
}

const ACTIVE_WINDOW_MS = 180 * 24 * 60 * 60 * 1000;
const PER_PAGE = 12;

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<Customer | null>(null);

  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const isLoading = ordersLoading || usersLoading;

  const customers = useMemo<Customer[]>(() => {
    const byEmail = new Map<string, Customer>();

    // 1) Seed from real registered users.
    for (const u of usersData?.data ?? []) {
      if (u.role === "admin") continue; // staff, not customers
      const email = (u.email || "").toLowerCase();
      if (!email) continue;
      byEmail.set(email, {
        id: email,
        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email,
        email: u.email,
        phone: "—",
        tier: "silver",
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: null,
        registered: true,
        status: "inactive",
      });
    }

    // 2) Overlay order aggregates (also captures guest buyers with no account).
    for (const o of ordersData?.orders ?? []) {
      const addr = o.shippingAddress;
      const email = (addr?.email || o.user || "guest").toLowerCase();
      const name = [addr?.firstName, addr?.lastName].filter(Boolean).join(" ") || "Guest";
      const amount = o.totalAmount || 0;
      const existing = byEmail.get(email);
      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += amount;
        if (addr?.phone) existing.phone = addr.phone;
        if (!existing.lastOrder || new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
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
          registered: false,
          status: "active",
        });
      }
    }

    const now = Date.now();
    return Array.from(byEmail.values())
      .map((c): Customer => ({
        ...c,
        tier: tierFor(c.totalSpent),
        status: c.lastOrder && now - new Date(c.lastOrder).getTime() <= ACTIVE_WINDOW_MS ? "active" : "inactive",
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }, [ordersData, usersData]);

  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    const matchesTier = tierFilter === "all" || c.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleExport = () => {
    if (!filtered.length) return toast.error("Nothing to export");
    exportCsv(
      "customers.csv",
      filtered.map((c) => ({
        name: c.name,
        email: c.email,
        phone: c.phone,
        tier: c.tier,
        orders: c.totalOrders,
        spent: c.totalSpent,
        type: c.registered ? "Registered" : "Guest",
        lastOrder: c.lastOrder ? new Date(c.lastOrder).toLocaleDateString("en-IN") : "—",
      })),
      [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "phone", header: "Phone" },
        { key: "tier", header: "Tier" },
        { key: "orders", header: "Orders" },
        { key: "spent", header: "Total Spent (INR)" },
        { key: "type", header: "Type" },
        { key: "lastOrder", header: "Last Order" },
      ]
    );
  };

  const tierClass = (t: Tier) =>
    t === "diamond" ? "bg-purple-500/10 text-purple-600"
    : t === "platinum" ? "bg-slate-300/30 text-slate-700 dark:text-slate-300"
    : t === "gold" ? "bg-gold/10 text-gold"
    : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Customers</h1>
          <p className="text-sm text-muted-foreground">Registered clients and guest buyers, with purchase history and tier.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border border-border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
          <Download size={16} /> Export Customers
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Name or Email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => { setTierFilter(e.target.value); setPage(1); }}
            className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold capitalize"
          >
            <option value="all">All Tiers</option>
            <option value="diamond">Diamond</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>
        </div>

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
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">Loading customers…</td></tr>
              ) : pageRows.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">No customers match your filters.</td></tr>
              ) : pageRows.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium font-heading uppercase">
                        {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {customer.name}
                          {!customer.registered && <span className="text-[9px] uppercase tracking-wider text-muted-foreground border border-border rounded px-1">Guest</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${tierClass(customer.tier)}`}>{customer.tier}</span></td>
                  <td className="px-6 py-4 text-right">{customer.totalOrders}</td>
                  <td className="px-6 py-4 text-right font-medium">₹{customer.totalSpent.toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                  <td className="px-6 py-4 text-center"><span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${customer.status === "active" ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>{customer.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={customer.email !== "—" ? `mailto:${customer.email}` : undefined} className="p-1.5 text-muted-foreground hover:text-gold bg-background rounded border border-border" title="Send Email"><Mail size={14} /></a>
                      <button onClick={() => setDetail(customer)} className="p-1.5 text-muted-foreground hover:text-foreground bg-background rounded border border-border" title="View details"><MoreVertical size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/10">
          <p>Page {page} of {totalPages} · {filtered.length} customers</p>
          <div className="flex gap-1 items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">Prev</button>
            <span className="px-3 py-1 bg-gold text-onyx font-medium rounded">{page}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border border-border rounded disabled:opacity-40 hover:bg-muted transition-colors">Next</button>
          </div>
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Customer details">
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-heading uppercase">{detail.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
              <div>
                <p className="font-medium text-base">{detail.name}</p>
                <p className="text-muted-foreground">{detail.registered ? "Registered customer" : "Guest buyer"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Info label="Email" value={detail.email} />
              <Info label="Phone" value={detail.phone} />
              <Info label="Tier" value={detail.tier} />
              <Info label="Status" value={detail.status} />
              <Info label="Total orders" value={String(detail.totalOrders)} />
              <Info label="Total spent" value={`₹${detail.totalSpent.toLocaleString("en-IN")}`} />
              <Info label="Last order" value={detail.lastOrder ? new Date(detail.lastOrder).toLocaleDateString("en-IN") : "—"} />
            </div>
            {detail.email !== "—" && (
              <a href={`mailto:${detail.email}`} className="inline-flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
                <Mail size={14} /> Email customer
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium capitalize break-all">{value}</p>
    </div>
  );
}
