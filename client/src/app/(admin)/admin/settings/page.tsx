"use client";

import { useEffect, useState } from "react";
import { Save, Store, Mail, CreditCard, Shield, Globe } from "lucide-react";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settingsApi";

const TABS = [
  { key: "general", name: "General", icon: Store },
  { key: "shipping", name: "Taxes & Shipping", icon: Globe },
  { key: "email", name: "Email Notifications", icon: Mail },
  { key: "payment", name: "Payment Gateways", icon: CreditCard },
  { key: "security", name: "Security & Privacy", icon: Shield },
] as const;

const empty = {
  storeName: "",
  supportEmail: "",
  supportPhone: "",
  address: "",
  currency: "INR",
  timezone: "Asia/Kolkata",
  freeShippingThreshold: 50000,
};

export default function AdminSettingsPage() {
  const { data } = useGetSettingsQuery();
  const [save, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("general");
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (data?.data) {
      const d = data.data;
      setForm({
        storeName: d.storeName ?? "",
        supportEmail: d.supportEmail ?? "",
        supportPhone: d.supportPhone ?? "",
        address: d.address ?? "",
        currency: d.currency ?? "INR",
        timezone: d.timezone ?? "Asia/Kolkata",
        freeShippingThreshold: d.freeShippingThreshold ?? 50000,
      });
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await save(form).unwrap();
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const label = "text-xs uppercase tracking-wider font-medium text-muted-foreground";
  const input = "w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:border-gold outline-none transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Store Settings</h1>
          <p className="text-sm text-muted-foreground">Manage global store configurations.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50">
          <Save size={16} /> {isSaving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}>
              <t.icon size={16} /> {t.name}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6">
            {tab === "general" && (
              <>
                <h2 className="font-heading text-lg mb-6 border-b border-border pb-4">General</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className={label}>Store Name</label>
                      <input type="text" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className={input} />
                    </div>
                    <div className="space-y-1.5">
                      <label className={label}>Support Email</label>
                      <input type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} className={input} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Support Phone</label>
                    <input type="text" value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} className={input} />
                  </div>
                  <div className="space-y-1.5">
                    <label className={label}>Store Address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} className={`${input} resize-none`} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
                    <div className="space-y-1.5">
                      <label className={label}>Currency</label>
                      <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={input}>
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className={label}>Timezone</label>
                      <select value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className={input}>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {tab === "shipping" && (
              <>
                <h2 className="font-heading text-lg mb-6 border-b border-border pb-4">Taxes & Shipping</h2>
                <div className="space-y-6 max-w-md">
                  <div className="space-y-1.5">
                    <label className={label}>Free shipping threshold (₹)</label>
                    <input type="number" value={form.freeShippingThreshold} onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })} className={input} />
                    <p className="text-[11px] text-muted-foreground">Orders above this amount ship free.</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    GST and export-duty calculations are available in the{" "}
                    <a href="/admin/pricing" className="text-gold hover:underline">Pricing Calculator</a>.
                  </p>
                </div>
              </>
            )}

            {tab === "email" && (
              <div className="text-sm text-muted-foreground">
                <h2 className="font-heading text-lg mb-4 text-foreground">Email Notifications</h2>
                SMTP (order &amp; OTP emails) is configured via the server environment. Current sender: <span className="text-foreground">{form.supportEmail || "—"}</span>.
              </div>
            )}
            {tab === "payment" && (
              <div className="text-sm text-muted-foreground">
                <h2 className="font-heading text-lg mb-4 text-foreground">Payment Gateways</h2>
                Checkout currently runs on an enquiry-first model over WhatsApp — no online payment gateway is enabled.
              </div>
            )}
            {tab === "security" && (
              <div className="text-sm text-muted-foreground">
                <h2 className="font-heading text-lg mb-4 text-foreground">Security &amp; Privacy</h2>
                Admin access is role-based (RBAC). Manage users under{" "}
                <a href="/admin/roles" className="text-gold hover:underline">Roles &amp; Users</a>, and review activity in{" "}
                <a href="/admin/audit-logs" className="text-gold hover:underline">Audit Logs</a>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
