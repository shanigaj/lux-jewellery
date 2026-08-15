"use client";

import { useMemo, useState } from "react";
import { Activity, Search } from "lucide-react";
import { useGetAuditLogsQuery } from "@/store/api/auditApi";

export default function AdminAuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAuditLogsQuery();

  const logs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (data?.data ?? []).filter(
      (l) =>
        l.action.toLowerCase().includes(term) ||
        (l.target ?? "").toLowerCase().includes(term) ||
        l.userName.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
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
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading logs…</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">No activity logged yet.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Activity size={14} className="text-gold" />
                        <span className="font-medium text-foreground">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{log.target ?? "—"}</td>
                    <td className="px-6 py-4">
                      {log.userName}
                      {log.role ? <span className="text-muted-foreground"> ({log.role})</span> : null}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">{log.ip || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
