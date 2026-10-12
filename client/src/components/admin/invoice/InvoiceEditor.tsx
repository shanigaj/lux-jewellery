"use client";

import {
  Building2,
  FileText,
  User,
  Package,
  Calculator,
  CreditCard,
  Truck,
  BadgeCheck,
  StickyNote,
  Plus,
} from "lucide-react";
import type {
  InvoiceDraft,
  InvoiceConfig,
  LineItem,
  BusinessInfo,
  InvoiceMeta,
  CustomerInfo,
  PricingInfo,
  PaymentInfo,
  ShippingInfo,
  CertificationInfo,
  FooterInfo,
} from "@/lib/invoice-builder/types";
import { emptyItem } from "@/lib/invoice-builder/config";
import { formatMoney, computeTotals } from "@/lib/invoice-builder/calc";
import {
  SectionCard,
  TextInput,
  NumberInput,
  SelectInput,
  TextArea,
  Toggle,
  Field,
  inputCx,
} from "./ui";
import { LineItemFields } from "./LineItemFields";

interface Props {
  draft: InvoiceDraft;
  config: InvoiceConfig;
  onChange: (next: InvoiceDraft) => void;
  onConfig: (next: InvoiceConfig) => void;
  onRegenerateNumber: () => void;
}

export function InvoiceEditor({ draft, config, onChange, onConfig, onRegenerateNumber }: Props) {
  const money = (v: number) => formatMoney(v, draft.meta.currency);
  const f = (key: string) => config.fields[key] !== false;
  const totals = computeTotals(draft);

  // ── Group updaters (immutable) ──
  const setBusiness = (patch: Partial<BusinessInfo>) =>
    onChange({ ...draft, business: { ...draft.business, ...patch } });
  const setMeta = (patch: Partial<InvoiceMeta>) =>
    onChange({ ...draft, meta: { ...draft.meta, ...patch } });
  const setCustomer = (patch: Partial<CustomerInfo>) =>
    onChange({ ...draft, customer: { ...draft.customer, ...patch } });
  const setPricing = (patch: Partial<PricingInfo>) =>
    onChange({ ...draft, pricing: { ...draft.pricing, ...patch } });
  const setPayment = (patch: Partial<PaymentInfo>) =>
    onChange({ ...draft, payment: { ...draft.payment, ...patch } });
  const setShipping = (patch: Partial<ShippingInfo>) =>
    onChange({ ...draft, shipping: { ...draft.shipping, ...patch } });
  const setCertification = (patch: Partial<CertificationInfo>) =>
    onChange({ ...draft, certification: { ...draft.certification, ...patch } });
  const setFooter = (patch: Partial<FooterInfo>) =>
    onChange({ ...draft, footer: { ...draft.footer, ...patch } });

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    onChange({
      ...draft,
      items: draft.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  const addItem = () => onChange({ ...draft, items: [...draft.items, emptyItem()] });
  const removeItem = (id: string) =>
    onChange({
      ...draft,
      items: draft.items.length > 1 ? draft.items.filter((it) => it.id !== id) : draft.items,
    });

  return (
    <div className="space-y-4">
      {/* ── Business ── */}
      <SectionCard title="Business" icon={<Building2 size={16} className="text-gold" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Brand Name" value={draft.business.name} onChange={(v) => setBusiness({ name: v })} />
          {f("business.phone") && (
            <TextInput label="Phone / WhatsApp" value={draft.business.phone} onChange={(v) => setBusiness({ phone: v })} />
          )}
          {f("business.email") && (
            <TextInput label="Email" value={draft.business.email} onChange={(v) => setBusiness({ email: v })} />
          )}
          {f("business.website") && (
            <TextInput label="Website" value={draft.business.website} onChange={(v) => setBusiness({ website: v })} />
          )}
          {f("business.address") && (
            <TextArea label="Address" className="sm:col-span-2" value={draft.business.address} onChange={(v) => setBusiness({ address: v })} />
          )}
          {f("business.gstin") && (
            <TextInput label="GSTIN" value={draft.business.gstin} onChange={(v) => setBusiness({ gstin: v })} placeholder="Leave blank if none" />
          )}
          {f("business.state") && (
            <div className="grid grid-cols-2 gap-2">
              <TextInput label="State" value={draft.business.state} onChange={(v) => setBusiness({ state: v })} />
              <TextInput label="Code" value={draft.business.stateCode} onChange={(v) => setBusiness({ stateCode: v })} />
            </div>
          )}
          {f("business.extraRegistration") && (
            <TextInput label="Other Registration" className="sm:col-span-2" value={draft.business.extraRegistration} onChange={(v) => setBusiness({ extraRegistration: v })} placeholder="e.g. BIS licence no." />
          )}
        </div>
      </SectionCard>

      {/* ── Invoice meta ── */}
      <SectionCard title="Invoice" icon={<FileText size={16} className="text-gold" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectInput
            label="Type"
            value={draft.meta.type}
            onChange={(v) => setMeta({ type: v })}
            options={[
              { value: "quotation", label: "Quotation" },
              { value: "proforma", label: "Proforma Invoice" },
              { value: "tax_invoice", label: "Final Tax Invoice" },
            ]}
          />
          <SelectInput
            label="Currency"
            value={draft.meta.currency}
            onChange={(v) => setMeta({ currency: v })}
            options={[
              { value: "INR", label: "INR (₹)" },
              { value: "USD", label: "USD ($)" },
            ]}
          />
          <Field label="Invoice Number">
            <div className="flex gap-2">
              <input className={inputCx} value={draft.meta.invoiceNumber} onChange={(e) => setMeta({ invoiceNumber: e.target.value })} />
              <button
                type="button"
                onClick={onRegenerateNumber}
                className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:border-gold transition-colors whitespace-nowrap"
                title="Generate a fresh number"
              >
                Auto
              </button>
            </div>
          </Field>
          <TextInput label="Invoice Date" type="date" value={draft.meta.invoiceDate} onChange={(v) => setMeta({ invoiceDate: v })} />
          {f("invoice.dueDate") && (
            <TextInput label="Due Date" type="date" value={draft.meta.dueDate} onChange={(v) => setMeta({ dueDate: v })} />
          )}
          {f("invoice.orderNumber") && (
            <TextInput label="Order Number" value={draft.meta.orderNumber} onChange={(v) => setMeta({ orderNumber: v })} />
          )}
          {f("invoice.poReference") && (
            <TextInput label="PO Reference" value={draft.meta.poReference} onChange={(v) => setMeta({ poReference: v })} />
          )}
          {f("invoice.salesRep") && (
            <TextInput label="Sales Representative" value={draft.meta.salesRep} onChange={(v) => setMeta({ salesRep: v })} />
          )}
          {draft.meta.type === "tax_invoice" && f("invoice.paymentStatus") && (
            <SelectInput
              label="Payment Status"
              value={draft.meta.paymentStatus}
              onChange={(v) => setMeta({ paymentStatus: v })}
              options={[
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "partial", label: "Partially Paid" },
                { value: "paid", label: "Paid" },
              ]}
            />
          )}
        </div>
        {f("invoice.internalNotes") && (
          <div className="mt-3">
            <TextArea label="Internal Notes" value={draft.meta.internalNotes} onChange={(v) => setMeta({ internalNotes: v })} placeholder="Private — not shown on the bill unless enabled below" />
            <div className="mt-1">
              <Toggle
                label="Show internal notes on the printed invoice"
                checked={config.showInternalNotes}
                onChange={(v) => onConfig({ ...config, showInternalNotes: v })}
              />
            </div>
          </div>
        )}
      </SectionCard>

      {/* ── Customer ── */}
      <SectionCard title="Customer" icon={<User size={16} className="text-gold" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput label="Name" value={draft.customer.name} onChange={(v) => setCustomer({ name: v })} />
          {f("customer.company") && (
            <TextInput label="Company" value={draft.customer.company} onChange={(v) => setCustomer({ company: v })} />
          )}
          {f("customer.phone") && (
            <TextInput label="Phone" value={draft.customer.phone} onChange={(v) => setCustomer({ phone: v })} />
          )}
          {f("customer.email") && (
            <TextInput label="Email" value={draft.customer.email} onChange={(v) => setCustomer({ email: v })} />
          )}
          {f("customer.country") && (
            <TextInput label="Country" value={draft.customer.country} onChange={(v) => setCustomer({ country: v })} />
          )}
          {f("customer.gstin") && (
            <TextInput label="Customer GSTIN" value={draft.customer.gstin} onChange={(v) => setCustomer({ gstin: v })} />
          )}
          {f("customer.referenceNumber") && (
            <TextInput label="Reference Number" value={draft.customer.referenceNumber} onChange={(v) => setCustomer({ referenceNumber: v })} />
          )}
          {f("customer.billingAddress") && (
            <TextArea label="Billing Address" className="sm:col-span-2" value={draft.customer.billingAddress} onChange={(v) => setCustomer({ billingAddress: v })} />
          )}
          {f("customer.shippingAddress") && (
            <div className="sm:col-span-2">
              <Toggle
                label="Shipping address same as billing"
                checked={draft.customer.sameAsBilling}
                onChange={(v) => setCustomer({ sameAsBilling: v })}
              />
              {!draft.customer.sameAsBilling && (
                <TextArea label="Shipping Address" value={draft.customer.shippingAddress} onChange={(v) => setCustomer({ shippingAddress: v })} />
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Products ── */}
      <SectionCard
        title="Products"
        icon={<Package size={16} className="text-gold" />}
        right={
          <SelectInput
            label=""
            className="w-40"
            value={draft.pricing.mode}
            onChange={(v) => setPricing({ mode: v })}
            options={[
              { value: "simple", label: "Simple Pricing" },
              { value: "detailed", label: "Detailed Pricing" },
            ]}
          />
        }
      >
        <div className="space-y-4">
          {draft.items.map((item, idx) => (
            <LineItemFields
              key={item.id}
              item={item}
              index={idx}
              mode={draft.pricing.mode}
              f={f}
              money={money}
              canRemove={draft.items.length > 1}
              onChange={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
      </SectionCard>

      {/* ── Pricing ── */}
      <SectionCard title="Pricing & Tax" icon={<Calculator size={16} className="text-gold" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {f("pricing.discount") && (
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                label="Discount"
                value={draft.pricing.discountType}
                onChange={(v) => setPricing({ discountType: v })}
                options={[
                  { value: "amount", label: "Amount" },
                  { value: "percent", label: "Percent %" },
                ]}
              />
              <NumberInput
                label="Value"
                value={draft.pricing.discountValue}
                onChange={(v) => setPricing({ discountValue: v ?? 0 })}
              />
            </div>
          )}
          {f("pricing.shipping") && (
            <NumberInput label="Shipping Charges" value={draft.pricing.shippingCharges} onChange={(v) => setPricing({ shippingCharges: v ?? 0 })} />
          )}
          {f("pricing.insurance") && (
            <NumberInput label="Insurance Charges" value={draft.pricing.insuranceCharges} onChange={(v) => setPricing({ insuranceCharges: v ?? 0 })} />
          )}
          {f("pricing.advance") && (
            <NumberInput label="Advance / Amount Paid" value={draft.pricing.advancePaid} onChange={(v) => setPricing({ advancePaid: v ?? 0 })} />
          )}
        </div>

        {f("pricing.tax") && (
          <div className="mt-3 border-t border-border pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SelectInput
                label="Tax Treatment"
                value={draft.pricing.taxMode}
                onChange={(v) => setPricing({ taxMode: v })}
                options={[
                  { value: "none", label: "No Tax" },
                  { value: "cgst_sgst", label: "CGST + SGST (intra-state)" },
                  { value: "igst", label: "IGST (inter-state)" },
                ]}
              />
              {draft.pricing.taxMode !== "none" && draft.pricing.mode === "simple" && (
                <NumberInput label="GST Rate %" value={draft.pricing.simpleGstRate} onChange={(v) => setPricing({ simpleGstRate: v ?? 0 })} />
              )}
              {draft.pricing.taxMode !== "none" && draft.pricing.mode === "detailed" && (
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput label="GST on Goods %" value={draft.pricing.gstGoodsRate} onChange={(v) => setPricing({ gstGoodsRate: v ?? 0 })} />
                  <NumberInput label="GST on Making %" value={draft.pricing.gstMakingRate} onChange={(v) => setPricing({ gstMakingRate: v ?? 0 })} />
                </div>
              )}
            </div>
          </div>
        )}

        {f("pricing.amountInWords") && (
          <div className="mt-3">
            <Toggle
              label="Show grand total in words"
              checked={draft.pricing.showAmountInWords}
              onChange={(v) => setPricing({ showAmountInWords: v })}
            />
          </div>
        )}

        {/* Live totals mirror */}
        <div className="mt-4 border-t border-border pt-3 flex flex-col items-end gap-1 text-sm">
          <Row label="Subtotal" value={money(totals.subtotal)} />
          {totals.discount > 0 && <Row label="Discount" value={`−${money(totals.discount)}`} />}
          {totals.taxTotal > 0 && draft.pricing.taxMode === "cgst_sgst" && (
            <>
              <Row label="CGST" value={money(totals.cgst)} />
              <Row label="SGST" value={money(totals.sgst)} />
            </>
          )}
          {totals.igst > 0 && <Row label="IGST" value={money(totals.igst)} />}
          {totals.shipping > 0 && <Row label="Shipping" value={money(totals.shipping)} />}
          {totals.insurance > 0 && <Row label="Insurance" value={money(totals.insurance)} />}
          <div className="flex justify-between w-64 border-t border-gold pt-2 mt-1">
            <span className="font-bold">Grand Total</span>
            <span className="font-heading text-lg text-gold font-bold">{money(totals.grandTotal)}</span>
          </div>
          {totals.advancePaid > 0 && <Row label="Balance Due" value={money(totals.balanceDue)} />}
        </div>
      </SectionCard>

      {/* ── Payment ── */}
      {config.sections.payment && (
        <SectionCard title="Payment" icon={<CreditCard size={16} className="text-gold" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {f("payment.method") && (
              <SelectInput
                label="Payment Method"
                value={draft.payment.method || ""}
                onChange={(v) => setPayment({ method: v as PaymentInfo["method"] })}
                options={[
                  { value: "", label: "—" },
                  { value: "upi", label: "UPI" },
                  { value: "bank_transfer", label: "Bank Transfer" },
                  { value: "card", label: "Card" },
                  { value: "cash", label: "Cash" },
                  { value: "other", label: "Other" },
                ]}
              />
            )}
            {f("payment.transactionId") && (
              <TextInput label="Transaction / Reference" value={draft.payment.transactionId} onChange={(v) => setPayment({ transactionId: v })} />
            )}
            {f("payment.paymentDate") && (
              <TextInput label="Payment Date" type="date" value={draft.payment.paymentDate} onChange={(v) => setPayment({ paymentDate: v })} />
            )}
            {f("payment.paymentTerms") && (
              <TextInput label="Payment Terms" value={draft.payment.paymentTerms} onChange={(v) => setPayment({ paymentTerms: v })} placeholder="e.g. 50% advance" />
            )}
            {f("payment.upiId") && (
              <TextInput label="UPI ID" value={draft.payment.upiId} onChange={(v) => setPayment({ upiId: v })} />
            )}
            {f("payment.paymentLink") && (
              <TextInput label="Payment Link" value={draft.payment.paymentLink} onChange={(v) => setPayment({ paymentLink: v })} />
            )}
          </div>
          {f("payment.bank") && (
            <div className="mt-3 border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput label="Bank Name" value={draft.payment.bankName} onChange={(v) => setPayment({ bankName: v })} />
              <TextInput label="Account Name" value={draft.payment.accountName} onChange={(v) => setPayment({ accountName: v })} />
              <TextInput label="Account Number" value={draft.payment.accountNumber} onChange={(v) => setPayment({ accountNumber: v })} />
              <TextInput label="IFSC" value={draft.payment.ifsc} onChange={(v) => setPayment({ ifsc: v })} />
            </div>
          )}
        </SectionCard>
      )}

      {/* ── Shipping ── */}
      {config.sections.shipping && (
        <SectionCard title="Shipping" icon={<Truck size={16} className="text-gold" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {f("shipping.method") && (
              <TextInput label="Shipping Method" value={draft.shipping.method} onChange={(v) => setShipping({ method: v })} />
            )}
            {f("shipping.courier") && (
              <TextInput label="Courier Name" value={draft.shipping.courier} onChange={(v) => setShipping({ courier: v })} />
            )}
            {f("shipping.trackingNumber") && (
              <TextInput label="Tracking Number" value={draft.shipping.trackingNumber} onChange={(v) => setShipping({ trackingNumber: v })} />
            )}
            {f("shipping.shippingDate") && (
              <TextInput label="Shipping Date" type="date" value={draft.shipping.shippingDate} onChange={(v) => setShipping({ shippingDate: v })} />
            )}
            {f("shipping.estimatedDelivery") && (
              <TextInput label="Estimated Delivery" type="date" value={draft.shipping.estimatedDelivery} onChange={(v) => setShipping({ estimatedDelivery: v })} />
            )}
            {f("shipping.deliveryAddress") && (
              <TextArea label="Delivery Address" className="sm:col-span-2" value={draft.shipping.deliveryAddress} onChange={(v) => setShipping({ deliveryAddress: v })} />
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Certification ── */}
      {config.sections.certification && (
        <SectionCard title="Certification & Authenticity" icon={<BadgeCheck size={16} className="text-gold" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {f("certification.hallmark") && (
              <TextInput label="Hallmark" value={draft.certification.hallmark} onChange={(v) => setCertification({ hallmark: v })} />
            )}
            {f("certification.huid") && (
              <TextInput label="HUID" value={draft.certification.huid} onChange={(v) => setCertification({ huid: v })} />
            )}
            {f("certification.diamondCertNumber") && (
              <TextInput label="Diamond Certificate No." value={draft.certification.diamondCertNumber} onChange={(v) => setCertification({ diamondCertNumber: v })} />
            )}
            {f("certification.certAuthority") && (
              <TextInput label="Certifying Authority" value={draft.certification.certAuthority} onChange={(v) => setCertification({ certAuthority: v })} placeholder="e.g. IGI, GIA, BIS" />
            )}
            {f("certification.certLink") && (
              <TextInput label="Certificate Link" value={draft.certification.certLink} onChange={(v) => setCertification({ certLink: v })} />
            )}
            {f("certification.warranty") && (
              <TextInput label="Warranty" value={draft.certification.warranty} onChange={(v) => setCertification({ warranty: v })} />
            )}
            {f("certification.returnPolicy") && (
              <TextArea label="Return / Exchange Policy" className="sm:col-span-2" value={draft.certification.returnPolicy} onChange={(v) => setCertification({ returnPolicy: v })} />
            )}
            {f("certification.careInstructions") && (
              <TextArea label="Care Instructions" className="sm:col-span-2" value={draft.certification.careInstructions} onChange={(v) => setCertification({ careInstructions: v })} />
            )}
          </div>
        </SectionCard>
      )}

      {/* ── Footer ── */}
      {config.sections.footer && (
        <SectionCard title="Footer" icon={<StickyNote size={16} className="text-gold" />}>
          <div className="grid grid-cols-1 gap-3">
            {f("footer.thankYouMessage") && (
              <TextInput label="Thank You Message" value={draft.footer.thankYouMessage} onChange={(v) => setFooter({ thankYouMessage: v })} />
            )}
            {f("footer.terms") && (
              <TextArea label="Terms & Conditions" value={draft.footer.terms} onChange={(v) => setFooter({ terms: v })} />
            )}
            {f("footer.returnPolicy") && (
              <TextArea label="Return / Exchange Policy" value={draft.footer.returnPolicy} onChange={(v) => setFooter({ returnPolicy: v })} />
            )}
            {f("footer.warrantyTerms") && (
              <TextArea label="Warranty Terms" value={draft.footer.warrantyTerms} onChange={(v) => setFooter({ warrantyTerms: v })} />
            )}
            {f("footer.supportDetails") && (
              <TextInput label="Customer Support" value={draft.footer.supportDetails} onChange={(v) => setFooter({ supportDetails: v })} />
            )}
          </div>
          <div className="mt-3 border-t border-border pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {f("footer.signature") && (
              <div>
                <Toggle label="Show signature" checked={draft.footer.showSignature} onChange={(v) => setFooter({ showSignature: v })} />
                {draft.footer.showSignature && (
                  <TextInput label="Signatory Label" value={draft.footer.signatureName} onChange={(v) => setFooter({ signatureName: v })} />
                )}
              </div>
            )}
            {f("footer.stamp") && (
              <Toggle label="Show stamp placeholder" checked={draft.footer.showStamp} onChange={(v) => setFooter({ showStamp: v })} />
            )}
            {f("footer.qrUrl") && (
              <TextInput label="QR Code Image URL" className="sm:col-span-2" value={draft.footer.qrUrl} onChange={(v) => setFooter({ qrUrl: v })} placeholder="Link or payment QR image URL" />
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between w-64">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
