"use client";

import { useEffect, useState } from "react";
import { Megaphone, Save, Plus, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { useGetSettingsQuery, useUpdateSettingsMutation } from "@/store/api/settingsApi";

export default function AdminCMSPage() {
  const { data } = useGetSettingsQuery();
  const [save, { isLoading: isSaving }] = useUpdateSettingsMutation();
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (data?.data?.announcements) setMessages(data.data.announcements);
  }, [data]);

  const update = (i: number, v: string) => setMessages((m) => m.map((x, idx) => (idx === i ? v : x)));
  const add = () => setMessages((m) => [...m, ""]);
  const remove = (i: number) => setMessages((m) => m.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    const cleaned = messages.map((m) => m.trim()).filter(Boolean);
    if (cleaned.length === 0) {
      toast.error("Add at least one announcement");
      return;
    }
    try {
      await save({ announcements: cleaned }).unwrap();
      setMessages(cleaned);
      toast.success("Announcement bar updated");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-2xl">Content Management (CMS)</h1>
          <p className="text-sm text-muted-foreground">Manage storefront content — starting with the announcement bar.</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-onyx dark:bg-gold text-white dark:text-onyx px-6 py-2 rounded-lg text-sm font-medium hover:bg-gold dark:hover:bg-white transition-colors disabled:opacity-50">
          <Save size={16} /> {isSaving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/10">
              <h2 className="font-heading text-lg flex items-center gap-2">
                <Megaphone size={18} className="text-gold" /> Announcement Bar
              </h2>
              <button onClick={add} className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-medium text-gold hover:underline">
                <Plus size={14} /> Add message
              </button>
            </div>

            <div className="p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No messages — add one to show in the top bar.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-2.5 text-xs text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                    <input
                      value={m}
                      onChange={(e) => update(i, e.target.value)}
                      placeholder="e.g. Complimentary shipping on orders above ₹50,000"
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-gold outline-none transition-colors"
                    />
                    <button onClick={() => remove(i)} className="mt-1 p-2 text-muted-foreground hover:text-destructive rounded border border-border" title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-5">
            <h3 className="font-heading text-base flex items-center gap-2 mb-2"><Info size={16} className="text-gold" /> How it works</h3>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              These messages rotate in the announcement bar at the very top of the storefront. Changes go live for all
              visitors as soon as you save.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
