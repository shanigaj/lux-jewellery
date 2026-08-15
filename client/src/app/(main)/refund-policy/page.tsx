import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Return & Refund Policy",
  description:
    "Sparenza & Co.'s return, exchange and refund policy — eligibility, timelines, non-returnable items, refund methods, and our lifetime exchange & buyback promise.",
  alternates: { canonical: "/refund-policy" },
};

const SECTIONS = [
  {
    id: "window",
    title: "1. Return & exchange window",
    body: [
      "You may request a return or exchange within 14 days of delivery. To be eligible, the piece must be unworn, undamaged, and returned in its original condition with all packaging, the certificate of authenticity, and any tags intact.",
      "Returns requested after 14 days may, at our discretion, be accepted for store credit or exchange only.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility conditions",
    list: [
      "The item is unworn and shows no signs of wear, resizing, or alteration.",
      "Original packaging, box, and pouch are included.",
      "The GIA/IGI or in-house certificate is returned with the piece.",
      "Proof of purchase (order number or invoice) is provided.",
    ],
  },
  {
    id: "non-returnable",
    title: "3. Non-returnable items",
    body: ["For hygiene, safety and craftsmanship reasons, the following are not eligible for return or refund:"],
    list: [
      "Custom-made, bespoke, or made-to-order pieces.",
      "Engraved or personalised items.",
      "Pierced earrings (hygiene), unless faulty.",
      "Items damaged through misuse, accident, or normal wear.",
      "Gift cards and items marked final sale / clearance.",
    ],
  },
  {
    id: "process",
    title: "4. How to start a return",
    steps: [
      "Contact us within the return window with your order number and reason.",
      "We share a return authorisation and secure, insured return instructions.",
      "Pack the piece with its certificate and packaging, and hand it to the assigned courier.",
      "On receipt, our team inspects the piece (typically within 2–3 business days).",
    ],
  },
  {
    id: "refunds",
    title: "5. Refunds",
    body: [
      "Once your return passes inspection, we process the refund to your original payment method within 7–10 business days. Your bank or card issuer may take additional time to reflect it.",
      "Where a return falls outside the standard window or conditions, we may offer store credit or an exchange instead of a monetary refund.",
      "Original shipping charges (if any) are non-refundable, except where the item was faulty or incorrectly supplied.",
    ],
  },
  {
    id: "exchanges",
    title: "6. Exchanges & resizing",
    body: [
      "Prefer a different size, metal, or design? We are happy to arrange an exchange, subject to availability and any price difference.",
      "Complimentary first resize is offered on eligible rings within 30 days of delivery.",
    ],
  },
  {
    id: "buyback",
    title: "7. Lifetime exchange & buyback",
    body: [
      "As a mark of our confidence in every piece, Sparenza & Co. offers lifetime exchange and buyback on our collections. Exchange and buyback values are based on the prevailing metal rate and diamond valuation on the day of exchange, less applicable deductions, and require the original certificate and invoice.",
    ],
  },
  {
    id: "faulty",
    title: "8. Damaged, faulty or incorrect items",
    body: [
      "If your piece arrives damaged, faulty, or not as described, contact us within 48 hours of delivery with photographs. We will arrange a free replacement, repair, or full refund — including any shipping charges.",
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
          We want you to love your jewellery. If something isn&apos;t right, this policy explains how
          returns, exchanges and refunds work. For anything specific to your order, please{" "}
          <Link href="/contact" className="text-gold hover:underline">get in touch</Link>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: 16 August 2026</p>
      </div>

      <div className="max-w-3xl space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="font-heading text-2xl text-foreground mb-3">{s.title}</h2>
            {s.body?.map((p, i) => (
              <p key={i} className="mb-3 font-light leading-relaxed text-muted-foreground">{p}</p>
            ))}
            {s.list && (
              <ul className="mt-2 space-y-2 list-disc pl-5">
                {s.list.map((li) => (
                  <li key={li} className="font-light leading-relaxed text-muted-foreground">{li}</li>
                ))}
              </ul>
            )}
            {s.steps && (
              <ol className="mt-2 space-y-2 list-decimal pl-5">
                {s.steps.map((st) => (
                  <li key={st} className="font-light leading-relaxed text-muted-foreground">{st}</li>
                ))}
              </ol>
            )}
          </section>
        ))}

        {/* Contact */}
        <section className="rounded-[2px] border border-border bg-card p-8">
          <h2 className="mb-2 font-heading text-xl text-foreground">Need help with a return?</h2>
          <p className="mb-4 font-light leading-relaxed text-muted-foreground">
            Our team is happy to guide you through the process.
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
