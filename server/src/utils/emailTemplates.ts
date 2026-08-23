// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Branded transactional email templates
// ───────────────────────────────────────────────────────────
// Email-client-safe HTML: table layout + fully inline styles,
// web-safe font stacks (Playfair/Inter degrade to serif/sans),
// and the storefront palette (cream / ink / gold / emerald).
// ═══════════════════════════════════════════════════════════

// Brand palette (mirrors client globals.css — must be literal hex in email).
const C = {
  cream: "#F7F3EC",
  card: "#FDFBF6",
  ink: "#1A1A1A",
  muted: "#5C574E",
  gold: "#7E6222",
  goldDark: "#5F4A1A",
  emerald: "#0B5D3B",
  border: "#E4DCCB",
  tile: "#EEE8DC",
};

const BRAND = {
  name: "Sparenza & Co.",
  tagline: "Crafted with Trust. Worn for Life.",
  url: "https://sparenza.com",
  // Public logo (black wordmark incl. tagline). Emails need a hosted URL.
  logo: "https://sparenza.com/images/logo-sparenza-v3.png",
  email: "contact@sparenza.com",
  phone: "+91 99240 36623",
  address:
    "Nana Varachha, Surat, Gujarat 395011, India",
  instagram: "https://www.instagram.com/sparenzajewels/",
};

const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
const sans = "'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Escape the three HTML-significant chars for any user-supplied text. */
export const esc = (s = ""): string =>
  String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

/**
 * Wrap body content in the branded shell (header + footer).
 * `preheader` is the hidden inbox-preview line.
 */
export function emailLayout({
  preheader = "",
  bodyHtml,
}: {
  preheader?: string;
  bodyHtml: string;
}): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${esc(
    preheader
  )}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:8px 0 26px;">
              <a href="${BRAND.url}" style="text-decoration:none;">
                <img src="${BRAND.logo}"
                     alt="Sparenza &amp; Co. — Fine Jewels · ${BRAND.tagline}"
                     width="240"
                     style="display:block;width:240px;max-width:78%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;" />
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:36px 34px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:26px 12px 8px;">
              <div style="font-family:${sans};font-size:13px;color:${C.muted};line-height:1.7;">
                <a href="mailto:${BRAND.email}" style="color:${C.gold};text-decoration:none;">${BRAND.email}</a>
                &nbsp;·&nbsp; ${BRAND.phone}<br>
                ${esc(BRAND.address)}<br>
                <a href="${BRAND.url}" style="color:${C.gold};text-decoration:none;">sparenza.com</a>
                &nbsp;·&nbsp;
                <a href="${BRAND.instagram}" style="color:${C.gold};text-decoration:none;">Instagram</a>
              </div>
              <div style="font-family:${sans};font-size:11px;color:${C.muted};opacity:0.75;margin-top:14px;">
                © ${year} ${BRAND.name}. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Small emerald button (table-based so it renders in Outlook). */
function button(label: string, href: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 6px;">
    <tr>
      <td align="center" style="border-radius:6px;background:${C.emerald};">
        <a href="${href}" style="display:inline-block;padding:13px 30px;font-family:${sans};font-size:14px;font-weight:600;letter-spacing:0.3px;color:${C.cream};text-decoration:none;border-radius:6px;">${label}</a>
      </td>
    </tr>
  </table>`;
}

/** A quoted copy of the enquiry the customer submitted. */
function messageQuote(subject: string, message: string): string {
  return `
  <div style="margin-top:24px;border:1px solid ${C.border};border-radius:8px;overflow:hidden;">
    <div style="background:${C.tile};padding:10px 16px;font-family:${sans};font-size:12px;letter-spacing:0.5px;text-transform:uppercase;color:${C.muted};">
      Your message${subject ? ` · ${esc(subject)}` : ""}
    </div>
    <div style="padding:16px;font-family:${sans};font-size:14px;line-height:1.6;color:${C.ink};white-space:pre-line;">${esc(
    message
  )}</div>
  </div>`;
}

/**
 * Acknowledgment sent TO the customer after they use the contact form,
 * so they know their enquiry was received.
 */
export function contactAckEmail({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}): string {
  const firstName = String(name).trim().split(/\s+/)[0] || "there";
  const body = `
    <h1 style="margin:0 0 14px;font-family:${serif};font-size:24px;font-weight:600;color:${C.ink};line-height:1.25;">
      Thank you for reaching out, ${esc(firstName)}.
    </h1>
    <p style="margin:0 0 14px;font-family:${sans};font-size:15px;line-height:1.7;color:${C.muted};">
      We've received your message and a member of the Sparenza atelier will get back to you
      shortly — usually within one business day. A copy of your enquiry is below for your records.
    </p>
    ${messageQuote(subject, message)}
    <p style="margin:24px 0 0;font-family:${sans};font-size:15px;line-height:1.7;color:${C.muted};">
      In the meantime, feel free to explore our latest handcrafted pieces.
    </p>
    ${button("Explore the Collection", `${BRAND.url}/products`)}
    <p style="margin:22px 0 0;font-family:${sans};font-size:14px;line-height:1.7;color:${C.muted};">
      Warm regards,<br>
      <span style="color:${C.ink};font-weight:600;">The Sparenza &amp; Co. Team</span>
    </p>`;
  return emailLayout({
    preheader: "We've received your message and will get back to you shortly.",
    bodyHtml: body,
  });
}

/**
 * Notification sent TO the store inbox with the enquiry details.
 * (Branded version of the internal alert.)
 */
export function contactNotifyEmail({
  name,
  email,
  phone,
  subject,
  message,
}: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:7px 0;font-family:${sans};font-size:13px;color:${C.muted};width:90px;vertical-align:top;">${label}</td>
      <td style="padding:7px 0;font-family:${sans};font-size:14px;color:${C.ink};">${value}</td>
    </tr>`;
  const body = `
    <h1 style="margin:0 0 4px;font-family:${serif};font-size:22px;font-weight:600;color:${C.ink};">
      New website enquiry
    </h1>
    <p style="margin:0 0 18px;font-family:${sans};font-size:13px;color:${C.gold};letter-spacing:0.5px;">
      ${esc(subject)}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", esc(name))}
      ${row("Email", `<a href="mailto:${esc(email)}" style="color:${C.emerald};text-decoration:none;">${esc(email)}</a>`)}
      ${phone ? row("Phone", esc(phone)) : ""}
    </table>
    ${messageQuote(subject, message)}
    <p style="margin:20px 0 0;font-family:${sans};font-size:12px;color:${C.muted};">
      Reply directly to this email to respond to ${esc(name)}.
    </p>`;
  return emailLayout({
    preheader: `New enquiry from ${esc(name)}`,
    bodyHtml: body,
  });
}
