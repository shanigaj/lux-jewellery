import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";
import { contactAckEmail, contactNotifyEmail } from "../utils/emailTemplates";
import logger from "../utils/logger";

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

// @desc    Send a contact / enquiry message to the store inbox,
//          and a branded acknowledgment back to the customer.
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body ?? {};

    if (!name || !email || !message || !EMAIL_RE.test(String(email))) {
      res.status(400).json({ success: false, message: "Name, a valid email, and a message are required." });
      return;
    }

    const to = process.env.CONTACT_EMAIL || "contact@sparenza.com";
    const cleanSubject = subject ? String(subject).slice(0, 120) : "General enquiry";

    // 1) Notify the store inbox (primary — if this fails the request fails).
    await sendEmail({
      to,
      replyTo: String(email),
      subject: `New enquiry: ${cleanSubject}`,
      html: contactNotifyEmail({ name, email: String(email), phone, subject: cleanSubject, message }),
    });

    // 2) Acknowledge the customer. Best-effort: a failure here (e.g. the
    //    Resend sending domain isn't verified yet) must NOT break the flow —
    //    the enquiry has already reached the store.
    try {
      await sendEmail({
        to: String(email),
        replyTo: to,
        subject: "We've received your message — Sparenza & Co.",
        html: contactAckEmail({ name, subject: cleanSubject, message }),
      });
    } catch (ackErr) {
      logger.error(`Contact acknowledgment email failed: ${(ackErr as Error).message}`);
    }

    res.status(200).json({ success: true, message: "Thanks! We've received your message and will get back to you shortly." });
  } catch {
    res.status(500).json({ success: false, message: "Sorry, the message could not be sent right now. Please try again or email us directly." });
  }
};
