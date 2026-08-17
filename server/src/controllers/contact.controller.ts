import { Request, Response } from "express";
import { sendEmail } from "../utils/sendEmail";

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
const esc = (s = "") => String(s).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c] as string));

// @desc    Send a contact / enquiry message to the store inbox
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

    await sendEmail({
      to,
      replyTo: String(email),
      subject: `New enquiry: ${cleanSubject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#111">
          <h2 style="margin:0 0 4px">New enquiry from the website</h2>
          <p style="color:#666;margin:0 0 20px">Subject: ${esc(cleanSubject)}</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#666;width:120px">Name</td><td style="padding:6px 0">${esc(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
            ${phone ? `<tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${esc(phone)}</td></tr>` : ""}
          </table>
          <p style="margin:20px 0 6px;color:#666;font-size:13px">Message</p>
          <div style="white-space:pre-line;border:1px solid #eee;border-radius:8px;padding:14px;font-size:14px">${esc(message)}</div>
          <p style="color:#999;font-size:12px;margin-top:20px">Reply directly to this email to respond to ${esc(name)}.</p>
        </div>`,
    });

    res.status(200).json({ success: true, message: "Thanks! We've received your message and will get back to you shortly." });
  } catch {
    res.status(500).json({ success: false, message: "Sorry, the message could not be sent right now. Please try again or email us directly." });
  }
};
