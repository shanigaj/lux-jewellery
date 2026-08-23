"use client";

import { useState } from "react";
import { Mail, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";
import type { ProductInquiry } from "@/lib/whatsapp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

/** A plain-text enquiry body pre-filled with the product the customer is viewing. */
function buildPrefill(p: ProductInquiry): string {
  const lines = [
    "Hello Sparenza & Co.,",
    "",
    "I'm interested in this piece and would like to know more about availability and pricing:",
    "",
    p.name,
  ];
  if (p.sku) lines.push(`SKU: ${p.sku}`);
  if (p.metal) lines.push(`Metal / Colour: ${p.metal}`);
  if (p.size) lines.push(`Size: ${p.size}`);
  if (p.url) lines.push(`Link: ${p.url}`);
  lines.push("", "Thank you!");
  return lines.join("\n");
}

/**
 * Email-based product enquiry — a phone-free alternative to WhatsApp for
 * customers (especially international) who'd rather not share a number.
 * Submits to the same /contact endpoint, so the customer receives the
 * branded acknowledgment email and the store gets the enquiry.
 */
export function EmailInquiryButton({
  inquiry,
  className,
  label = "Enquire by Email",
}: {
  inquiry: ProductInquiry;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: buildPrefill(inquiry),
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email) || !form.message.trim()) {
      toast.error("Please enter your name, a valid email, and a message.");
      return;
    }
    setSending(true);
    try {
      const res = await api.post("/contact", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Product enquiry: ${inquiry.name}`,
        message: form.message,
      });
      toast.success(res.data?.message || "Enquiry sent! We'll be in touch by email shortly.");
      setOpen(false);
      setForm((f) => ({ ...f, name: "", email: "", phone: "" }));
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Could not send your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full bg-background border border-border rounded-[2px] px-4 py-2.5 text-sm outline-none focus:border-gold transition-colors";
  const labelCls = "text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5 block";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        aria-label={label}
        className={cn(
          "inline-flex items-center justify-center gap-2 py-4 px-8 text-sm font-medium uppercase tracking-wider transition-colors",
          "border border-border text-foreground hover:border-gold hover:text-gold",
          className
        )}
      >
        <Mail size={18} />
        {label}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Enquire about this piece</DialogTitle>
          <DialogDescription className="text-sm">
            Prefer not to use WhatsApp? Send us an email enquiry and we&apos;ll reply to your inbox.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Full name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={input} />
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className={input} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Phone (optional)</label>
            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+…" className={input} />
          </div>

          <div>
            <label className={labelCls}>Message *</label>
            <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={6} className={`${input} resize-y`} />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-onyx dark:bg-gold px-7 py-3.5 text-sm font-medium text-white dark:text-onyx transition-all duration-300 hover:bg-gold dark:hover:bg-white hover:text-onyx disabled:opacity-60"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {sending ? "Sending…" : "Send enquiry"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
