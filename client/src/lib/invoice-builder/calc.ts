// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Invoice Builder: calculations & formatting
// ───────────────────────────────────────────────────────────
// All money is rounded to whole currency units at display/total time;
// intermediate sums stay in floats to avoid compounding rounding error.
// Taxes and discounts are each counted exactly once.
// ═══════════════════════════════════════════════════════════

import type { Currency, InvoiceDraft, LineItem, PricingInfo } from "./types";

const n = (v: number | null | undefined): number => {
  const x = Number(v);
  return Number.isFinite(x) && x > 0 ? x : 0;
};

/** Metal value for a line: explicit override wins, else rate × net weight. */
export function metalValue(item: LineItem): number {
  if (item.metalValueOverride != null && item.metalValueOverride >= 0) {
    return n(item.metalValueOverride);
  }
  return n(item.metalRate) * n(item.netWeight);
}

/** Per-unit base cost (before quantity & item discount). */
export function itemUnitBase(item: LineItem, mode: PricingInfo["mode"]): number {
  if (mode === "simple") return n(item.unitPrice);
  return (
    metalValue(item) +
    n(item.stoneValue) +
    n(item.makingCharges) +
    n(item.wastageCharges) +
    n(item.otherCharges)
  );
}

/** Line total = unit base × qty − item discount (never below zero). */
export function itemTotal(item: LineItem, mode: PricingInfo["mode"]): number {
  const qty = Math.max(1, Math.floor(n(item.quantity) || 1));
  const gross = itemUnitBase(item, mode) * qty;
  return Math.max(0, gross - n(item.discount));
}

// Per-line split of the taxable base into "goods" (metal + stone) and
// "making" (labour), used for the GST rate split in detailed mode.
function itemTaxSplit(item: LineItem, mode: PricingInfo["mode"]): { goods: number; making: number } {
  const qty = Math.max(1, Math.floor(n(item.quantity) || 1));
  if (mode === "simple") {
    return { goods: n(item.unitPrice) * qty, making: 0 };
  }
  const goods = (metalValue(item) + n(item.stoneValue)) * qty;
  const making = (n(item.makingCharges) + n(item.wastageCharges) + n(item.otherCharges)) * qty;
  return { goods, making };
}

export interface InvoiceTotals {
  subtotal: number; // Σ line totals
  discount: number; // invoice-level discount amount
  taxableAmount: number; // subtotal − discount
  taxGoods: number; // GST on metal + stone value
  taxMaking: number; // GST on making / labour
  taxTotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  shipping: number;
  insurance: number;
  grandTotal: number;
  advancePaid: number;
  balanceDue: number;
}

export function computeTotals(draft: InvoiceDraft): InvoiceTotals {
  const { items, pricing } = draft;
  const mode = pricing.mode;

  const subtotal = items.reduce((s, it) => s + itemTotal(it, mode), 0);

  // Invoice-level discount, applied once.
  let discount = 0;
  if (pricing.discountType === "percent") {
    discount = subtotal * (Math.min(100, Math.max(0, n(pricing.discountValue))) / 100);
  } else {
    discount = Math.min(subtotal, n(pricing.discountValue));
  }
  const taxableAmount = Math.max(0, subtotal - discount);

  // Spread the discount proportionally across the goods/making split so tax is
  // computed on the actually-charged (post-discount) amounts.
  const split = items.reduce(
    (acc, it) => {
      const s = itemTaxSplit(it, mode);
      acc.goods += s.goods;
      acc.making += s.making;
      return acc;
    },
    { goods: 0, making: 0 }
  );
  const splitBase = split.goods + split.making;
  const discountFactor = splitBase > 0 ? taxableAmount / splitBase : 0;
  const goodsBase = split.goods * discountFactor;
  const makingBase = split.making * discountFactor;

  let taxGoods = 0;
  let taxMaking = 0;
  if (pricing.taxMode !== "none") {
    if (mode === "simple") {
      // One flat rate on the whole taxable amount.
      taxGoods = taxableAmount * (n(pricing.simpleGstRate) / 100);
    } else {
      taxGoods = goodsBase * (n(pricing.gstGoodsRate) / 100);
      taxMaking = makingBase * (n(pricing.gstMakingRate) / 100);
    }
  }
  const taxTotal = taxGoods + taxMaking;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  if (pricing.taxMode === "cgst_sgst") {
    cgst = taxTotal / 2;
    sgst = taxTotal / 2;
  } else if (pricing.taxMode === "igst") {
    igst = taxTotal;
  }

  const shipping = n(pricing.shippingCharges);
  const insurance = n(pricing.insuranceCharges);
  const grandTotal = round(taxableAmount + taxTotal + shipping + insurance);

  const advancePaid = Math.min(grandTotal, n(pricing.advancePaid));
  const balanceDue = Math.max(0, grandTotal - advancePaid);

  return {
    subtotal: round(subtotal),
    discount: round(discount),
    taxableAmount: round(taxableAmount),
    taxGoods: round(taxGoods),
    taxMaking: round(taxMaking),
    taxTotal: round(taxTotal),
    cgst: round(cgst),
    sgst: round(sgst),
    igst: round(igst),
    shipping: round(shipping),
    insurance: round(insurance),
    grandTotal,
    advancePaid: round(advancePaid),
    balanceDue: round(balanceDue),
  };
}

