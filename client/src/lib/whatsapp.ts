// Utilities for building "Enquire on WhatsApp" deep links.
// The destination number comes from NEXT_PUBLIC_WHATSAPP_NUMBER, which is
// inlined at build time (see client/Dockerfile + docker-compose build args).

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

/** wa.me requires a bare international number — digits only, no "+" or spaces. */
function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

export interface ProductInquiry {
  name: string;
  sku?: string;
  id?: string;
  category?: string;
  /** Selected metal / colour, e.g. "18K Rose Gold". */
  metal?: string;
  /** Selected size, e.g. "US 6". */
  size?: string;
  /** Diamond / product specs summary, e.g. "1.0ct • Pear • F • VVS1". */
  specs?: string;
  /** Link back to the product page. */
  url?: string;
}

/** Compose a human-readable enquiry message with all available product details. */
export function buildInquiryMessage(p: ProductInquiry): string {
  const lines: string[] = [
    "Hello LUX DIAMONDS,",
    "I'm interested in this piece and would like more details:",
    "",
    `*${p.name}*`,
  ];

  if (p.sku) lines.push(`• SKU: ${p.sku}`);
  if (p.id) lines.push(`• Product ID: ${p.id}`);
  if (p.category) lines.push(`• Category: ${p.category}`);
  if (p.metal) lines.push(`• Metal / Colour: ${p.metal}`);
  if (p.size) lines.push(`• Size: ${p.size}`);
  if (p.specs) lines.push(`• Details: ${p.specs}`);
  if (p.url) lines.push(`• Link: ${p.url}`);

  lines.push("", "Could you please share availability and pricing? Thank you!");
  return lines.join("\n");
}

/** Compose a "notify me when back in stock" request. */
export function buildNotifyMeMessage(p: ProductInquiry): string {
  const lines: string[] = [
    "Hello LUX DIAMONDS,",
    "This piece is currently out of stock — please notify me when it's available again:",
    "",
    `*${p.name}*`,
  ];

  if (p.sku) lines.push(`• SKU: ${p.sku}`);
  if (p.metal) lines.push(`• Metal / Colour: ${p.metal}`);
  if (p.size) lines.push(`• Size: ${p.size}`);
  if (p.url) lines.push(`• Link: ${p.url}`);

  lines.push("", "Thank you!");
  return lines.join("\n");
}

/** Build the WhatsApp click-to-chat URL with the message pre-filled. */
export function getWhatsAppUrl(message: string): string {
  const number = normalizeNumber(WHATSAPP_NUMBER);
  const text = encodeURIComponent(message);
  return number
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
}
