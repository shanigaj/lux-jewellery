import nodemailer from "nodemailer";
import logger from "./logger";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

// Render blocks outbound SMTP ports (25/465/587), so nodemailer connections time
// out on production. Resend sends over HTTPS (443), which is never blocked — so
// when RESEND_API_KEY is set we use it. SMTP stays as a local-dev fallback.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAIL_FROM = process.env.MAIL_FROM || "Sparenza & Co. <onboarding@resend.dev>";

const port = parseInt(process.env.SMTP_PORT || "587");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port,
  // Port 465 is implicit SSL (secure:true); 587 uses STARTTLS (secure:false).
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Fail fast instead of hanging if the SMTP host is unreachable.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const sendViaResend = async (options: EmailOptions): Promise<void> => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as { id?: string };
  logger.info(`Message sent via Resend: ${data.id}`);
};

const sendViaSmtp = async (options: EmailOptions): Promise<void> => {
  const info = await transporter.sendMail({
    from: `"Sparenza & Co." <${process.env.SMTP_USER}>`,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  logger.info(`Message sent via SMTP: ${info.messageId}`);
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    if (RESEND_API_KEY) {
      await sendViaResend(options);
    } else {
      await sendViaSmtp(options);
    }
  } catch (error: any) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error("Email could not be sent");
  }
};
