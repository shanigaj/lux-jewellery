// ═══════════════════════════════════════════════════════════
// 💎 Sparenza & Co. — Branded transactional email templates
// ───────────────────────────────────────────────────────────
// Email-client-safe HTML: table layout + inline styles (light-mode
// base) PLUS a <style> block that adapts to the reader's device theme
// (prefers-color-scheme: dark — swaps colours and the logo) and to
// small screens. Web-safe font stacks degrade Playfair/Inter to
// serif/sans.
// ═══════════════════════════════════════════════════════════

// Light palette (mirrors client globals.css :root).
const C = {
  cream: "#F7F3EC",
  card: "#FDFBF6",
  ink: "#1A1A1A",
  muted: "#5C574E",
  gold: "#7E6222",
  emerald: "#0B5D3B",
  border: "#E4DCCB",
  tile: "#EEE8DC",
};

// Dark palette (mirrors client globals.css dark theme) — applied via
// prefers-color-scheme in supporting clients (Apple Mail, iOS Mail, Outlook).
const D = {
  bg: "#0C0B09",
  card: "#161412",
  ink: "#F5F0E8",
  muted: "#B8B0A2",
  gold: "#C9A96E",
  border: "#2A2620",
  tile: "#221F19",
};

const BRAND = {
  name: "Sparenza & Co.",
  tagline: "Crafted with Trust. Worn for Life.",
  url: "https://sparenza.com",
  // Two hosted variants: dark wordmark for light mode, light wordmark for dark.
  logo: "https://sparenza.com/images/logo-sparenza-v3.png",
  logoLight: "https://sparenza.com/images/logo-sparenza-v3-light.png",
  email: "contact@sparenza.com",
  phone: "+91 99240 36623",
  address: "Nana Varachha, Surat, Gujarat 395011, India",
  instagram: "https://www.instagram.com/sparenzajewels/",
};

const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
const sans = "'Inter', -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/** Escape the three HTML-significant chars for any user-supplied text. */
export const esc = (s = ""): string =>
  String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

// Theme-adaptive + responsive rules. Classes override the inline light-mode
// styles; !important is required to win over inline styles in email clients.
const STYLE = `
  body, table, td { margin:0; padding:0; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  .logo-dark { display:none; }

  @media (prefers-color-scheme: dark) {
    .email-bg    { background:${D.bg} !important; }
    .email-card  { background:${D.card} !important; border-color:${D.border} !important; }
    .t-ink       { color:${D.ink} !important; }
    .t-muted     { color:${D.muted} !important; }
    .t-gold, .t-gold a { color:${D.gold} !important; }
    .email-quote      { border-color:${D.border} !important; }
    .email-quote-head { background:${D.tile} !important; color:${D.muted} !important; }
    .logo-light  { display:none !important; }
    .logo-dark   { display:block !important; }
    .divider     { border-color:${D.border} !important; }
  }

  @media only screen and (max-width: 600px) {
    .email-card  { padding:26px 20px !important; }
    .h1          { font-size:21px !important; line-height:1.3 !important; }
    .logo-img    { width:200px !important; max-width:64% !important; }
    .quote-body  { padding:14px !important; }
  }
`;

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
  const logoImg = (cls: string, src: string) =>
    `<img class="logo-img ${cls}" src="${src}" alt="Sparenza &amp; Co. — Fine Jewels · ${BRAND.tagline}" width="240" style="display:${
      cls === "logo-dark" ? "none" : "block"
    };width:240px;max-width:78%;height:auto;margin:0 auto;border:0;outline:none;" />`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${BRAND.name}</title>
  <style>${STYLE}</style>
