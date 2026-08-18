import nodemailer from "nodemailer";
import logger from "./logger";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

const port = parseInt(process.env.SMTP_PORT || "587");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port,
  // Port 465 is implicit SSL and MUST use secure:true. Sending secure:false on
  // 465 makes the socket hang forever waiting on a TLS handshake — which stalls
  // the whole request. 587 uses STARTTLS (secure:false).
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Fail fast instead of hanging if the SMTP host is unreachable/misconfigured,
  // so the API always responds and the UI never spins indefinitely.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Sparenza & Co." <${process.env.SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    logger.info(`Message sent: ${info.messageId}`);
  } catch (error: any) {
    logger.error(`Error sending email: ${error.message}`);
    throw new Error("Email could not be sent");
  }
};
