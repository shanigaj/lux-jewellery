"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FAQ_TOPICS, type FaqTopic } from "@/lib/style-assistant-faq";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  linkHref?: string;
  linkLabel?: string;
}

const GREETING: ChatMessage = {
  id: "greeting",
  from: "bot",
  text:
    "Hello! I'm the Sparenza & Co. style assistant. Ask me about sizing, shipping, appointments or bespoke design — or pick a topic below.",
};

export function StyleAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const askTopic = (topic: FaqTopic) => {
    setMessages((prev) => [
      ...prev,
      { id: `${topic.id}-q-${Date.now()}`, from: "user", text: topic.label },
      {
        id: `${topic.id}-a-${Date.now()}`,
        from: "bot",
        text: topic.answer,
        linkHref: topic.linkHref,
        linkLabel: topic.linkLabel,
      },
    ]);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[70vh] max-h-[520px] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-luxury"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-border bg-primary px-4 py-3.5 text-primary-foreground">
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <span id={titleId} className="text-sm font-medium">
                  Style Assistant
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close style assistant"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <p>{m.text}</p>
                    {m.linkHref && (
                      <Link
                        href={m.linkHref}
                        className="mt-1.5 inline-block text-xs font-medium text-gold hover:underline"
                        onClick={() => setOpen(false)}
                      >
                        {m.linkLabel ?? "Learn more"} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick topics */}
            <div className="border-t border-border p-3">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {FAQ_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => askTopic(topic)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1.5 text-[11px] text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <topic.icon size={11} />
                    {topic.label}
                  </button>
                ))}
              </div>
              <a
                href={getWhatsAppUrl(
                  "Hello Sparenza & Co., I have a question and would like to speak with a specialist."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-2.5 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-[#1ebe5b]"
              >
                <Send size={13} /> Chat with a specialist
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close style assistant" : "Open style assistant"}
        aria-expanded={open}
        className="fixed bottom-6 right-4 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-luxury transition-transform hover:scale-105"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center"
          >
            {open ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </button>
    </>
  );
}
