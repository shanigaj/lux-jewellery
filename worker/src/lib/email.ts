// Email via the Resend HTTPS API. nodemailer/SMTP can't run on Workers, and
// Resend was already the production sender on Render.
import type { Bindings } from "./env";

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(env: Bindings, options: EmailOptions): Promise<void> {
  if (!env.RESEND_API_KEY) {
    throw new Error("Email is not configured (RESEND_API_KEY missing)");
  }
  const from = env.MAIL_FROM || "Sparenza & Co. <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}