</head>
<body class="email-bg" style="margin:0;padding:0;background:${C.cream};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;mso-hide:all;">${esc(
    preheader
  )}</span>
  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;">

          <!-- Header (logo swaps with the reader's theme) -->
          <tr>
            <td align="center" style="padding:8px 0 26px;">
              <a href="${BRAND.url}">
                ${logoImg("logo-light", BRAND.logo)}
                ${logoImg("logo-dark", BRAND.logoLight)}
              </a>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="email-card" style="background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:36px 34px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:26px 12px 8px;">
              <div class="t-muted" style="font-family:${sans};font-size:13px;color:${C.muted};line-height:1.7;">
                <a class="t-gold" href="mailto:${BRAND.email}" style="color:${C.gold};text-decoration:none;">${BRAND.email}</a>
                &nbsp;·&nbsp; ${BRAND.phone}<br>
                ${esc(BRAND.address)}<br>
                <a class="t-gold" href="${BRAND.url}" style="color:${C.gold};text-decoration:none;">sparenza.com</a>
                &nbsp;·&nbsp;
                <a class="t-gold" href="${BRAND.instagram}" style="color:${C.gold};text-decoration:none;">Instagram</a>
              </div>
              <div class="t-muted" style="font-family:${sans};font-size:11px;color:${C.muted};opacity:0.75;margin-top:14px;">
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

/** Emerald button (table-based so it renders in Outlook; emerald reads on both themes). */
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
  <div class="email-quote" style="margin-top:24px;border:1px solid ${C.border};border-radius:8px;overflow:hidden;">
    <div class="email-quote-head" style="background:${C.tile};padding:10px 16px;font-family:${sans};font-size:12px;letter-spacing:0.5px;text-transform:uppercase;color:${C.muted};">
      Your message${subject ? ` · ${esc(subject)}` : ""}
    </div>
    <div class="t-ink quote-body" style="padding:16px;font-family:${sans};font-size:14px;line-height:1.6;color:${C.ink};white-space:pre-line;">${esc(
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
    <h1 class="t-ink h1" style="margin:0 0 14px;font-family:${serif};font-size:24px;font-weight:600;color:${C.ink};line-height:1.25;">
      Thank you for reaching out, ${esc(firstName)}.
    </h1>
    <p class="t-muted" style="margin:0 0 14px;font-family:${sans};font-size:15px;line-height:1.7;color:${C.muted};">
      We've received your message and a member of the Sparenza atelier will get back to you
      shortly — usually within one business day. A copy of your enquiry is below for your records.
    </p>
    ${messageQuote(subject, message)}
    <p class="t-muted" style="margin:24px 0 0;font-family:${sans};font-size:15px;line-height:1.7;color:${C.muted};">
      In the meantime, feel free to explore our latest handcrafted pieces.
    </p>
    ${button("Explore the Collection", `${BRAND.url}/products`)}
    <p class="t-muted" style="margin:22px 0 0;font-family:${sans};font-size:14px;line-height:1.7;color:${C.muted};">
      Warm regards,<br>
      <span class="t-ink" style="color:${C.ink};font-weight:600;">The Sparenza &amp; Co. Team</span>
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
      <td class="t-muted" style="padding:7px 0;font-family:${sans};font-size:13px;color:${C.muted};width:90px;vertical-align:top;">${label}</td>
      <td class="t-ink" style="padding:7px 0;font-family:${sans};font-size:14px;color:${C.ink};">${value}</td>
    </tr>`;
  const body = `
    <h1 class="t-ink h1" style="margin:0 0 4px;font-family:${serif};font-size:22px;font-weight:600;color:${C.ink};">
      New website enquiry
    </h1>
    <p class="t-gold" style="margin:0 0 18px;font-family:${sans};font-size:13px;color:${C.gold};letter-spacing:0.5px;">
      ${esc(subject)}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row("Name", esc(name))}
      ${row("Email", `<a class="t-gold" href="mailto:${esc(email)}" style="color:${C.emerald};text-decoration:none;">${esc(email)}</a>`)}
      ${phone ? row("Phone", esc(phone)) : ""}
    </table>
    ${messageQuote(subject, message)}
    <p class="t-muted" style="margin:20px 0 0;font-family:${sans};font-size:12px;color:${C.muted};">
      Reply directly to this email to respond to ${esc(name)}.
    </p>`;
  return emailLayout({
    preheader: `New enquiry from ${esc(name)}`,
    bodyHtml: body,
  });
}
