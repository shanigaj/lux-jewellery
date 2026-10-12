// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Invoice Builder: defaults, field catalog, presets
// ═══════════════════════════════════════════════════════════

import { siteConfig } from "@/config/site";
import type {
  InvoiceDraft,
  InvoiceConfig,
  LineItem,
  PresetKey,
  SectionKey,
} from "./types";

// Stable-ish id for a line item (client-only; good enough for a draft row key).
export function newId(): string {
  return `li_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function emptyItem(): LineItem {
  return {
    id: newId(),
    name: "",
    sku: "",
    description: "",
    imageUrl: "",
    category: "",
    metalType: "",
    metalPurity: "",
    grossWeight: null,
    netWeight: null,
    metalRate: null,
    metalValueOverride: null,
    stoneType: "",
    stoneWeight: null,
    stoneColor: "",
    stoneClarity: "",
    stoneCut: "",
    stoneQuality: "",
    stoneValue: null,
    ringSize: "",
    length: "",
    quantity: 1,
    unitPrice: null,
    makingCharges: null,
    wastageCharges: null,
    otherCharges: null,
    discount: null,
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// A fresh draft. Business block is pre-filled from siteConfig (real data only —
// GSTIN/state left blank so nothing fake is ever printed).
export function defaultDraft(invoiceNumber: string): InvoiceDraft {
  return {
    business: {
      name: siteConfig.name,
      logoUrl: "/images/logo-sparenza-v3.png",
      address: siteConfig.contact.address,
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      website: "sparenza.com",
      gstin: "",
      state: "Gujarat",
      stateCode: "24",
      extraRegistration: "",
    },
    meta: {
      invoiceNumber,
      invoiceDate: todayISO(),
      dueDate: "",
      orderNumber: "",
      type: "tax_invoice",
      currency: "INR",
      paymentStatus: "pending",
      poReference: "",
      salesRep: "",
      internalNotes: "",
    },
    customer: {
      name: "",
      company: "",
      email: "",
      phone: "",
      billingAddress: "",
      shippingAddress: "",
      sameAsBilling: true,
      country: "India",
      gstin: "",
      referenceNumber: "",
    },
    items: [emptyItem()],
    pricing: {
      mode: "detailed",
      discountType: "amount",
      discountValue: 0,
      shippingCharges: 0,
      insuranceCharges: 0,
      taxMode: "cgst_sgst",
      gstGoodsRate: 3,
      gstMakingRate: 5,
      simpleGstRate: 3,
      advancePaid: 0,
      showAmountInWords: true,
    },
    payment: {
      method: "",
      transactionId: "",
      paymentDate: "",
      paymentTerms: "",
      bankName: "",
      accountName: "",
      accountNumber: "",
      ifsc: "",
      upiId: "",
      paymentLink: "",
    },
    shipping: {
      method: "",
      courier: "",
      trackingNumber: "",
      shippingDate: "",
      estimatedDelivery: "",
      deliveryAddress: "",
    },
    certification: {
      hallmark: "",
      huid: "",
      diamondCertNumber: "",
      certAuthority: "",
      certLink: "",
      warranty: "",
      returnPolicy: "",
      careInstructions: "",
    },
    footer: {
      terms: "",
      returnPolicy: "",
      warrantyTerms: "",
      supportDetails: "",
      thankYouMessage: "Thank you for choosing Sparenza & Co.",
      signatureName: "For Sparenza & Co.",
      showSignature: true,
      showStamp: false,
      qrUrl: "",
    },
  };
}

// ── Field catalog (drives the settings panel) ──
// Essential fields are always rendered and cannot be toggled off.
export interface FieldDef {
  key: string; // "<section>.<field>"
  label: string;
  essential?: boolean;
}

export interface SectionDef {
  key: SectionKey;
  label: string;
  // Optional sections can be switched off entirely; essential ones always show.
  optional?: boolean;
  fields: FieldDef[];
}

export const SECTION_CATALOG: SectionDef[] = [
  {
    key: "business",
    label: "Business",
    fields: [
      { key: "business.name", label: "Brand Name", essential: true },
      { key: "business.logoUrl", label: "Logo" },
      { key: "business.address", label: "Address" },
      { key: "business.email", label: "Email" },
      { key: "business.phone", label: "Phone / WhatsApp" },
      { key: "business.website", label: "Website" },
      { key: "business.gstin", label: "GSTIN" },
      { key: "business.state", label: "State & Code" },
      { key: "business.extraRegistration", label: "Other Registration" },
    ],
  },
  {
    key: "invoice",
    label: "Invoice",
    fields: [
      { key: "invoice.invoiceNumber", label: "Invoice Number", essential: true },
      { key: "invoice.invoiceDate", label: "Invoice Date", essential: true },
      { key: "invoice.type", label: "Invoice Type", essential: true },
      { key: "invoice.currency", label: "Currency", essential: true },
      { key: "invoice.paymentStatus", label: "Payment Status" },
      { key: "invoice.dueDate", label: "Due Date" },
      { key: "invoice.orderNumber", label: "Order Number" },
      { key: "invoice.poReference", label: "PO Reference" },
      { key: "invoice.salesRep", label: "Sales Representative" },
      { key: "invoice.internalNotes", label: "Internal Notes" },
    ],
  },
  {
    key: "customer",
    label: "Customer",
    fields: [
      { key: "customer.name", label: "Name", essential: true },
      { key: "customer.company", label: "Company" },
      { key: "customer.email", label: "Email" },
      { key: "customer.phone", label: "Phone" },
      { key: "customer.billingAddress", label: "Billing Address" },
      { key: "customer.shippingAddress", label: "Shipping Address" },
      { key: "customer.country", label: "Country" },
      { key: "customer.gstin", label: "Customer GSTIN" },
      { key: "customer.referenceNumber", label: "Reference Number" },
    ],
  },
  {
    key: "products",
    label: "Products",
    fields: [
      { key: "item.name", label: "Product Name", essential: true },
      { key: "item.quantity", label: "Quantity", essential: true },
      { key: "item.sku", label: "SKU / Code" },
      { key: "item.description", label: "Description" },
      { key: "item.image", label: "Image" },
      { key: "item.category", label: "Category" },
      { key: "item.metal", label: "Metal Type & Purity" },
      { key: "item.weight", label: "Gross / Net Weight" },
      { key: "item.metalRate", label: "Metal Rate & Value" },
      { key: "item.stone", label: "Stone Type & Weight" },
      { key: "item.stoneQuality", label: "Stone Quality (Color/Clarity/Cut)" },
      { key: "item.ringSize", label: "Ring Size" },
      { key: "item.length", label: "Chain / Bracelet Length" },
      { key: "item.makingCharges", label: "Making Charges" },
      { key: "item.wastageCharges", label: "Wastage Charges" },
      { key: "item.otherCharges", label: "Other Charges" },
      { key: "item.discount", label: "Item Discount" },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    fields: [
      { key: "pricing.discount", label: "Discount" },
      { key: "pricing.shipping", label: "Shipping Charges" },
      { key: "pricing.insurance", label: "Insurance Charges" },
      { key: "pricing.tax", label: "Taxes (GST)" },
      { key: "pricing.advance", label: "Advance / Amount Paid" },
      { key: "pricing.amountInWords", label: "Amount in Words" },
    ],
  },
  {
    key: "payment",
    label: "Payment",
    optional: true,
    fields: [
      { key: "payment.method", label: "Payment Method" },
      { key: "payment.transactionId", label: "Transaction / Reference" },
      { key: "payment.paymentDate", label: "Payment Date" },
      { key: "payment.paymentTerms", label: "Payment Terms" },
      { key: "payment.bank", label: "Bank Details" },
      { key: "payment.upiId", label: "UPI ID" },
      { key: "payment.paymentLink", label: "Payment Link" },
    ],
  },
  {
    key: "shipping",
    label: "Shipping",
    optional: true,
    fields: [
      { key: "shipping.method", label: "Shipping Method" },
      { key: "shipping.courier", label: "Courier Name" },
      { key: "shipping.trackingNumber", label: "Tracking Number" },
      { key: "shipping.shippingDate", label: "Shipping Date" },
      { key: "shipping.estimatedDelivery", label: "Estimated Delivery" },
      { key: "shipping.deliveryAddress", label: "Delivery Address" },
    ],
  },
  {
    key: "certification",
    label: "Certification",
    optional: true,
    fields: [
      { key: "certification.hallmark", label: "Hallmark" },
      { key: "certification.huid", label: "HUID" },
      { key: "certification.diamondCertNumber", label: "Diamond Certificate No." },
      { key: "certification.certAuthority", label: "Certifying Authority" },
      { key: "certification.certLink", label: "Certificate Link" },
      { key: "certification.warranty", label: "Warranty" },
      { key: "certification.returnPolicy", label: "Return / Exchange Policy" },
      { key: "certification.careInstructions", label: "Care Instructions" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    optional: true,
    fields: [
      { key: "footer.terms", label: "Terms & Conditions" },
      { key: "footer.returnPolicy", label: "Return / Exchange Policy" },
      { key: "footer.warrantyTerms", label: "Warranty Terms" },
      { key: "footer.supportDetails", label: "Customer Support" },
      { key: "footer.thankYouMessage", label: "Thank You Message" },
      { key: "footer.signature", label: "Authorized Signature" },
      { key: "footer.stamp", label: "Stamp" },
      { key: "footer.qrUrl", label: "QR Code" },
    ],
  },
];

// Every non-essential field key, defaulted ON (empty ones hide themselves).
function allFields(value: boolean): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const section of SECTION_CATALOG) {
    for (const f of section.fields) {
      if (!f.essential) out[f.key] = value;
    }
  }
  return out;
}

function baseConfig(): InvoiceConfig {
  return {
    preset: "custom",
    sections: {
      business: true,
      invoice: true,
      customer: true,
      products: true,
      pricing: true,
      payment: true,
      shipping: true,
      certification: true,
      footer: true,
    },
    fields: allFields(true),
    showInternalNotes: false,
  };
}

// ── Category presets ──
// Each preset tweaks the base config so a category starts with a sensible set of
// visible fields. Switching presets never erases entered data — it only flips
// which fields/sections are shown.
export interface Preset {
  key: PresetKey;
  label: string;
  description: string;
  apply: (cfg: InvoiceConfig) => InvoiceConfig;
  pricingMode?: "simple" | "detailed";
}

function withFields(cfg: InvoiceConfig, overrides: Record<string, boolean>): InvoiceConfig {
  return { ...cfg, fields: { ...cfg.fields, ...overrides } };
}

export const PRESETS: Preset[] = [
  {
    key: "silver",
    label: "Silver Jewellery",
    description: "Simple bill — purity, weight, quantity, price.",
    pricingMode: "simple",
    apply: () => {
      const cfg = withFields(baseConfig(), {
        "item.metal": true,
        "item.weight": true,
        "item.metalRate": false,
        "item.stone": false,
        "item.stoneQuality": false,
        "item.ringSize": false,
        "item.length": false,
        "item.makingCharges": false,
        "item.wastageCharges": false,
        "item.otherCharges": false,
        "certification.diamondCertNumber": false,
        "certification.certAuthority": false,
        "certification.certLink": false,
      });
      cfg.preset = "silver";
      cfg.sections = { ...cfg.sections, certification: false, shipping: false };
      return cfg;
    },
  },
  {
    key: "gold",
    label: "Gold Jewellery",
    description: "Detailed — weight, rate, making & wastage, hallmark/HUID.",
    pricingMode: "detailed",
    apply: () => {
      const cfg = withFields(baseConfig(), {
        "item.metal": true,
        "item.weight": true,
        "item.metalRate": true,
        "item.makingCharges": true,
        "item.wastageCharges": true,
        "item.stone": false,
        "item.stoneQuality": false,
        "certification.diamondCertNumber": false,
      });
      cfg.preset = "gold";
      cfg.sections = { ...cfg.sections, shipping: false };
      return cfg;
    },
  },
  {
    key: "diamond",
    label: "Diamond Jewellery",
    description: "Full spec — metal, stone grading, certification.",
    pricingMode: "detailed",
    apply: () => {
      const cfg = withFields(baseConfig(), {
        "item.metal": true,
        "item.weight": true,
        "item.metalRate": true,
        "item.makingCharges": true,
        "item.stone": true,
        "item.stoneQuality": true,
      });
      cfg.preset = "diamond";
      return cfg;
    },
  },
  {
    key: "international",
    label: "International Order",
    description: "USD, no GST, shipping & insurance shown.",
    pricingMode: "detailed",
    apply: () => {
      const cfg = withFields(baseConfig(), {
        "business.gstin": false,
        "customer.gstin": false,
        "item.metal": true,
        "item.weight": true,
        "item.stone": true,
        "item.stoneQuality": true,
      });
      cfg.preset = "international";
      cfg.sections = { ...cfg.sections, shipping: true };
      return cfg;
    },
  },
];

export function defaultConfig(): InvoiceConfig {
  // Diamond is the richest default — a good starting point for a luxury house.
  return PRESETS.find((p) => p.key === "diamond")!.apply(baseConfig());
}

export function getPreset(key: PresetKey): Preset | undefined {
  return PRESETS.find((p) => p.key === key);
}
