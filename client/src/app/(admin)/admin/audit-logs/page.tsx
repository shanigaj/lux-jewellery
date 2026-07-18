"use client";

import { Activity, Search, Filter } from "lucide-react";

export default function AdminAuditLogsPage() {
  const logs = [
    { id: 1, action: "Updated Product Price", target: "SKU-LD100", user: "Priya (Super Admin)", date: "2026-07-17 10:45 AM", ip: "192.168.1.45" },
    { id: 2, action: "Created Coupon", target: "LUXE20", user: "Rahul (Store Manager)", date: "2026-07-16 14:20 PM", ip: "192.168.1.12" },
    { id: 3, action: "Deleted User Review", target: "REV-003", user: "Anjali (Support)", date: "2026-07-15 09:15 AM", ip: "192.168.1.88" },
    { id: 4, action: "Exported Customers CSV", target: "All Customers", user: "Priya (Super Admin)", date: "2026-07-14 16:30 PM", ip: "192.168.1.45" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Audit Logs</h1>
          <p className="text-sm text-muted-foreground">
            Track system activity, configuration changes, and security events.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className="text-gold" />
                      <span className="font-medium text-foreground">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{log.target}</td>
                  <td className="px-6 py-4">{log.user}</td>
                  <td className="px-6 py-4 text-muted-foreground">{log.date}</td>
                  <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
