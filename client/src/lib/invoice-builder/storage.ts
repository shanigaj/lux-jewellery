// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Invoice Builder: client-side persistence
// ───────────────────────────────────────────────────────────
// Config, saved business details and the running number counter live in
// localStorage so a user's preferred field setup is remembered across
// sessions. Numbers are generated with a per-type prefix + date + counter
// and are editable; the counter guards against accidental reuse on this
// device (true cross-device uniqueness would need the backend).
// ═══════════════════════════════════════════════════════════

import type { BusinessInfo, InvoiceConfig, InvoiceType } from "./types";

const K_CONFIG = "sparenza:invoice:config";
const K_BUSINESS = "sparenza:invoice:business";
const K_COUNTER = "sparenza:invoice:counter";

const PREFIX: Record<InvoiceType, string> = {
  quotation: "QTN",
  proforma: "PI",
  tax_invoice: "INV",
};

function safeGet(key: string): string | null {
  try {
    return typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable / full — ignore */
  }
}

export function loadConfig(): InvoiceConfig | null {
  const raw = safeGet(K_CONFIG);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InvoiceConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: InvoiceConfig): void {
  safeSet(K_CONFIG, JSON.stringify(config));
}

export function loadBusiness(): Partial<BusinessInfo> | null {
  const raw = safeGet(K_BUSINESS);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Partial<BusinessInfo>;
  } catch {
    return null;
  }
}

export function saveBusiness(business: BusinessInfo): void {
  safeSet(K_BUSINESS, JSON.stringify(business));
}

/** Next sequential number for the given type, e.g. INV-20261012-0007.
 *  Advances the stored counter so the same number isn't handed out twice. */
export function nextInvoiceNumber(type: InvoiceType): string {
  const current = parseInt(safeGet(K_COUNTER) || "0", 10) || 0;
  const next = current + 1;
  safeSet(K_COUNTER, String(next));
  return formatNumber(type, next);
}

/** Peek the next number without consuming it (used for the initial draft). */
export function peekInvoiceNumber(type: InvoiceType): string {
  const current = parseInt(safeGet(K_COUNTER) || "0", 10) || 0;
  return formatNumber(type, current + 1);
}

/** Commit the counter after an invoice number has actually been used. */
export function commitInvoiceNumber(): void {
  const current = parseInt(safeGet(K_COUNTER) || "0", 10) || 0;
  safeSet(K_COUNTER, String(current + 1));
}

function formatNumber(type: InvoiceType, seq: number): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}`;
  return `${PREFIX[type]}-${date}-${String(seq).padStart(4, "0")}`;
}

export function prefixForType(type: InvoiceType): string {
  return PREFIX[type];
}
