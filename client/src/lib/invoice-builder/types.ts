// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Configurable Invoice Builder: data model
// ───────────────────────────────────────────────────────────
// A single, flexible invoice draft that works for a simple silver
// ring as well as a fully-specified certified diamond piece. Every
// optional field lives here; what actually prints is decided by the
// field config (what the user enabled) AND whether the value is set
// (empty optional fields are never rendered).
// ═══════════════════════════════════════════════════════════

export type InvoiceType = "quotation" | "proforma" | "tax_invoice";
export type Currency = "INR" | "USD";
export type PaymentStatus = "paid" | "partial" | "pending" | "processing";
export type PricingMode = "simple" | "detailed";

// Jewellery-specific enums (kept as loose unions so "Other"/custom is allowed).
export type ItemMetalType = "silver" | "gold" | "white_gold" | "rose_gold" | "platinum" | "other";
export type ItemMetalPurity = "925" | "14K" | "18K" | "22K" | "24K" | "950Pt" | "custom";
export type ItemStoneType =
  | "natural_diamond"
  | "lab_diamond"
  | "cz"
  | "gemstone"
  | "other";

// Tax treatment is a deliberate choice, never auto-applied the same way to
// every bill. "none" = no tax (e.g. quotation / export). Intra-state uses the
// CGST+SGST split; inter-state / other uses a single IGST line.
export type TaxMode = "none" | "cgst_sgst" | "igst";

export type PaymentMethod =
  | "upi"
  | "bank_transfer"
  | "card"
  | "cash"
  | "other";

// ── Field groups ──
export interface BusinessInfo {
  name: string;
  logoUrl: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  gstin: string;
  state: string;
  stateCode: string;
  extraRegistration: string;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string; // ISO yyyy-mm-dd
  dueDate: string;
  orderNumber: string;
  type: InvoiceType;
  currency: Currency;
  paymentStatus: PaymentStatus;
  poReference: string;
  salesRep: string;
  internalNotes: string;
}

export interface CustomerInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  sameAsBilling: boolean;
  country: string;
  gstin: string;
  referenceNumber: string;
}

export interface LineItem {
  id: string;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  category: string;

  // Metal
  metalType: ItemMetalType | "";
  metalPurity: ItemMetalPurity | "";
  grossWeight: number | null;
  netWeight: number | null;
  metalRate: number | null; // per gram
  metalValueOverride: number | null; // if set, used instead of rate × netWeight

  // Stone
  stoneType: ItemStoneType | "";
  stoneWeight: number | null; // carats
  stoneColor: string;
  stoneClarity: string;
  stoneCut: string;
  stoneQuality: string;
  stoneValue: number | null;

  // Dimensions
  ringSize: string;
  length: string; // chain / bracelet length

  quantity: number;

  // Simple pricing
  unitPrice: number | null;

  // Detailed pricing (per unit amounts)
  makingCharges: number | null;
  wastageCharges: number | null;
  otherCharges: number | null;

  // Per-item discount (absolute amount, applied to the whole line)
  discount: number | null;

  // Internal only — factory / purchase cost per unit. Used for the admin profit
  // view; never rendered on the customer-facing invoice.
  costPrice: number | null;
}

export interface PricingInfo {
  mode: PricingMode;
  discountType: "amount" | "percent";
  discountValue: number;
  shippingCharges: number;
  insuranceCharges: number;
  taxMode: TaxMode;
  // GST component rates (%). Detailed mode splits metal/stone vs making/labour,
  // matching Indian jewellery GST (3% on metal & stone value, 5% on making).
  gstGoodsRate: number; // metal + stone value
  gstMakingRate: number; // making / wastage / labour
  // Single rate used in simple mode (where components aren't broken out).
  simpleGstRate: number;
  advancePaid: number;
  showAmountInWords: boolean;
}

export interface PaymentInfo {
  method: PaymentMethod | "";
  transactionId: string;
  paymentDate: string;
  paymentTerms: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  upiId: string;
  paymentLink: string;
}

export interface ShippingInfo {
  method: string;
  courier: string;
  trackingNumber: string;
  shippingDate: string;
  estimatedDelivery: string;
  deliveryAddress: string;
}

export interface CertificationInfo {
  hallmark: string;
  huid: string;
  diamondCertNumber: string;
  certAuthority: string;
  certLink: string;
  warranty: string;
  returnPolicy: string;
  careInstructions: string;
}

export interface FooterInfo {
  terms: string;
  returnPolicy: string;
  warrantyTerms: string;
  supportDetails: string;
  thankYouMessage: string;
  signatureName: string;
  showSignature: boolean;
  showStamp: boolean;
  qrUrl: string;
}

export interface InvoiceDraft {
  business: BusinessInfo;
  meta: InvoiceMeta;
  customer: CustomerInfo;
  items: LineItem[];
  pricing: PricingInfo;
  payment: PaymentInfo;
  shipping: ShippingInfo;
  certification: CertificationInfo;
  footer: FooterInfo;
}

// ── Field configuration (what's enabled) ──
export type SectionKey =
  | "business"
  | "invoice"
  | "customer"
  | "products"
  | "pricing"
  | "payment"
  | "shipping"
  | "certification"
  | "footer";

export type PresetKey = "silver" | "gold" | "diamond" | "international" | "custom";

export interface InvoiceConfig {
  preset: PresetKey;
  // Optional whole-section blocks that can be switched off entirely.
  sections: Record<SectionKey, boolean>;
  // Granular per-field toggles, namespaced "<section>.<field>".
  fields: Record<string, boolean>;
  // Whether internal notes appear on the client-facing bill (off by default).
  showInternalNotes: boolean;
}
