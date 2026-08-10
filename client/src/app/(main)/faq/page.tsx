import { Plus } from "lucide-react";

export const metadata = {
  title: "FAQ | Sparenza & Co.",
  description: "Answers to common questions about ordering, pricing, sizing, delivery and care at Sparenza & Co.",
};

const FAQS = [
  {
    q: "Why aren't prices shown on the website?",
    a: "Each piece is offered on an enquiry basis so we can give you accurate, up-to-date pricing and personal guidance. Message us on WhatsApp or use Contact Us and we'll share full details right away.",
  },
  {
    q: "How do I place an order?",
    a: "Browse the collection, then send us an enquiry for the piece you love (via WhatsApp or the Contact page). Our team will confirm availability, price and delivery, and guide you through the rest.",
  },
  {
    q: "Can I customise or resize a piece?",
    a: "Yes. Many designs can be adjusted for size or lightly customised. Share the piece and your requirement with us and we'll let you know what's possible.",
  },
  {
    q: "Do you deliver across India?",
    a: "Yes, we arrange secure, insured delivery across India. Delivery timelines are confirmed at the time of your enquiry. See Shipping & Returns for more.",
  },
  {
    q: "How do I find my ring or bracelet size?",
    a: "Our Size Guide has simple steps to measure at home. If you're unsure, we're happy to help — or visit our Surat boutique for an exact fitting.",
  },
  {
    q: "How should I care for my jewellery?",
    a: "See our Care Instructions page for metal- and stone-specific tips. In short: keep it clean, store pieces separately, and avoid harsh chemicals.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Here to Help
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Frequently asked <em className="italic text-primary">questions</em>
        </h1>
      </div>

      <div className="max-w-3xl divide-y divide-border border-y border-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
              <span className="font-heading text-lg text-foreground">{item.q}</span>
              <Plus
                size={18}
                className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
              />
            </summary>
            <p className="pb-5 pr-8 font-light leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
