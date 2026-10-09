"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Plus, Trash2, Loader2, UserPlus, Package } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/admin/Modal";
import {
  useCreateOrderMutation,
  type CreateOrderItemInput,
  type CreateOrderBody,
} from "@/store/api/orderApi";
import {
  INDIAN_STATES,
  COUNTRIES,
  MAJOR_CITIES,
  lookupPincode,
} from "@/lib/india-locations";

// ── Constants ──
const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card (POS)" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "stripe", label: "Stripe (Online)" },
  { value: "razorpay", label: "Razorpay (Online)" },
  { value: "other", label: "Other" },
];

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
];

const GST_RATE = 0.03; // 3% GST on gold jewellery (applied only for GST invoices)

const emptyItem = (): CreateOrderItemInput => ({
  name: "",
  quantity: 1,
  unitPrice: 0,
  totalPrice: 0,
});

// ── Helpers ──
const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const inputCx =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50";
const selectCx =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors";
const labelCx = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════
interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateOrderModal({ open, onClose }: Props) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  // ── Customer fields ──
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");

  // City dropdown suggestions + PIN-code auto-fill state.
  const [cityOptions, setCityOptions] = useState<string[]>(MAJOR_CITIES);
  const [pinLoading, setPinLoading] = useState(false);
  const lastPinRef = useRef("");

  const handlePincode = async (value: string) => {
    const pin = value.replace(/\D/g, "").slice(0, 6);
    setPostalCode(pin);
    if (pin.length !== 6 || pin === lastPinRef.current) return;
    lastPinRef.current = pin;
    setPinLoading(true);
    const res = await lookupPincode(pin);
    setPinLoading(false);
    if (!res) {
      toast.error("PIN code not found — fill city/state manually");
      return;
    }
    if (res.state) setState(res.state);
    if (res.country) setCountry(res.country);
    if (res.city) setCity(res.city);
    setCityOptions(
      Array.from(new Set([res.city, ...res.areas, ...MAJOR_CITIES].filter(Boolean)))
    );
  };

  // ── Line items ──
  const [items, setItems] = useState<CreateOrderItemInput[]>([emptyItem()]);

  // ── Payment & status ──
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [transactionId, setTransactionId] = useState("");
  const [orderStatus, setOrderStatus] = useState("confirmed");
  const [paymentStatus, setPaymentStatus] = useState("completed");
  const [adminNote, setAdminNote] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(false); // simple bill by default

  // ── Calculations ──
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + (it.totalPrice || 0), 0),
    [items]
  );
  const taxRate = gstEnabled ? GST_RATE : 0;
  const taxAmount = useMemo(
    () => (gstEnabled ? Math.round(subtotal * GST_RATE) : 0),
    [subtotal, gstEnabled]
  );
  const totalAmount = useMemo(
    () => subtotal + taxAmount + shippingCost,
    [subtotal, taxAmount, shippingCost]
  );

  // ── Item handlers ──
  const updateItem = useCallback(
    (idx: number, patch: Partial<CreateOrderItemInput>) => {
      setItems((prev) => {
        const next = [...prev];
        const updated = { ...next[idx], ...patch };
        // Auto-calculate totalPrice when qty/unitPrice change
        if ("quantity" in patch || "unitPrice" in patch) {
          updated.totalPrice = (updated.quantity || 1) * (updated.unitPrice || 0);
        }
        next[idx] = updated;
        return next;
      });
    },
    []
  );

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (idx: number) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  // ── Submit ──
  const handleSubmit = async () => {
    // Basic validation
    const validItems = items.filter((it) => it.name.trim() && it.unitPrice > 0);
    if (!validItems.length) {
      toast.error("Add at least one item with a name and price");
      return;
    }
    if (!firstName.trim() && !phone.trim()) {
      toast.error("Provide at least a customer name or phone number");
      return;
    }

    const body: CreateOrderBody = {
      items: validItems,
      shippingAddress: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      subtotal,
      shippingCost,
      taxAmount,
      taxRate,
      couponDiscount: 0,
      giftCardAmount: 0,
      totalAmount,
      customerNote: customerNote.trim() || undefined,
      status: orderStatus,
      paymentStatus,
      adminNote: adminNote.trim() || undefined,
    };

    try {
      const result = await createOrder(body).unwrap();
      toast.success(`Order ${result.order.orderNumber} created!`);
      resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create order");
    }
  };

  const resetForm = () => {
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setAddressLine1(""); setAddressLine2(""); setCity(""); setState("");
    setPostalCode(""); setCountry("India");
    setCityOptions(MAJOR_CITIES); setPinLoading(false); lastPinRef.current = "";
    setItems([emptyItem()]);
    setPaymentMethod("cash"); setTransactionId("");
    setOrderStatus("confirmed"); setPaymentStatus("completed");
    setAdminNote(""); setCustomerNote(""); setShippingCost(0); setGstEnabled(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Walk-in Order" size="max-w-3xl">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* ── Customer Info ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UserPlus size={16} className="text-gold" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Customer</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCx}>First Name *</label>
              <input className={inputCx} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </div>
            <div>
              <label className={labelCx}>Last Name</label>
              <input className={inputCx} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
            </div>
            <div>
              <label className={labelCx}>Phone *</label>
              <input className={inputCx} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 99999 00000" />
            </div>
            <div>
              <label className={labelCx}>Email</label>
              <input className={inputCx} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCx}>Address Line 1</label>
              <input className={inputCx} value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Street address" />
            </div>
            <div>
              <label className={labelCx}>PIN Code</label>
              <div className="relative">
                <input
                  className={inputCx}
                  value={postalCode}
                  onChange={(e) => handlePincode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="395011 — auto-fills city/state"
                />
                {pinLoading && (
                  <Loader2
                    size={14}
                    className="animate-spin text-gold absolute right-3 top-1/2 -translate-y-1/2"
                  />
                )}
              </div>
            </div>
            <div>
              <label className={labelCx}>City</label>
              <input
                className={inputCx}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                list="order-city-options"
                placeholder="Select or type city"
              />
              <datalist id="order-city-options">
                {cityOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <div>
              <label className={labelCx}>State</label>
              <select
                className={selectCx}
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select state</option>
                {(state && !INDIAN_STATES.includes(state)
                  ? [state, ...INDIAN_STATES]
                  : INDIAN_STATES
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Country</label>
              <select
                className={selectCx}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {(country && !COUNTRIES.includes(country)
                  ? [country, ...COUNTRIES]
                  : COUNTRIES
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Line Items ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Items</h3>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="col-span-12 sm:col-span-5">
                  <label className={labelCx}>Item Name</label>
                  <input
                    className={inputCx}
                    value={item.name}
                    onChange={(e) => updateItem(idx, { name: e.target.value })}
                    placeholder="e.g. Diamond Solitaire Ring"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className={labelCx}>SKU</label>
                  <input
                    className={inputCx}
                    value={item.sku || ""}
                    onChange={(e) => updateItem(idx, { sku: e.target.value })}
                    placeholder="SPZ-..."
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className={labelCx}>Qty</label>
                  <input
                    className={inputCx}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, { quantity: Math.max(1, +e.target.value) })}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className={labelCx}>Unit Price (₹)</label>
                  <input
                    className={inputCx}
                    type="number"
                    min={0}
                    value={item.unitPrice || ""}
                    onChange={(e) => updateItem(idx, { unitPrice: +e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1 text-right">
                  <label className={labelCx}>Total</label>
                  <p className="py-2 text-sm font-medium text-foreground">{inr(item.totalPrice)}</p>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length <= 1}
                    className="p-2 text-muted-foreground hover:text-destructive disabled:opacity-30 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payment & Status ── */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Payment & Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCx}>Payment Method</label>
              <select className={selectCx} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Transaction / Reference ID</label>
              <input className={inputCx} value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCx}>Order Status</label>
              <select className={selectCx} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Payment Status</label>
              <select className={selectCx} value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Shipping Cost (₹)</label>
              <input className={inputCx} type="number" min={0} value={shippingCost || ""} onChange={(e) => setShippingCost(+e.target.value)} placeholder="0" />
            </div>
            <div className="sm:col-span-2 flex items-center justify-between rounded-lg border border-border bg-muted/20 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">GST Invoice</p>
                <p className="text-xs text-muted-foreground">
                  {gstEnabled
                    ? `Adds ${(GST_RATE * 100).toFixed(0)}% GST + GSTIN on the bill`
                    : "Simple bill — no GST or GSTIN"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={gstEnabled}
                onClick={() => setGstEnabled((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${gstEnabled ? "bg-gold" : "bg-border"}`}
                aria-label="Toggle GST invoice"
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${gstEnabled ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ── Notes ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCx}>Customer Note</label>
              <textarea className={inputCx} rows={2} value={customerNote} onChange={(e) => setCustomerNote(e.target.value)} placeholder="Customer's note (optional)" />
            </div>
            <div>
              <label className={labelCx}>Admin Note (internal)</label>
              <textarea className={inputCx} rows={2} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Internal note (not visible to customer)" />
            </div>
          </div>
        </section>

        {/* ── Summary ── */}
        <section className="border-t border-border pt-4">
          <div className="flex flex-col items-end gap-1 text-sm">
            <div className="flex justify-between w-60">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{inr(subtotal)}</span>
            </div>
            {gstEnabled && (
              <div className="flex justify-between w-60">
                <span className="text-muted-foreground">GST ({(GST_RATE * 100).toFixed(0)}%)</span>
                <span className="font-medium">{inr(taxAmount)}</span>
              </div>
            )}
            {shippingCost > 0 && (
              <div className="flex justify-between w-60">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{inr(shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between w-60 border-t border-gold pt-2 mt-1">
              <span className="font-bold">Grand Total</span>
              <span className="font-heading text-lg text-gold font-bold">{inr(totalAmount)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
        <button
          type="button"
          onClick={() => { resetForm(); onClose(); }}
          className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-2 text-sm font-bold bg-gold text-onyx rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Create Order
        </button>
      </div>
    </Modal>
  );
}
