// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Invoice Builder: A4 HTML renderer
// ───────────────────────────────────────────────────────────
// Produces a self-contained, print-ready A4 document. Used BOTH for the
// live preview (via <iframe srcDoc>) and for Print / Save-as-PDF, so the
// PDF always matches what the user sees. A field is rendered only when it
// is enabled in the config AND has a real value — empty optional fields,
// blank labels, null/undefined and dangling separators never appear.
// Design mirrors the existing Sparenza bill: ivory sheet, gold accent,
// Georgia serif, logo header + faint centred watermark.
// ═══════════════════════════════════════════════════════════

import type { InvoiceConfig, InvoiceDraft, InvoiceType, LineItem, PaymentStatus } from "./types";
import { computeTotals, formatMoney, amountInWords, metalValue, itemTotal } from "./calc";

const GOLD = "#C4A265";

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// A value counts as "present" only if it's a non-blank string or a number > 0.
function has(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "number") return Number.isFinite(v) && v !== 0;
  return String(v).trim().length > 0;
}

const TYPE_LABEL: Record<InvoiceType, string> = {
  quotation: "Quotation",
  proforma: "Proforma Invoice",
  tax_invoice: "Tax Invoice",
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: "Paid",
  partial: "Partially Paid",
  pending: "Pending",
  processing: "Processing",
};

const STATUS_COLOR: Record<PaymentStatus, string> = {
  paid: "#16a34a",
  partial: "#d97706",
  pending: "#6b7280",
  processing: "#2563eb",
};

const METAL_LABEL: Record<string, string> = {
  silver: "Silver",
  gold: "Gold",
  white_gold: "White Gold",
  rose_gold: "Rose Gold",
  platinum: "Platinum",
  other: "",
};

const STONE_LABEL: Record<string, string> = {
  natural_diamond: "Natural Diamond",
  lab_diamond: "Lab-Grown Diamond",
  cz: "American Diamond (CZ)",
  gemstone: "Gemstone",
  other: "",
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  card: "Card",
  cash: "Cash",
  other: "Other",
};

/** True when a product column/field group is enabled in config. */
function on(cfg: InvoiceConfig, key: string): boolean {
  return cfg.fields[key] !== false;
}

// Builds the small muted attribute line beneath an item's name.
function itemAttrs(item: LineItem, cfg: InvoiceConfig, mode: "simple" | "detailed"): string {
  const bits: string[] = [];
  if (on(cfg, "item.sku") && has(item.sku)) bits.push(`SKU: ${esc(item.sku)}`);
  if (on(cfg, "item.category") && has(item.category)) bits.push(esc(item.category));
  if (on(cfg, "item.metal")) {
    const metal = [METAL_LABEL[item.metalType] || "", item.metalPurity === "custom" ? "" : item.metalPurity]
      .filter(Boolean)
      .join(" ");
    if (metal.trim()) bits.push(esc(metal.trim()));
  }
  if (on(cfg, "item.weight")) {
    if (has(item.grossWeight)) bits.push(`Gross ${item.grossWeight}g`);
    if (has(item.netWeight)) bits.push(`Net ${item.netWeight}g`);
  }
  if (on(cfg, "item.stone")) {
    const stone = STONE_LABEL[item.stoneType] || "";
    const parts = [stone, has(item.stoneWeight) ? `${item.stoneWeight}ct` : ""].filter(Boolean).join(" ");
    if (parts.trim()) bits.push(esc(parts.trim()));
  }
  if (on(cfg, "item.stoneQuality")) {
    const q = [item.stoneColor, item.stoneClarity, item.stoneCut, item.stoneQuality]
      .filter((x) => has(x))
      .join(" / ");
    if (q) bits.push(esc(q));
  }
  if (on(cfg, "item.ringSize") && has(item.ringSize)) bits.push(`Size ${esc(item.ringSize)}`);
  if (on(cfg, "item.length") && has(item.length)) bits.push(`Length ${esc(item.length)}`);

  let line = bits.length ? `<div class="attrs">${bits.join(" &middot; ")}</div>` : "";

  // Detailed breakdown line (only when those charge fields are on & present).
  if (mode === "detailed") {
    const breakdown: string[] = [];
    const mv = metalValue(item);
    if (on(cfg, "item.metalRate") && mv > 0) breakdown.push(`Metal ${fmtMoney(mv)}`);
    if (has(item.stoneValue)) breakdown.push(`Stone ${fmtMoney(item.stoneValue!)}`);
    if (on(cfg, "item.makingCharges") && has(item.makingCharges))
      breakdown.push(`Making ${fmtMoney(item.makingCharges!)}`);
    if (on(cfg, "item.wastageCharges") && has(item.wastageCharges))
      breakdown.push(`Wastage ${fmtMoney(item.wastageCharges!)}`);
    if (on(cfg, "item.otherCharges") && has(item.otherCharges))
      breakdown.push(`Other ${fmtMoney(item.otherCharges!)}`);
    if (on(cfg, "item.discount") && has(item.discount))
      breakdown.push(`Discount −${fmtMoney(item.discount!)}`);
    if (breakdown.length) line += `<div class="breakdown">${breakdown.join(" &middot; ")}</div>`;
  }
  return line;
}

