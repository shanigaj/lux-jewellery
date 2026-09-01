// POST /api/contact — ports server/src/controllers/contact.controller.ts.
// Notifies the store inbox (required) and acknowledges the customer (best-effort).
import { Hono } from "hono";
import { sendEmail } from "../lib/email";
import { contactAckEmail, contactNotifyEmail } from "../lib/emailTemplates";
import type { AppEnv } from "../lib/env";

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

export const contact = new Hono<AppEnv>();

contact.post("/", async (c) => {
  const { name, email, phone, subject, message } = await c.req.json().catch(() => ({}) as any);

  if (!name || !email || !message || !EMAIL_RE.test(String(email))) {
    return c.json({ success: false, message: "Name, a valid email, and a message are required." }, 400);
  }

  const to = c.env.CONTACT_EMAIL || "contact@sparenza.com";
  const cleanSubject = subject ? String(subject).slice(0, 120) : "General enquiry";

  try {
    // 1) Notify the store inbox (primary — failure fails the request).
    await sendEmail(c.env, {
      to,
      replyTo: String(email),
      subject: `New enquiry: ${cleanSubject}`,
      html: contactNotifyEmail({ name, email: String(email), phone, subject: cleanSubject, message }),
    });

    // 2) Acknowledge the customer (best-effort).
    try {
      await sendEmail(c.env, {
        to: String(email),
        replyTo: to,
        subject: "We've received your message — Sparenza & Co.",
        html: contactAckEmail({ name, subject: cleanSubject, message }),
      });
    } catch {
      // swallow — the enquiry already reached the store
    }

    return c.json({
      success: true,
      message: "Thanks! We've received your message and will get back to you shortly.",
    });
  } catch {
    return c.json(
      {
        success: false,
        message: "Sorry, the message could not be sent right now. Please try again or email us directly.",
      },
      500
    );
  }
});