function round(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

// ── Profit (internal) ──
// Factory/purchase cost per line = costPrice × qty. Compared against the goods
// revenue the customer actually pays after any invoice-level discount, so the
// margin reflects what we really earn. Tax, shipping & insurance are excluded
// (they're pass-through / separate charges, not part of the goods margin).

/** Factory cost for a line = cost-per-unit × quantity. */
export function itemCost(item: LineItem): number {
  const qty = Math.max(1, Math.floor(n(item.quantity) || 1));
  return n(item.costPrice) * qty;
}

export interface ProfitInfo {
  totalCost: number; // Σ factory cost across items
  revenue: number; // goods revenue after invoice discount (taxable amount)
  profit: number; // revenue − cost
  margin: number; // profit ÷ revenue × 100
  hasCost: boolean; // any line carries a factory cost
}

export function computeProfit(draft: InvoiceDraft, totals: InvoiceTotals): ProfitInfo {
  const totalCost = draft.items.reduce((s, it) => s + itemCost(it), 0);
  const revenue = totals.taxableAmount;
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  return {
    totalCost: round(totalCost),
    revenue: round(revenue),
    profit: round(profit),
    margin: round(margin),
    hasCost: draft.items.some((it) => n(it.costPrice) > 0),
  };
}

// ── Currency formatting ──
export function formatMoney(value: number, currency: Currency): string {
  const v = Number.isFinite(value) ? value : 0;
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(v);
  }
  return `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

// ── Amount in words ──
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigits(num: number): string {
  if (num < 20) return ONES[num];
  const t = Math.floor(num / 10);
  const o = num % 10;
  return TENS[t] + (o ? ` ${ONES[o]}` : "");
}

function threeDigits(num: number): string {
  const h = Math.floor(num / 100);
  const rest = num % 100;
  let out = "";
  if (h) out += `${ONES[h]} Hundred`;
  if (rest) out += `${h ? " " : ""}${twoDigits(rest)}`;
  return out;
}

// Indian numbering (lakh/crore) for INR; international (million) for USD.
function wholeToWords(num: number, system: "indian" | "western"): string {
  if (num === 0) return "Zero";
  if (num < 0) return `Minus ${wholeToWords(-num, system)}`;

  const parts: string[] = [];
  if (system === "indian") {
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = num % 1000;
    if (crore) parts.push(`${wholeToWords(crore, system)} Crore`);
    if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
    if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
    if (hundred) parts.push(threeDigits(hundred));
  } else {
    const billion = Math.floor(num / 1000000000);
    const million = Math.floor((num % 1000000000) / 1000000);
    const thousand = Math.floor((num % 1000000) / 1000);
    const hundred = num % 1000;
    if (billion) parts.push(`${threeDigits(billion)} Billion`);
    if (million) parts.push(`${threeDigits(million)} Million`);
    if (thousand) parts.push(`${threeDigits(thousand)} Thousand`);
    if (hundred) parts.push(threeDigits(hundred));
  }
  return parts.join(" ").trim();
}

export function amountInWords(value: number, currency: Currency): string {
  const safe = Number.isFinite(value) ? Math.abs(value) : 0;
  const whole = Math.floor(safe);
  const fraction = Math.round((safe - whole) * 100);
  const system = currency === "INR" ? "indian" : "western";
  const unit = currency === "INR" ? "Rupees" : "Dollars";
  const sub = currency === "INR" ? "Paise" : "Cents";

  let words = `${unit} ${wholeToWords(whole, system)}`;
  if (fraction > 0) words += ` and ${sub} ${twoDigits(fraction)}`;
  return `${words} Only`;
}