let _currency: "INR" | "USD" = "INR";
function fmtMoney(v: number): string {
  return formatMoney(v, _currency);
}

// ── Reusable blocks ──
function kv(label: string, value: string): string {
  return `<div class="kv"><span>${esc(label)}</span><span>${value}</span></div>`;
}

function infoSection(title: string, rows: string[]): string {
  const body = rows.filter(Boolean).join("");
  if (!body) return "";
  return `<div class="block"><h4>${esc(title)}</h4><div class="kvs">${body}</div></div>`;
}

export function buildInvoiceDocHtml(draft: InvoiceDraft, cfg: InvoiceConfig): string {
  const { business, meta, customer, items, pricing, payment, shipping, certification, footer } = draft;
  _currency = meta.currency;
  const totals = computeTotals(draft);
  const mode = pricing.mode;
  const money = (v: number) => formatMoney(v, meta.currency);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const logo = business.logoUrl
    ? business.logoUrl.startsWith("http")
      ? business.logoUrl
      : `${origin}${business.logoUrl}`
    : "";

  // ── Business header ──
  const bizLines: string[] = [];
  if (on(cfg, "business.address") && has(business.address)) bizLines.push(esc(business.address));
  const contact = [
    on(cfg, "business.email") && has(business.email) ? esc(business.email) : "",
    on(cfg, "business.phone") && has(business.phone) ? esc(business.phone) : "",
    on(cfg, "business.website") && has(business.website) ? esc(business.website) : "",
  ].filter(Boolean);
  if (contact.length) bizLines.push(contact.join(" &middot; "));
  const reg = [
    on(cfg, "business.gstin") && has(business.gstin) ? `GSTIN: ${esc(business.gstin)}` : "",
    on(cfg, "business.state") && has(business.state)
      ? `State: ${esc(business.state)}${has(business.stateCode) ? ` (${esc(business.stateCode)})` : ""}`
      : "",
    on(cfg, "business.extraRegistration") && has(business.extraRegistration)
      ? esc(business.extraRegistration)
      : "",
  ].filter(Boolean);
  if (reg.length) bizLines.push(reg.join(" &middot; "));

  const brand = logo
    ? `<img src="${esc(logo)}" alt="${esc(business.name)}" class="logo" />`
    : `<div class="brand-name">${esc(business.name)}</div>`;

  // ── Doc meta (right column) ──
  const statusPill =
    on(cfg, "invoice.paymentStatus") && meta.type === "tax_invoice"
      ? `<div class="pill" style="background:${STATUS_COLOR[meta.paymentStatus]}1a;color:${STATUS_COLOR[meta.paymentStatus]};border-color:${STATUS_COLOR[meta.paymentStatus]}55">${STATUS_LABEL[meta.paymentStatus]}</div>`
      : "";

  const metaRows = [
    kv("Invoice No", esc(meta.invoiceNumber)),
    has(meta.invoiceDate) ? kv("Date", fmtDate(meta.invoiceDate)) : "",
    on(cfg, "invoice.dueDate") && has(meta.dueDate) ? kv("Due Date", fmtDate(meta.dueDate)) : "",
    on(cfg, "invoice.orderNumber") && has(meta.orderNumber) ? kv("Order No", esc(meta.orderNumber)) : "",
    on(cfg, "invoice.poReference") && has(meta.poReference) ? kv("PO Ref", esc(meta.poReference)) : "",
    on(cfg, "invoice.salesRep") && has(meta.salesRep) ? kv("Sales Rep", esc(meta.salesRep)) : "",
  ]
    .filter(Boolean)
    .join("");

  // ── Parties ──
  const custLines = [
    has(customer.company) && on(cfg, "customer.company") ? `<p>${esc(customer.company)}</p>` : "",
    on(cfg, "customer.billingAddress") && has(customer.billingAddress)
      ? `<p>${esc(customer.billingAddress).replace(/\n/g, "<br/>")}</p>`
      : "",
    on(cfg, "customer.country") && has(customer.country) ? `<p>${esc(customer.country)}</p>` : "",
    on(cfg, "customer.phone") && has(customer.phone) ? `<p>${esc(customer.phone)}</p>` : "",
    on(cfg, "customer.email") && has(customer.email) ? `<p>${esc(customer.email)}</p>` : "",
    on(cfg, "customer.gstin") && has(customer.gstin) ? `<p>GSTIN: ${esc(customer.gstin)}</p>` : "",
    on(cfg, "customer.referenceNumber") && has(customer.referenceNumber)
      ? `<p>Ref: ${esc(customer.referenceNumber)}</p>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const billTo = `<div class="party"><h4>Bill To</h4><p class="name">${esc(customer.name) || "—"}</p>${custLines}</div>`;

  const shipAddr =
    on(cfg, "customer.shippingAddress") && !customer.sameAsBilling && has(customer.shippingAddress)
      ? `<div class="party"><h4>Ship To</h4><p>${esc(customer.shippingAddress).replace(/\n/g, "<br/>")}</p></div>`
      : "";

  // ── Items table ──
  const rows = items
    .filter((it) => has(it.name) || itemTotal(it, mode) > 0)
    .map((it, i) => {
      const qty = Math.max(1, Math.floor(Number(it.quantity) || 1));
      const total = itemTotal(it, mode);
      const unit = qty > 0 ? total / qty : total;
      const img =
        on(cfg, "item.image") && has(it.imageUrl)
          ? `<img src="${esc(it.imageUrl.startsWith("http") ? it.imageUrl : origin + it.imageUrl)}" class="item-img" alt="" />`
          : "";
      const desc =
        on(cfg, "item.description") && has(it.description)
          ? `<div class="desc">${esc(it.description)}</div>`
          : "";
      return `<tr>
        <td class="idx">${i + 1}</td>
        <td class="item">
          <div class="item-head">${img}<div><div class="item-name">${esc(it.name) || "Item"}</div>${itemAttrs(it, cfg, mode)}${desc}</div></div>
        </td>
        <td class="c">${qty}</td>
        <td class="r">${money(unit)}</td>
        <td class="r b">${money(total)}</td>
      </tr>`;
    })
    .join("");

  // ── Totals ──
  const totalRows: string[] = [];
  totalRows.push(row("Subtotal", money(totals.subtotal)));
  if (on(cfg, "pricing.discount") && totals.discount > 0)
    totalRows.push(row("Discount", `−${money(totals.discount)}`, "discount"));
  if (pricing.taxMode !== "none" && on(cfg, "pricing.tax") && totals.taxTotal > 0) {
    totalRows.push(row("Taxable Amount", money(totals.taxableAmount)));
    if (pricing.taxMode === "cgst_sgst" && totals.taxTotal > 0) {
      totalRows.push(row(`CGST`, money(totals.cgst)));
      totalRows.push(row(`SGST`, money(totals.sgst)));
    } else if (pricing.taxMode === "igst" && totals.igst > 0) {
      totalRows.push(row(`IGST`, money(totals.igst)));
    }
  }
  if (on(cfg, "pricing.shipping") && totals.shipping > 0)
    totalRows.push(row("Shipping", money(totals.shipping)));
  if (on(cfg, "pricing.insurance") && totals.insurance > 0)
    totalRows.push(row("Insurance", money(totals.insurance)));

  const grand = `<div class="grand"><span>Grand Total</span><span>${money(totals.grandTotal)}</span></div>`;

  let paidRows = "";
  if (on(cfg, "pricing.advance") && totals.advancePaid > 0) {
    paidRows =
      row("Amount Paid", money(totals.advancePaid)) +
      row("Balance Due", money(totals.balanceDue), "balance");
  }

  const words =
    on(cfg, "pricing.amountInWords") && pricing.showAmountInWords
      ? `<div class="words"><strong>Amount in words:</strong> ${esc(amountInWords(totals.grandTotal, meta.currency))}</div>`
      : "";

  // ── Payment / Shipping / Certification ──
  const paymentBlock = cfg.sections.payment
    ? infoSection("Payment Details", [
        on(cfg, "payment.method") && has(payment.method)
          ? kv("Method", esc(PAYMENT_METHOD_LABEL[payment.method] || payment.method))
          : "",
        on(cfg, "payment.transactionId") && has(payment.transactionId)
          ? kv("Transaction / Ref", esc(payment.transactionId))
          : "",
        on(cfg, "payment.paymentDate") && has(payment.paymentDate)
          ? kv("Payment Date", fmtDate(payment.paymentDate))
          : "",
        on(cfg, "payment.paymentTerms") && has(payment.paymentTerms)
          ? kv("Terms", esc(payment.paymentTerms))
          : "",
        on(cfg, "payment.upiId") && has(payment.upiId) ? kv("UPI ID", esc(payment.upiId)) : "",
        on(cfg, "payment.bank") && has(payment.bankName) ? kv("Bank", esc(payment.bankName)) : "",
        on(cfg, "payment.bank") && has(payment.accountName)
          ? kv("A/C Name", esc(payment.accountName))
          : "",
        on(cfg, "payment.bank") && has(payment.accountNumber)
          ? kv("A/C No", esc(payment.accountNumber))
          : "",
        on(cfg, "payment.bank") && has(payment.ifsc) ? kv("IFSC", esc(payment.ifsc)) : "",
        on(cfg, "payment.paymentLink") && has(payment.paymentLink)
          ? kv("Pay Online", esc(payment.paymentLink))
          : "",
      ])
    : "";

  const shippingBlock = cfg.sections.shipping
    ? infoSection("Shipping", [
        on(cfg, "shipping.method") && has(shipping.method) ? kv("Method", esc(shipping.method)) : "",
        on(cfg, "shipping.courier") && has(shipping.courier) ? kv("Courier", esc(shipping.courier)) : "",
        on(cfg, "shipping.trackingNumber") && has(shipping.trackingNumber)
          ? kv("Tracking", esc(shipping.trackingNumber))
          : "",
        on(cfg, "shipping.shippingDate") && has(shipping.shippingDate)
          ? kv("Shipped", fmtDate(shipping.shippingDate))
          : "",
        on(cfg, "shipping.estimatedDelivery") && has(shipping.estimatedDelivery)
          ? kv("Est. Delivery", fmtDate(shipping.estimatedDelivery))
          : "",
        on(cfg, "shipping.deliveryAddress") && has(shipping.deliveryAddress)
          ? kv("Deliver To", esc(shipping.deliveryAddress))
          : "",
      ])
    : "";

  const certBlock = cfg.sections.certification
    ? infoSection("Certification & Authenticity", [
        on(cfg, "certification.hallmark") && has(certification.hallmark)
          ? kv("Hallmark", esc(certification.hallmark))
          : "",
        on(cfg, "certification.huid") && has(certification.huid) ? kv("HUID", esc(certification.huid)) : "",
        on(cfg, "certification.diamondCertNumber") && has(certification.diamondCertNumber)
          ? kv("Diamond Cert", esc(certification.diamondCertNumber))
          : "",
        on(cfg, "certification.certAuthority") && has(certification.certAuthority)
          ? kv("Authority", esc(certification.certAuthority))
          : "",
        on(cfg, "certification.certLink") && has(certification.certLink)
          ? kv("Certificate", esc(certification.certLink))
          : "",
        on(cfg, "certification.warranty") && has(certification.warranty)
          ? kv("Warranty", esc(certification.warranty))
          : "",
        on(cfg, "certification.returnPolicy") && has(certification.returnPolicy)
          ? kv("Returns", esc(certification.returnPolicy))
          : "",
        on(cfg, "certification.careInstructions") && has(certification.careInstructions)
          ? kv("Care", esc(certification.careInstructions))
          : "",
      ])
    : "";

  const infoBlocks = [paymentBlock, shippingBlock, certBlock].filter(Boolean).join("");

  // ── Internal notes (only when explicitly enabled) ──
  const internal =
    cfg.showInternalNotes && on(cfg, "invoice.internalNotes") && has(meta.internalNotes)
      ? `<div class="internal"><strong>Internal Note:</strong> ${esc(meta.internalNotes)}</div>`
      : "";

  // ── Footer ──
  const footTerms = cfg.sections.footer
    ? [
        on(cfg, "footer.terms") && has(footer.terms)
          ? `<div class="terms"><strong>Terms & Conditions</strong><p>${esc(footer.terms).replace(/\n/g, "<br/>")}</p></div>`
          : "",
        on(cfg, "footer.returnPolicy") && has(footer.returnPolicy)
          ? `<div class="terms"><strong>Return / Exchange</strong><p>${esc(footer.returnPolicy).replace(/\n/g, "<br/>")}</p></div>`
          : "",
        on(cfg, "footer.warrantyTerms") && has(footer.warrantyTerms)
          ? `<div class="terms"><strong>Warranty</strong><p>${esc(footer.warrantyTerms).replace(/\n/g, "<br/>")}</p></div>`
          : "",
        on(cfg, "footer.supportDetails") && has(footer.supportDetails)
          ? `<div class="terms"><strong>Support</strong><p>${esc(footer.supportDetails).replace(/\n/g, "<br/>")}</p></div>`
          : "",
      ]
        .filter(Boolean)
        .join("")
    : "";

  const sign =
    cfg.sections.footer && on(cfg, "footer.signature") && footer.showSignature
      ? `<div class="sign"><div class="sign-line"></div><div>${esc(footer.signatureName) || "Authorized Signatory"}</div></div>`
      : "";
  const stamp =
    cfg.sections.footer && on(cfg, "footer.stamp") && footer.showStamp
      ? `<div class="stamp">Stamp</div>`
      : "";
  const qr =
    cfg.sections.footer && on(cfg, "footer.qrUrl") && has(footer.qrUrl)
      ? `<img src="${esc(footer.qrUrl.startsWith("http") ? footer.qrUrl : origin + footer.qrUrl)}" class="qr" alt="QR" />`
      : "";

  const thankYou =
    cfg.sections.footer && on(cfg, "footer.thankYouMessage") && has(footer.thankYouMessage)
      ? `<div class="thanks">${esc(footer.thankYouMessage)}</div>`
      : "";

  // Honest labelling: a quotation / proforma is not proof of a completed sale.
  const disclaimer =
    meta.type !== "tax_invoice"
      ? `<div class="disclaimer">This ${esc(TYPE_LABEL[meta.type])} is not a tax invoice and does not confirm a completed sale.</div>`
      : "";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(TYPE_LABEL[meta.type])} ${esc(meta.invoiceNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; background: #f3f1ea; }
    .page { background: #fffdf8; max-width: 794px; margin: 16px auto; padding: 44px 48px; position: relative; min-height: 1000px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); }
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70%; max-width: 520px; opacity: 0.05; z-index: 0; pointer-events: none; }
    .sheet { position: relative; z-index: 1; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; border-bottom: 2px solid ${GOLD}; padding-bottom: 18px; margin-bottom: 8px; }
    .logo { height: 60px; width: auto; display: block; margin-bottom: 10px; }
    .brand-name { font-size: 24px; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px; }
    .biz .addr { font-size: 11px; color: #555; line-height: 1.7; max-width: 320px; }
    .doc { text-align: right; white-space: nowrap; }
    .doc .type { font-size: 15px; letter-spacing: 3px; text-transform: uppercase; color: ${GOLD}; font-weight: bold; margin-bottom: 8px; }
    .doc .pill { display: inline-block; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 3px 10px; border-radius: 999px; border: 1px solid; margin-bottom: 8px; }
    .kv { display: flex; justify-content: flex-end; gap: 12px; font-size: 11px; color: #444; padding: 1px 0; }
    .kv span:first-child { color: #888; }
    .kv span:last-child { min-width: 110px; text-align: right; font-weight: 600; color: #222; }
    .parties { display: flex; gap: 32px; margin: 22px 0; }
    .party { flex: 1; }
    .party h4 { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #888; margin: 0 0 6px; }
    .party .name { font-weight: bold; font-size: 14px; margin: 0 0 2px; }
    .party p { margin: 2px 0; font-size: 12px; color: #444; line-height: 1.5; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
    thead th { background: #f6f3ec; text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #666; padding: 9px 10px; border-bottom: 1px solid #e3ddd0; }
    tbody td { padding: 10px; font-size: 12px; border-bottom: 1px solid #eee; vertical-align: top; }
    .idx { color: #999; width: 24px; }
    .c { text-align: center; } .r { text-align: right; white-space: nowrap; } .b { font-weight: bold; }
    .item-head { display: flex; gap: 10px; }
    .item-img { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }
    .item-name { font-weight: 600; font-size: 13px; }
    .attrs { font-size: 10.5px; color: #777; margin-top: 2px; line-height: 1.5; }
    .breakdown { font-size: 10px; color: #999; margin-top: 2px; }
    .desc { font-size: 10.5px; color: #666; margin-top: 3px; font-style: italic; }
    .summary { display: flex; justify-content: space-between; gap: 32px; align-items: flex-start; }
    .summary .left { flex: 1; font-size: 11px; color: #555; }
    .totals { width: 300px; }
    .totals .trow { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #444; }
    .totals .trow.discount { color: #16a34a; }
    .totals .trow.balance { color: #b91c1c; font-weight: 600; }
    .grand { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 2px solid ${GOLD}; padding-top: 10px; margin-top: 6px; }
    .grand span:last-child { color: ${GOLD}; }
    .words { font-size: 11px; color: #555; margin-top: 12px; max-width: 420px; line-height: 1.5; }
    .blocks { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 26px; padding-top: 18px; border-top: 1px solid #eee; }
    .block { flex: 1; min-width: 200px; }
    .block h4 { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: ${GOLD}; margin: 0 0 8px; }
    .kvs .kv { justify-content: space-between; }
    .kvs .kv span:first-child { color: #888; }
    .kvs .kv span:last-child { color: #222; text-align: right; }
    .internal { margin-top: 18px; font-size: 11px; color: #92400e; background: #fffbeb; border: 1px solid #fde68a; padding: 8px 12px; border-radius: 6px; }
    .foot { margin-top: 28px; padding-top: 16px; border-top: 1px solid #eee; }
    .terms { font-size: 10.5px; color: #666; margin-bottom: 10px; line-height: 1.6; }
    .terms strong { display: block; color: #333; margin-bottom: 2px; }
    .signrow { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; gap: 20px; }
    .sign { text-align: center; font-size: 11px; color: #444; }
    .sign-line { width: 180px; border-top: 1px solid #999; margin-bottom: 6px; height: 40px; }
    .stamp { width: 90px; height: 90px; border: 1px dashed #bbb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #bbb; font-size: 11px; }
    .qr { width: 90px; height: 90px; object-fit: contain; }
    .thanks { text-align: center; font-size: 12px; color: ${GOLD}; font-style: italic; margin-top: 22px; }
    .disclaimer { text-align: center; font-size: 10px; color: #999; margin-top: 8px; }
    .genline { text-align: center; font-size: 10px; color: #bbb; margin-top: 10px; }
    @media print {
      body { background: #fff; }
      .page { box-shadow: none; margin: 0; max-width: none; width: 100%; min-height: auto; padding: 0; }
      tr { page-break-inside: avoid; }
      .block, .terms, .signrow { page-break-inside: avoid; }
    }
    @page { size: A4; margin: 14mm; }
  </style>
</head>
<body>
  <div class="page">
    ${logo ? `<img class="watermark" src="${esc(logo)}" alt="" />` : ""}
    <div class="sheet">
      <div class="top">
        <div class="biz">
          ${brand}
          <div class="addr">${bizLines.join("<br/>")}</div>
        </div>
        <div class="doc">
          <div class="type">${esc(TYPE_LABEL[meta.type])}</div>
          ${statusPill}
          ${metaRows}
        </div>
      </div>

      <div class="parties">
        ${billTo}
        ${shipAddr}
      </div>

      <table>
        <thead>
          <tr>
            <th class="idx">#</th>
            <th>Item</th>
            <th class="c">Qty</th>
            <th class="r">${mode === "detailed" ? "Rate" : "Unit Price"}</th>
            <th class="r">Amount</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="5" style="text-align:center;color:#aaa;padding:24px">No items added yet</td></tr>`}</tbody>
      </table>

      <div class="summary">
        <div class="left">${words}${internal}</div>
        <div class="totals">
          ${totalRows.join("")}
          ${grand}
          ${paidRows}
        </div>
      </div>

      ${infoBlocks ? `<div class="blocks">${infoBlocks}</div>` : ""}

      ${footTerms || sign || stamp || qr || thankYou || disclaimer ? `<div class="foot">
        ${footTerms}
        ${sign || stamp || qr ? `<div class="signrow">${qr || "<div></div>"}${stamp || "<div></div>"}${sign || "<div></div>"}</div>` : ""}
        ${thankYou}
        ${disclaimer}
      </div>` : ""}

      <div class="genline">This is a computer-generated document.</div>
    </div>
  </div>
</body>
</html>`;
}

function row(label: string, value: string, cls = ""): string {
  return `<div class="trow ${cls}"><span>${esc(label)}</span><span>${value}</span></div>`;
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return esc(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Opens the invoice in a new window and triggers the print dialog.
 *  Returns false if the pop-up was blocked. */
export function printInvoiceDoc(draft: InvoiceDraft, cfg: InvoiceConfig): boolean {
  const html = buildInvoiceDocHtml(draft, cfg);
  const w = window.open("", "_blank");
  if (!w) return false;
  w.document.open();
  w.document.write(html);
  w.document.close();

  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    try {
      w.focus();
      w.print();
    } catch {
      /* ignore */
    }
  };
  w.onload = go;
  setTimeout(go, 900);
  return true;
}
