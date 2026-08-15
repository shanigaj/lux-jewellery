"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, MapPin, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  type IAddress,
} from "@/store/api/addressApi";

const emptyForm = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const { data, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: adding }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const addresses = data?.data ?? [];
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (a: IAddress) => {
    setEditingId(a._id);
    setForm({ label: a.label ?? "Home", fullName: a.fullName, phone: a.phone, line1: a.line1, line2: a.line2 ?? "", city: a.city, state: a.state, postalCode: a.postalCode, country: a.country, isDefault: a.isDefault });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.fullName || !form.phone || !form.line1 || !form.city || !form.state || !form.postalCode) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      if (editingId) await updateAddress({ id: editingId, body: form }).unwrap();
      else await addAddress(form).unwrap();
      toast.success(editingId ? "Address updated" : "Address added");
      setShowForm(false);
    } catch {
      toast.error("Failed to save address");
    }
  };

  const remove = async (id: string) => {
    try { await deleteAddress(id).unwrap(); toast.success("Address removed"); }
    catch { toast.error("Failed to remove"); }
  };

  const makeDefault = async (a: IAddress) => {
    try { await updateAddress({ id: a._id, body: { isDefault: true } }).unwrap(); toast.success("Default address set"); }
    catch { toast.error("Failed"); }
  };

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground text-sm">Manage your shipping addresses for a faster enquiry &amp; delivery.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-6 py-2.5 bg-onyx dark:bg-gold text-white dark:text-onyx text-xs uppercase tracking-widest font-medium hover:bg-gold dark:hover:bg-white hover:text-onyx transition-colors rounded-lg w-fit">
          <Plus size={16} /> Add New Address
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground text-sm">Loading addresses…</p>
      ) : addresses.length === 0 ? (
        <div className="border border-border rounded-xl py-16 text-center text-muted-foreground">
          No saved addresses yet — add one for faster checkout.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {addresses.map((addr) => (
              <motion.div key={addr._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="border border-border rounded-xl p-6 relative group hover:border-gold/50 transition-colors">
                {addr.isDefault && (
                  <div className="absolute top-0 right-0 bg-gold text-onyx text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl flex items-center gap-1">
                    <Check size={12} /> Default
                  </div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-gold" />
                  <h3 className="font-medium">{addr.label || "Address"}</h3>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground mb-6">
                  <p className="text-foreground font-medium">{addr.fullName}</p>
                  <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  <p className="pt-2">{addr.phone}</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <button onClick={() => openEdit(addr)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => remove(addr._id)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                  {!addr.isDefault && (
                    <button onClick={() => makeDefault(addr)} className="ml-auto text-xs font-medium text-gold hover:underline">Set default</button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full shadow-luxury-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded" aria-label="Close"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Label</label><input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home / Work" className={inputCls} /></div>
                <div><label className="text-xs text-muted-foreground">Full name *</label><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputCls} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></div>
              <div><label className="text-xs text-muted-foreground">Address line 1 *</label><input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className={inputCls} /></div>
              <div><label className="text-xs text-muted-foreground">Address line 2</label><input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">City *</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} /></div>
                <div><label className="text-xs text-muted-foreground">State *</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputCls} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Postal code *</label><input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={inputCls} /></div>
                <div><label className="text-xs text-muted-foreground">Country</label><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} /> Set as default address
              </label>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setShowForm(false)} className="px-6 py-2 border border-border rounded-lg text-sm">Cancel</button>
              <button onClick={save} disabled={adding || updating} className="px-6 py-2 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg text-sm disabled:opacity-50">
                {adding || updating ? "Saving…" : "Save Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
