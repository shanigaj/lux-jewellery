"use client";

import dynamic from "next/dynamic";
import {
  TrendingUp,
  Users,
  CreditCard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";

// Dynamically import heavy chart components
const AdminAreaChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.AdminAreaChart),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-muted/50 rounded-lg"></div> }
);

const AdminBarChart = dynamic(
  () => import("@/components/admin/Charts").then((mod) => mod.AdminBarChart),
  { ssr: false, loading: () => <div className="w-full h-full animate-pulse bg-muted/50 rounded-lg"></div> }
);

// Mock Data
const revenueData = [
  { name: "Mon", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Tue", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Wed", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Thu", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Fri", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Sat", total: Math.floor(Math.random() * 500000) + 100000 },
  { name: "Sun", total: Math.floor(Math.random() * 500000) + 100000 },
];

const salesData = [
  { name: "Rings", sales: 400 },
  { name: "Necklaces", sales: 300 },
  { name: "Earrings", sales: 200 },
  { name: "Bracelets", sales: 278 },
  { name: "Watches", sales: 189 },
];

const recentOrders = [
  { id: "LUX-1A2B3C", customer: "Priya Sharma", amount: 285000, status: "pending", date: "Just now" },
  { id: "LUX-4D5E6F", customer: "Rahul Verma", amount: 125000, status: "processing", date: "2 hrs ago" },
  { id: "LUX-7G8H9I", customer: "Anjali Gupta", amount: 450000, status: "shipped", date: "5 hrs ago" },
  { id: "LUX-0J1K2L", customer: "Vikram Singh", amount: 75000, status: "delivered", date: "1 day ago" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your store's performance and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select aria-label="Select date range" className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold">
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
            Download Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: "Total Revenue",
            value: "₹24,56,890",
            icon: CreditCard,
            trend: "+12.5%",
            isPositive: true,
          },
          {
            title: "Active Users",
            value: "1,204",
            icon: Users,
            trend: "+5.2%",
            isPositive: true,
          },
          {
            title: "New Orders",
            value: "42",
            icon: ShoppingBag,
            trend: "-2.4%",
            isPositive: false,
          },
          {
            title: "Conversion Rate",
            value: "3.24%",
            icon: TrendingUp,
            trend: "+1.1%",
            isPositive: true,
          },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <stat.icon size={120} className="text-foreground" />
            </div>
            
            <div className="flex items-center justify-between mb-4 relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon size={16} className="text-foreground" />
              </div>
            </div>
            <div className="relative z-10">
              <p className="font-heading text-2xl mb-1">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.trend} from last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg">Revenue Trends</h3>
            <button aria-label="More options" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <AdminAreaChart data={revenueData} />
          </div>
        </div>

        {/* Category Sales Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg">Sales by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            <AdminBarChart data={salesData} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table Preview */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-heading text-lg">Recent Orders</h3>
          <button className="text-sm text-gold hover:underline font-medium">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${order.status === 'delivered' ? 'bg-green-500/10 text-green-600' : ''}
                      ${order.status === 'shipped' ? 'bg-gold/10 text-gold' : ''}
                      ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-600' : ''}
                      ${order.status === 'pending' ? 'bg-orange-500/10 text-orange-600' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
