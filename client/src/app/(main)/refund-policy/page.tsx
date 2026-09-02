import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Return & Refund Policy",
  description:
    "Sparenza & Co.'s policy for our made-to-order jewellery — cancellations, our lifetime exchange & buyback promise, resizing, and full protection for damaged, faulty or incorrect items.",
  alternates: { canonical: "/refund-policy" },
};

const SECTIONS = [
  {
    id: "made-to-order",
    title: "1. Made-to-order jewellery",
    body: [
      "Every Sparenza & Co. piece is crafted to order — made uniquely for you in your chosen design, metal, purity and gram weight. Because production begins specifically for your order, our pieces are not eligible for return or refund for a change of mind, an incorrect size or specification chosen at the time of ordering, or buyer's remorse.",
      "Please review your design, size and specifications carefully — and speak with our team for guidance — before you confirm your order.",
    ],
  },
  {
    id: "cancellations",
    title: "2. Cancellations & changes",
    body: [
      "Need to change or cancel? Contact us as soon as possible. While crafting has not yet begun, we can amend or cancel your order and refund any advance paid, less payment-processing charges.",
      "Once crafting of a made-to-order piece has begun, the order can no longer be cancelled or refunded, as work and materials have been committed specifically to your piece.",
    ],
  },
  {
    id: "exchanges",
    title: "3. Exchanges & resizing",
    body: [
      "Prefer a different size, metal or design later on? We are happy to arrange an exchange, subject to availability and any price difference.",
      "A complimentary first resize is offered on eligible rings within 30 days of delivery.",
    ],
  },
  {
    id: "buyback",
    title: "4. Lifetime exchange & buyback",
    body: [
      "As a mark of our confidence in every piece, Sparenza & Co. offers lifetime exchange and buyback on our collections. Exchange and buyback values are based on the prevailing metal rate and diamond valuation on the day of exchange, less applicable deductions, and require the original certificate and invoice.",
    ],
  },
  {
    id: "faulty",
    title: "5. Damaged, faulty or incorrect items",
    body: [
      "Your piece is fully protected. If it arrives damaged, faulty, or not as described, contact us within 48 hours of delivery with photographs. We will arrange a free repair, replacement, or a full refund — including any shipping charges — at no cost to you.",
    ],
  },
  {
    id: "certificate",
    title: "6. Certification",
    body: [
      "Every diamond piece is supplied with its GIA / IGI or in-house certificate. Please keep it safe — it is required for any exchange, resize or buyback.",
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-3xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Shop with Confidence
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Return &amp; Refund <em className="italic text-primary">policy</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Every Sparenza piece is hand-crafted to order for you. This policy explains how
          cancellations, exchanges, resizing and our lifetime exchange &amp; buyback work — and
          how we look after you if a piece ever arrives damaged or not as described. For anything
          specific to your order, please{" "}
          <Link href="/contact" className="text-gold hover:underline">get in touch</Link>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: 2 September 2026</p>
      </div>

      <div className="max-w-3xl space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="font-heading text-2xl text-foreground mb-3">{s.title}</h2>
            {s.body?.map((p, i) => (
              <p key={i} className="mb-3 font-light leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </section>
        ))}

        {/* Contact */}
        <section className="rounded-[2px] border border-border bg-card p-8">
          <h2 className="mb-2 font-heading text-xl text-foreground">Need help with your order?</h2>
          <p className="mb-4 font-light leading-relaxed text-muted-foreground">
            Our team is happy to guide you through cancellations, exchanges and buyback.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Email: <a href={`mailto:${siteConfig.contact.email}`} className="text-gold hover:underline">{siteConfig.contact.email}</a></p>
            <p>Or reach us on <Link href="/contact" className="text-gold hover:underline">our contact page</Link>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
