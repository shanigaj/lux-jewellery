"use client";

import { useMemo, useState } from "react";
import { Shield, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useGetUsersQuery, useUpdateUserRoleMutation, type IAdminUser } from "@/store/api/userApi";
import { Modal } from "@/components/admin/Modal";

const ROLE_META: Record<string, { name: string; description: string }> = {
  admin: { name: "Super Admin", description: "Full access to all modules and settings." },
  manager: { name: "Store Manager", description: "Products, orders, inventory, and customers." },
  support: { name: "Customer Support", description: "Orders, customers, and reviews." },
  user: { name: "Customer", description: "Standard storefront shopper account." },
};
const ROLES = ["admin", "manager", "support", "user"] as const;

export default function AdminRolesPage() {
  const { data, isLoading } = useGetUsersQuery();
  const [updateRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [manageOpen, setManageOpen] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const users = useMemo(() => data?.data ?? [], [data]);
  const count = (role: string) => users.filter((u) => u.role === role).length;

  const changeRole = async (u: IAdminUser, role: IAdminUser["role"]) => {
    if (role === u.role) return;
    setSavingId(u._id);
    try {
      await updateRole({ id: u._id, role }).unwrap();
      toast.success(`${u.firstName || u.email} is now ${ROLE_META[role].name}`);
    } catch (e) {
      toast.error((e as { data?: { message?: string } })?.data?.message || "Failed to change role");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Roles &amp; Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Assign team members to a role. Roles are fixed by the platform; use “Manage Users” to promote or demote.
          </p>
        </div>
        <button onClick={() => setManageOpen(true)} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-4 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors">
          <Users size={16} /> Manage Users
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ROLES.map((role) => (
          <div key={role} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-gold/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center"><Shield size={18} /></div>
              <h3 className="font-heading text-lg">{ROLE_META[role].name}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{ROLE_META[role].description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
              <span className="text-muted-foreground font-medium">{isLoading ? "…" : count(role)} {count(role) === 1 ? "user" : "users"}</span>
              <button onClick={() => setManageOpen(true)} className="text-gold hover:underline font-medium">Manage Users</button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={manageOpen} onClose={() => setManageOpen(false)} title="Manage users & roles" size="max-w-2xl">
        {isLoading ? (
          <div className="py-8 text-center"><Loader2 className="animate-spin mx-auto text-gold" size={22} /></div>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No users yet.</p>
        ) : (
          <div className="max-h-[60vh] overflow-y-auto -mx-4">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-muted/30 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">User</th>
                  <th className="px-4 py-2 text-left font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}</p>
                      <p className="text-xs text-muted-foreground break-all">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          disabled={isUpdating && savingId === u._id}
                          onChange={(e) => changeRole(u, e.target.value as IAdminUser["role"])}
                          className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gold capitalize disabled:opacity-50"
                        >
                          {ROLES.map((r) => <option key={r} value={r} className="capitalize">{ROLE_META[r].name}</option>)}
                        </select>
                        {savingId === u._id && isUpdating && <Loader2 size={14} className="animate-spin text-gold" />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
