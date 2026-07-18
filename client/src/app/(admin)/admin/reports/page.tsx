"use client";

import { Download, FileText, Calendar, Filter } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const reportData = [
  { month: "Jan", sales: 4000, returns: 240 },
  { month: "Feb", sales: 3000, returns: 139 },
  { month: "Mar", sales: 2000, returns: 980 },
  { month: "Apr", sales: 2780, returns: 390 },
  { month: "May", sales: 1890, returns: 480 },
  { month: "Jun", sales: 2390, returns: 380 },
  { month: "Jul", sales: 3490, returns: 430 },
];

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Financial Reports</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export comprehensive business reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Sales Summary", desc: "Daily, Weekly, Monthly sales data", type: "CSV / PDF" },
          { name: "Tax Report", desc: "GST & regional tax calculations", type: "PDF" },
          { name: "Inventory Valuation", desc: "Current stock worth and margins", type: "CSV" },
          { name: "Customer LTV", desc: "Lifetime value and acquisition costs", type: "CSV / PDF" }
        ].map((report, idx) => (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-gold/50 transition-colors group cursor-pointer">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground mb-4 group-hover:bg-gold/10 group-hover:text-gold transition-colors">
              <FileText size={18} />
            </div>
            <h3 className="font-medium mb-1">{report.name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{report.desc}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                {report.type}
              </span>
              <button className="text-gold hover:underline text-xs font-medium flex items-center gap-1">
                <Download size={14} /> Generate
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-lg">Sales vs Returns (YTD)</h2>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-muted">
              <Calendar size={14} /> 2026
            </button>
            <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-muted">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.5 }} />
              <Tooltip 
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="sales" name="Sales" fill="#C4A265" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returns" name="Returns" fill="#888888" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
