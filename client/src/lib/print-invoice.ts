// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Printable bill / invoice
// ───────────────────────────────────────────────────────────
// Builds a self-contained, print-optimised HTML document for an
// invoice and opens it in a new window ready to print. The bill
// carries the Sparenza logo at the top and a large, faint logo
// watermark centred behind the content. The GST line is only
// shown when the order actually carries tax (taxAmount > 0).
// ═══════════════════════════════════════════════════════════

import { IInvoice } from "@/types/order.types";
import { siteConfig } from "@/config/site";

const GOLD = "#C4A265";

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

export function buildInvoiceHtml(invoice: IInvoice): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const logo = `${origin}/images/logo-sparenza-v3.png`;
  const o = invoice.order;
  const sa = (o.shippingAddress || {}) as Partial<IInvoice["order"]["shippingAddress"]>;
  const showTax = (invoice.taxAmount || 0) > 0;

  const rows = invoice.lineItems
    .map(
      (li) => `
      <tr>
        <td>${esc(li.description)}</td>
        <td class="c">${li.quantity}</td>
        <td class="r">${inr(li.unitPrice)}</td>
        <td class="r b">${inr(li.total)}</td>
      </tr>`
    )
    .join("");

  const customerName =
    [sa.firstName, sa.lastName].filter(Boolean).join(" ") || "—";
  const addrLines = [
    sa.addressLine1,
    sa.addressLine2,
    [sa.city, sa.state, sa.postalCode].filter(Boolean).join(", "),
    sa.country,
  ].filter(Boolean);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${esc(invoice.invoiceNumber)}</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Georgia, 'Times New Roman', serif; color: #1a1a1a; margin: 0; padding: 48px 56px; position: relative; }
      .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 72%; max-width: 560px; opacity: 0.06; z-index: 0; pointer-events: none; }
      .sheet { position: relative; z-index: 1; max-width: 760px; margin: 0 auto; }
      .top { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; border-bottom: 2px solid ${GOLD}; padding-bottom: 20px; margin-bottom: 24px; }
      .brand img { height: 64px; width: auto; display: block; margin-bottom: 10px; }
      .brand .addr { font-size: 11px; color: #555; line-height: 1.6; max-width: 300px; }
      .doc { text-align: right; white-space: nowrap; }
      .doc .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #888; }
      .doc .num { font-size: 18px; color: ${GOLD}; font-weight: bold; margin: 3px 0; }
      .doc .date { font-size: 11px; color: #555; }
      .parties { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 24px; }
      .parties h4 { font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: #888; margin: 0 0 6px; }
      .parties .name { font-weight: bold; font-size: 13px; }
      .parties p { margin: 2px 0; font-size: 12px; color: #444; line-height: 1.5; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      th { background: #f6f3ec; text-align: left; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; color: #666; padding: 10px 12px; border-bottom: 1px solid #e3ddd0; }
      td { padding: 11px 12px; font-size: 13px; border-bottom: 1px solid #eee; vertical-align: top; }
      .c { text-align: center; } .r { text-align: right; } .b { font-weight: bold; }
      .totals { width: 300px; margin-left: auto; }
      .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #444; }
      .totals .row.discount { color: #16a34a; }
      .totals .grand { display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 2px solid ${GOLD}; padding-top: 10px; margin-top: 6px; }
      .totals .grand span:last-child { color: ${GOLD}; }
      .foot { margin-top: 40px; padding-top: 16px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #999; }
      @page { margin: 12mm; }
      @media print { body { padding: 0; } .watermark { position: fixed; } }
    </style>
  </head>
  <body>
    <img class="watermark" src="${logo}" alt="" />
    <div class="sheet">
      <div class="top">
        <div class="brand">
          <img src="${logo}" alt="${esc(invoice.companyInfo.name)}" />
          <div class="addr">${esc(invoice.companyInfo.address)}<br/>${esc(invoice.companyInfo.email)} &middot; ${esc(invoice.companyInfo.phone)}${invoice.companyInfo.gst ? `<br/>GSTIN: ${esc(invoice.companyInfo.gst)}` : ""}</div>
        </div>
        <div class="doc">
          <div class="label">Invoice</div>
          <div class="num">${esc(invoice.invoiceNumber)}</div>
          <div class="date">Issued: ${new Date(invoice.issuedAt).toLocaleDateString("en-IN")}</div>
        </div>
      </div>

      <div class="parties">
        <div>
          <h4>Bill To</h4>
          <p class="name">${esc(customerName)}</p>
          ${addrLines.map((l) => `<p>${esc(l)}</p>`).join("")}
          ${sa.phone ? `<p>${esc(sa.phone)}</p>` : ""}
          ${sa.email ? `<p>${esc(sa.email)}</p>` : ""}
        </div>
        <div style="text-align:right">
          <h4>Order Details</h4>
          <p>Order: ${esc(o.orderNumber)}</p>
          <p>Date: ${new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
          <p>Payment: ${esc(String(o.payment?.method || "—").toUpperCase())}${o.payment?.status ? ` (${esc(o.payment.status)})` : ""}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr><th>Item</th><th class="c">Qty</th><th class="r">Unit Price</th><th class="r">Total</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="totals">
        <div class="row"><span>Subtotal</span><span>${inr(invoice.subtotal)}</span></div>
        ${invoice.discount > 0 ? `<div class="row discount"><span>Discount</span><span>-${inr(invoice.discount)}</span></div>` : ""}
        ${showTax ? `<div class="row"><span>GST (${invoice.taxRate * 100}%)</span><span>${inr(invoice.taxAmount)}</span></div>` : ""}
        <div class="row"><span>Shipping</span><span>${invoice.shippingCost === 0 ? "Free" : inr(invoice.shippingCost)}</span></div>
        <div class="grand"><span>Grand Total</span><span>${inr(invoice.grandTotal)}</span></div>
      </div>

      <div class="foot">Thank you for choosing ${esc(siteConfig.name)}. This is a computer-generated invoice.</div>
    </div>
  </body>
</html>`;
}

/** Opens the invoice in a new window and triggers the print dialog.
 *  Returns false if the pop-up was blocked. */
export function printInvoice(invoice: IInvoice): boolean {
  const html = buildInvoiceHtml(invoice);
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
  // `onload` fires once the logo images have loaded, so they appear in print.
  w.onload = go;
  // Fallback in case onload never fires.
  setTimeout(go, 900);
  return true;
}
