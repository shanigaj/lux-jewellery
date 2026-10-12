"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { Plus, Loader2, UserPlus, Package, FileText, Calculator, Printer } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/admin/Modal";
import { PhoneInput } from "@/components/admin/PhoneInput";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  type CreateOrderItemInput,
  type CreateOrderBody,
} from "@/store/api/orderApi";
import {
  INDIAN_STATES,
  COUNTRIES,
  MAJOR_CITIES,
  lookupPincode,
} from "@/lib/india-locations";
import type { IOrder, IOrderItem } from "@/types/order.types";
import type {
  LineItem,
  InvoiceConfig,
  InvoiceDraft,
  PricingInfo,
  InvoiceType,
  Currency,
  PaymentStatus,
  PaymentMethod,
  PresetKey,
} from "@/lib/invoice-builder/types";
import {
  emptyItem,
  defaultConfig,
  defaultDraft,
  getPreset,
  PRESETS,
} from "@/lib/invoice-builder/config";
import {
  computeTotals,
  itemTotal,
  metalValue,
  formatMoney,
} from "@/lib/invoice-builder/calc";
import {
  loadConfig,
  saveConfig,
  loadBusiness,
  peekInvoiceNumber,
  commitInvoiceNumber,
} from "@/lib/invoice-builder/storage";
import { printInvoiceDoc } from "@/lib/invoice-builder/render";
import { LineItemFields } from "@/components/admin/invoice/LineItemFields";
import { SelectInput, NumberInput, Toggle } from "@/components/admin/invoice/ui";

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
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "returned", label: "Returned" },
  { value: "refunded", label: "Refunded" },
];

// ── Helpers ──
const inputCx =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors placeholder:text-muted-foreground/50";
const selectCx =
  "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-gold transition-colors";
const labelCx = "block text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider";

// Map an existing order item (API shape) into the rich editable line item.
const toLineItem = (it: Partial<IOrderItem> & Record<string, any>): LineItem => ({
  ...emptyItem(),
  name: it.name ?? it.product?.name ?? "",
  sku: it.sku ?? "",
  description: it.description ?? "",
  imageUrl: it.imageUrl ?? it.thumbnail ?? "",
  category: it.category ?? "",
  metalType: (it.metalType as LineItem["metalType"]) ?? "",
  metalPurity: (it.metalPurity as LineItem["metalPurity"]) ?? "",
  grossWeight: it.grossWeight ?? null,
  netWeight: it.netWeight ?? null,
  metalRate: it.metalRate ?? null,
  metalValueOverride: it.metalValue ?? null,
  stoneType: (it.stoneType as LineItem["stoneType"]) ?? "",
  stoneWeight: it.stoneWeight ?? null,
  stoneColor: it.stoneColor ?? "",
  stoneClarity: it.stoneClarity ?? "",
  stoneCut: it.stoneCut ?? "",
  stoneQuality: it.stoneQuality ?? "",
  stoneValue: it.stoneValue ?? null,
  ringSize: it.ringSize ?? it.size ?? "",
  length: it.length ?? "",
  quantity: it.quantity ?? 1,
  unitPrice: it.unitPrice ?? null,
  makingCharges: it.makingCharges ?? null,
  wastageCharges: it.wastageCharges ?? null,
  otherCharges: it.otherCharges ?? null,
  discount: it.discount ?? null,
});

// Map a rich line item to the order API payload (includes all jewellery detail).
const toApiItem = (it: LineItem, mode: PricingInfo["mode"]): CreateOrderItemInput => {
  const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
  const total = itemTotal(it, mode);
  const unit = qty > 0 ? total / qty : total;
  const mv = metalValue(it);
  const n = (v: number | null) => (v != null && v > 0 ? v : undefined);
  const s = (v: string) => (v.trim() ? v.trim() : undefined);
  return {
    name: it.name.trim(),
    sku: s(it.sku),
    thumbnail: s(it.imageUrl),
    metalType: s(it.metalType),
    metalPurity: s(it.metalPurity),
    size: s(it.ringSize),
    quantity: qty,
    unitPrice: Math.round(unit),
    totalPrice: Math.round(total),
    description: s(it.description),
    imageUrl: s(it.imageUrl),
    category: s(it.category),
    grossWeight: n(it.grossWeight),
    netWeight: n(it.netWeight),
    metalRate: n(it.metalRate),
    metalValue: mv > 0 ? Math.round(mv) : undefined,
    stoneType: s(it.stoneType),
    stoneWeight: n(it.stoneWeight),
    stoneColor: s(it.stoneColor),
    stoneClarity: s(it.stoneClarity),
    stoneCut: s(it.stoneCut),
    stoneQuality: s(it.stoneQuality),
    stoneValue: n(it.stoneValue),
    ringSize: s(it.ringSize),
    length: s(it.length),
    makingCharges: n(it.makingCharges),
    wastageCharges: n(it.wastageCharges),
    otherCharges: n(it.otherCharges),
    discount: n(it.discount),
  };
};

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════
interface Props {
  open: boolean;
  onClose: () => void;
  /** When provided, the modal edits this order instead of creating a new one.
   *  Pass a `key` of the order id so it remounts (re-initialises) when switching. */
  order?: IOrder | null;
}

