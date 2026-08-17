"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

const empty = { name: "", email: "", phone: "", subject: "", message: "" };
const EMAIL_RE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

export function ContactForm() {
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email) || !form.message.trim()) {
      toast.error("Please enter your name, a valid email, and a message.");
      return;
    }
    setSending(true);
    try {
      const res = await api.post("/contact", form);
      toast.success(res.data?.message || "Message sent! We'll be in touch soon.");
      setForm(empty);
      setSent(true);
    } catch (error: unknown) {
      const msg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Could not send your message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full bg-background border border-border rounded-[2px] px-4 py-3 text-sm outline-none focus:border-gold transition-colors";
  const label = "text-[11px] uppercase tracking-wider font-medium text-muted-foreground mb-1.5 block";

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2px] border border-border p-10 text-center min-h-[420px]">
        <CheckCircle2 size={44} className="text-gold mb-4" />
        <h2 className="font-heading text-2xl text-foreground mb-2">Message sent</h2>
        <p className="text-sm font-light text-muted-foreground max-w-sm">
          Thank you for reaching out. A member of our team will get back to you shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-gold hover:underline font-medium"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[2px] border border-border p-6 md:p-8 space-y-5">
      <div>
        <h2 className="font-heading text-2xl text-foreground">Send us a message</h2>
        <p className="mt-1.5 text-sm font-light text-muted-foreground">
          Have a question or an enquiry? Fill in the form and we&apos;ll reply by email.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Full name *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" className={input} />
        </div>
        <div>
          <label className={label}>Email *</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Phone</label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91…" className={input} />
        </div>
        <div>
          <label className={label}>Subject</label>
          <input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="e.g. Engagement ring enquiry" className={input} />
        </div>
      </div>

      <div>
        <label className={label}>Message *</label>
        <textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5} placeholder="How can we help?" className={`${input} resize-y`} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-onyx dark:bg-gold px-7 py-4 text-sm font-medium text-white dark:text-onyx transition-all duration-300 hover:bg-gold dark:hover:bg-white hover:text-onyx disabled:opacity-60"
      >
        {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
