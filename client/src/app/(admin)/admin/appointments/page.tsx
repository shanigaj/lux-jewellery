"use client";

import { useMemo, useState } from "react";
import { Search, Calendar, Video, Store } from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllAppointmentsQuery,
  useUpdateAppointmentStatusMutation,
} from "@/store/api/appointmentApi";

const STATUSES = ["requested", "confirmed", "completed", "cancelled"] as const;

const statusClass: Record<string, string> = {
  requested: "bg-orange-500/10 text-orange-600",
  confirmed: "bg-green-500/10 text-green-600",
  completed: "bg-blue-500/10 text-blue-600",
  cancelled: "bg-red-500/10 text-red-500",
};

export default function AdminAppointmentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading } = useGetAllAppointmentsQuery();
  const [updateStatus] = useUpdateAppointmentStatusMutation();

  const appointments = useMemo(() => {
    const term = search.toLowerCase();
    return (data?.data ?? []).filter((a) => {
      const matchesSearch =
        a.name.toLowerCase().includes(term) ||
        a.email.toLowerCase().includes(term) ||
        (a.interest ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const setStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Boutique visits and virtual consultations booked by clients.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-gold transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-background border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-gold"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">When</th>
                <th className="px-6 py-4 font-medium">Topic</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Set status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading appointments…</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No appointments yet.</td></tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.email}</p>
                      <p className="text-xs text-muted-foreground">{a.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                        {a.experience === "virtual" ? <Video size={14} /> : <Store size={14} />}
                        <span className="capitalize">{a.experience}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={14} />
                        {a.date} · {a.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-foreground">{a.interest || "—"}</p>
                      {a.notes && <p className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">{a.notes}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusClass[a.status] || "bg-muted text-muted-foreground"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={a.status}
                        onChange={(e) => setStatus(a._id, e.target.value)}
                        className="bg-background border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-gold"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border text-sm text-muted-foreground bg-muted/10">
          {appointments.length} appointment{appointments.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}