export function CreateOrderModal({ open, onClose, order }: Props) {
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: updating }] = useUpdateOrderMutation();
  const isLoading = creating || updating;
  const isEdit = !!order;
  const sa = order?.shippingAddress;

  // ── Shared invoice field config (managed in the Invoice Builder) ──
  const [config, setConfig] = useState<InvoiceConfig>(() => loadConfig() ?? defaultConfig());
  const f = useCallback((key: string) => config.fields[key] !== false, [config]);

  // ── Customer fields ──
  const [firstName, setFirstName] = useState(sa?.firstName ?? "");
  const [lastName, setLastName] = useState(sa?.lastName ?? "");
  const [email, setEmail] = useState(sa?.email ?? "");
  const [phone, setPhone] = useState(sa?.phone ?? "");
  const [addressLine1, setAddressLine1] = useState(sa?.addressLine1 ?? "");
  const [city, setCity] = useState(sa?.city ?? "");
  const [state, setState] = useState(sa?.state ?? "");
  const [postalCode, setPostalCode] = useState(sa?.postalCode ?? "");
  const [country, setCountry] = useState(sa?.country ?? "India");

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

  // ── Line items (rich) ──
  const [items, setItems] = useState<LineItem[]>(
    order?.items?.length ? order.items.map(toLineItem) : [emptyItem()]
  );

  // ── Invoice meta ──
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(
    (order?.invoiceType as InvoiceType) || "tax_invoice"
  );
  const [currency, setCurrency] = useState<Currency>((order?.currency as Currency) || "INR");
  const [invoiceNumber, setInvoiceNumber] = useState(
    order?.invoiceNumber || peekInvoiceNumber((order?.invoiceType as InvoiceType) || "tax_invoice")
  );

  // ── Payment & status ──
  const [paymentMethod, setPaymentMethod] = useState<string>(order?.payment?.method ?? "cash");
  const [transactionId, setTransactionId] = useState(order?.payment?.transactionId ?? "");
  const [orderStatus, setOrderStatus] = useState<string>(order?.status ?? "confirmed");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    mapPaymentStatus(order?.payment?.status)
  );
  const [adminNote, setAdminNote] = useState(order?.adminNote ?? "");
  const [customerNote, setCustomerNote] = useState(order?.customerNote ?? "");

  // ── Pricing ──
  const [pricing, setPricing] = useState<PricingInfo>(() => {
    const base = defaultDraft("").pricing;
    return {
      ...base,
      mode: getPreset(config.preset)?.pricingMode ?? base.mode,
      shippingCharges: order?.shippingCost ?? 0,
      taxMode: (order?.taxAmount ?? 0) > 0 ? "cgst_sgst" : base.taxMode,
    };
  });
  const setPricingPatch = (patch: Partial<PricingInfo>) => setPricing((p) => ({ ...p, ...patch }));

  // ── Derived invoice draft + totals (single source of truth) ──
  const draft = useMemo<InvoiceDraft>(() => {
    const base = defaultDraft(invoiceNumber);
    const business = { ...base.business, ...(loadBusiness() || {}) };
    const billing = [addressLine1, [city, state, postalCode].filter(Boolean).join(", ")]
      .filter(Boolean)
      .join("\n");
    return {
      business,
      meta: {
        ...base.meta,
        invoiceNumber,
        type: invoiceType,
        currency,
        paymentStatus,
        orderNumber: order?.orderNumber ?? "",
        internalNotes: adminNote,
      },
      customer: {
        ...base.customer,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        billingAddress: billing,
        country,
        sameAsBilling: true,
      },
      items,
      pricing,
      payment: {
        ...base.payment,
        method: mapPaymentMethod(paymentMethod),
        transactionId,
      },
      shipping: base.shipping,
      certification: base.certification,
      footer: base.footer,
    };
  }, [
    invoiceNumber, invoiceType, currency, paymentStatus, adminNote, firstName, lastName,
    email, phone, addressLine1, city, state, postalCode, country, items, pricing,
    paymentMethod, transactionId, order?.orderNumber,
  ]);

  const totals = useMemo(() => computeTotals(draft), [draft]);
  const money = (v: number) => formatMoney(v, currency);

  // ── Category / preset ──
  const applyCategory = (key: PresetKey) => {
    const preset = getPreset(key);
    if (!preset) {
      setConfig((c) => ({ ...c, preset: "custom" }));
      return;
    }
    const next = preset.apply(config);
    setConfig(next);
    saveConfig(next);
    if (preset.pricingMode) setPricingPatch({ mode: preset.pricingMode });
    if (key === "international") {
      setCurrency("USD");
      setPricingPatch({ taxMode: "none" });
    }
  };

  // ── Item handlers ──
  const updateItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);
  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (id: string) =>
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev));

  const regenerateNumber = () => setInvoiceNumber(peekInvoiceNumber(invoiceType));

  // ── Build the order payload ──
  const buildBody = (): CreateOrderBody | null => {
    const validItems = items.filter((it) => it.name.trim() && itemTotal(it, pricing.mode) > 0);
    if (!validItems.length) {
      toast.error("Add at least one item with a name and price");
      return null;
    }
    if (!firstName.trim() && !phone.trim()) {
      toast.error("Provide at least a customer name or phone number");
      return null;
    }
    const taxRate = totals.taxableAmount > 0 ? totals.taxTotal / totals.taxableAmount : 0;
    return {
      items: validItems.map((it) => toApiItem(it, pricing.mode)),
      shippingAddress: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        addressLine1: addressLine1.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      paymentMethod,
      transactionId: transactionId.trim() || undefined,
      subtotal: totals.subtotal,
      shippingCost: totals.shipping + totals.insurance,
      taxAmount: totals.taxTotal,
      taxRate,
      couponDiscount: totals.discount,
      giftCardAmount: 0,
      totalAmount: totals.grandTotal,
      customerNote: customerNote.trim() || undefined,
      status: orderStatus,
      paymentStatus: mapApiPaymentStatus(paymentStatus),
      adminNote: adminNote.trim() || undefined,
      invoiceNumber: invoiceNumber.trim() || undefined,
      invoiceType,
      currency,
      // Immutable snapshot so the invoice re-prints identically later.
      invoiceData: { draft, config, totals, generatedAt: new Date().toISOString() },
    };
  };

  // ── Submit ──
  const handleSubmit = async (thenPrint: boolean) => {
    const body = buildBody();
    if (!body) return;
    try {
      if (isEdit && order) {
        const result = await updateOrder({ id: order._id, ...body }).unwrap();
        toast.success(`Order ${result.order.orderNumber} updated!`);
      } else {
        const result = await createOrder(body).unwrap();
        commitInvoiceNumber();
        toast.success(`Order ${result.order.orderNumber} created!`);
      }
      if (thenPrint) {
        const printed = printInvoiceDoc(
          { ...draft, meta: { ...draft.meta } },
          config
        );
        if (!printed) toast.error("Pop-up blocked — allow pop-ups to print the invoice");
      }
      if (!isEdit) resetForm();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || `Failed to ${isEdit ? "update" : "create"} order`);
    }
  };

  // Print the invoice without saving (preview the bill from current entry).
  const handlePrintOnly = () => {
    if (!items.some((it) => it.name.trim())) {
      toast.error("Add at least one item before generating the invoice");
      return;
    }
    const printed = printInvoiceDoc(draft, config);
    if (!printed) toast.error("Pop-up blocked — allow pop-ups to generate the invoice");
  };

  const resetForm = () => {
    setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setAddressLine1(""); setCity(""); setState(""); setPostalCode(""); setCountry("India");
    setCityOptions(MAJOR_CITIES); setPinLoading(false); lastPinRef.current = "";
    setItems([emptyItem()]);
    setPaymentMethod("cash"); setTransactionId("");
    setOrderStatus("confirmed"); setPaymentStatus("pending");
    setAdminNote(""); setCustomerNote("");
    setInvoiceNumber(peekInvoiceNumber(invoiceType));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? `Edit Order ${order?.orderNumber ?? ""}` : "Create Walk-in Order"}
      size="max-w-3xl"
    >
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
              <PhoneInput value={phone} onChange={setPhone} />
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
                  <Loader2 size={14} className="animate-spin text-gold absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
            <div>
              <label className={labelCx}>City</label>
              <input className={inputCx} value={city} onChange={(e) => setCity(e.target.value)} list="order-city-options" placeholder="Select or type city" />
              <datalist id="order-city-options">
                {cityOptions.map((c) => (<option key={c} value={c} />))}
              </datalist>
            </div>
            <div>
              <label className={labelCx}>State</label>
              <select className={selectCx} value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select state</option>
                {(state && !INDIAN_STATES.includes(state) ? [state, ...INDIAN_STATES] : INDIAN_STATES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Country</label>
              <select className={selectCx} value={country} onChange={(e) => setCountry(e.target.value)}>
                {(country && !COUNTRIES.includes(country) ? [country, ...COUNTRIES] : COUNTRIES).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── Category + Items ── */}
        <section>
          <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Items</h3>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Category</label>
              <select
                className={selectCx + " w-auto"}
                value={PRESETS.some((p) => p.key === config.preset) ? config.preset : "custom"}
                onChange={(e) => applyCategory(e.target.value as PresetKey)}
              >
                {PRESETS.map((p) => (<option key={p.key} value={p.key}>{p.label}</option>))}
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground -mt-1 mb-3">
            Category chooses which fields show here. Manage the exact fields, logo & format in
            Invoice Builder.
          </p>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <LineItemFields
                key={item.id}
                item={item}
                index={idx}
                mode={pricing.mode}
                f={f}
                money={money}
                canRemove={items.length > 1}
                onChange={(patch) => updateItem(item.id, patch)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
          >
            <Plus size={14} /> Add Item
          </button>
        </section>

        {/* ── Invoice meta ── */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-gold" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Invoice</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectInput
              label="Type"
              value={invoiceType}
              onChange={(v) => { setInvoiceType(v); setInvoiceNumber(peekInvoiceNumber(v)); }}
              options={[
                { value: "quotation", label: "Quotation" },
                { value: "proforma", label: "Proforma Invoice" },
                { value: "tax_invoice", label: "Final Tax Invoice" },
              ]}
            />
            <SelectInput
              label="Currency"
              value={currency}
              onChange={(v) => setCurrency(v)}
              options={[
                { value: "INR", label: "INR (₹)" },
                { value: "USD", label: "USD ($)" },
              ]}
            />
            <div>
              <label className={labelCx}>Invoice Number</label>
              <div className="flex gap-2">
                <input className={inputCx} value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                <button type="button" onClick={regenerateNumber} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:border-gold transition-colors whitespace-nowrap">Auto</button>
              </div>
            </div>
            {invoiceType === "tax_invoice" && (
              <SelectInput
                label="Payment Status"
                value={paymentStatus}
                onChange={(v) => setPaymentStatus(v)}
                options={[
                  { value: "pending", label: "Pending" },
                  { value: "processing", label: "Processing" },
                  { value: "partial", label: "Partially Paid" },
                  { value: "paid", label: "Paid" },
                ]}
              />
            )}
          </div>
        </section>

        {/* ── Pricing & Tax ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calculator size={16} className="text-gold" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Pricing & Tax</h3>
            </div>
            <SelectInput
              label=""
              className="w-40"
              value={pricing.mode}
              onChange={(v) => setPricingPatch({ mode: v })}
              options={[
                { value: "simple", label: "Simple Pricing" },
                { value: "detailed", label: "Detailed Pricing" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                label="Discount"
                value={pricing.discountType}
                onChange={(v) => setPricingPatch({ discountType: v })}
                options={[{ value: "amount", label: "Amount" }, { value: "percent", label: "Percent %" }]}
              />
              <NumberInput label="Value" value={pricing.discountValue} onChange={(v) => setPricingPatch({ discountValue: v ?? 0 })} />
            </div>
            <NumberInput label="Shipping Charges" value={pricing.shippingCharges} onChange={(v) => setPricingPatch({ shippingCharges: v ?? 0 })} />
            <NumberInput label="Insurance Charges" value={pricing.insuranceCharges} onChange={(v) => setPricingPatch({ insuranceCharges: v ?? 0 })} />
            <NumberInput label="Advance / Amount Paid" value={pricing.advancePaid} onChange={(v) => setPricingPatch({ advancePaid: v ?? 0 })} />
            <SelectInput
              label="Tax Treatment"
              value={pricing.taxMode}
              onChange={(v) => setPricingPatch({ taxMode: v })}
              options={[
                { value: "none", label: "No Tax" },
                { value: "cgst_sgst", label: "CGST + SGST (intra-state)" },
                { value: "igst", label: "IGST (inter-state)" },
              ]}
            />
            {pricing.taxMode !== "none" && pricing.mode === "simple" && (
              <NumberInput label="GST Rate %" value={pricing.simpleGstRate} onChange={(v) => setPricingPatch({ simpleGstRate: v ?? 0 })} />
            )}
            {pricing.taxMode !== "none" && pricing.mode === "detailed" && (
              <div className="grid grid-cols-2 gap-2">
                <NumberInput label="GST Goods %" value={pricing.gstGoodsRate} onChange={(v) => setPricingPatch({ gstGoodsRate: v ?? 0 })} />
                <NumberInput label="GST Making %" value={pricing.gstMakingRate} onChange={(v) => setPricingPatch({ gstMakingRate: v ?? 0 })} />
              </div>
            )}
          </div>
          <div className="mt-3">
            <Toggle label="Show grand total in words on invoice" checked={pricing.showAmountInWords} onChange={(v) => setPricingPatch({ showAmountInWords: v })} />
          </div>
        </section>

        {/* ── Payment & Status ── */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Payment & Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCx}>Payment Method</label>
              <select className={selectCx} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                {PAYMENT_METHODS.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCx}>Transaction / Reference ID</label>
              <input className={inputCx} value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCx}>Order Status</label>
              <select className={selectCx} value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                {ORDER_STATUSES.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
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
            <SummaryRow label="Subtotal" value={inrOr(money, totals.subtotal)} />
            {totals.discount > 0 && <SummaryRow label="Discount" value={`−${inrOr(money, totals.discount)}`} />}
            {pricing.taxMode === "cgst_sgst" && totals.taxTotal > 0 && (
              <>
                <SummaryRow label="CGST" value={inrOr(money, totals.cgst)} />
                <SummaryRow label="SGST" value={inrOr(money, totals.sgst)} />
              </>
            )}
            {totals.igst > 0 && <SummaryRow label="IGST" value={inrOr(money, totals.igst)} />}
            {totals.shipping > 0 && <SummaryRow label="Shipping" value={inrOr(money, totals.shipping)} />}
            {totals.insurance > 0 && <SummaryRow label="Insurance" value={inrOr(money, totals.insurance)} />}
            <div className="flex justify-between w-60 border-t border-gold pt-2 mt-1">
              <span className="font-bold">Grand Total</span>
              <span className="font-heading text-lg text-gold font-bold">{inrOr(money, totals.grandTotal)}</span>
            </div>
            {totals.advancePaid > 0 && <SummaryRow label="Balance Due" value={inrOr(money, totals.balanceDue)} />}
          </div>
        </section>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-border mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handlePrintOnly}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:border-gold transition-colors"
        >
          <Printer size={15} /> Preview Invoice
        </button>
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-gold text-onyx rounded-lg hover:bg-gold/90 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
          {isEdit ? "Save & Print" : "Create & Generate Invoice"}
        </button>
      </div>
    </Modal>
  );
}

// ── Small helpers ──
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between w-60">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// Use the invoice's currency formatter (keeps ₹ / $ consistent with the bill).
function inrOr(money: (v: number) => string, value: number): string {
  return money(value);
}

// Order payment status (API) → invoice payment status (builder) and back.
function mapPaymentStatus(apiStatus?: string): PaymentStatus {
  switch (apiStatus) {
    case "completed": return "paid";
    case "processing": return "processing";
    case "pending": return "pending";
    default: return "pending";
  }
}
function mapApiPaymentStatus(s: PaymentStatus): string {
  switch (s) {
    case "paid": return "completed";
    case "processing": return "processing";
    case "partial": return "pending";
    case "pending": return "pending";
    default: return "pending";
  }
}
function mapPaymentMethod(m: string): PaymentMethod | "" {
  if (m === "upi" || m === "card" || m === "cash") return m;
  if (m === "bank_transfer") return "bank_transfer";
  return "other";
}
