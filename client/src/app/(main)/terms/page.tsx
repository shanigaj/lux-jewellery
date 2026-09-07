import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service",
  description:
    "The terms under which Sparenza & Co. provides this website and sells its made-to-order fine jewellery — orders, pricing, certification, warranty and governing law.",
  alternates: { canonical: "/terms" },
};

const SECTIONS: { h: string; body: string[]; list?: string[] }[] = [
  {
    h: "1. Acceptance of these terms",
    body: [
      `By accessing or using this website, or by placing an order with ${siteConfig.name}, you agree to these Terms of Service. Please read them carefully. If you do not agree, kindly do not use the site or place an order.`,
    ],
  },
  {
    h: "2. About our products",
    body: [
      "We sell fine, made-to-order diamond and gold jewellery. Because each piece is individually crafted, slight variations in colour, finish, weight and dimensions may occur and are a natural characteristic of handmade work, not a defect.",
      "Product images are representative. Diamonds and gemstones are natural or laboratory-grown as stated, and every certified stone is supplied with its GIA or IGI report; gold pieces are BIS hallmarked.",
    ],
  },
  {
    h: "3. Pricing",
    body: [
      "Prices reflect prevailing metal rates, diamond valuation and making charges, and may change without notice until an order is confirmed. The price applicable to your order is the one we confirm in writing at the time of order acceptance.",
      "We take care to display accurate prices, but in the event of an obvious pricing or typographical error we reserve the right to correct it and, if necessary, cancel the affected order and refund any amount paid.",
    ],
  },
  {
    h: "4. Orders & acceptance",
    body: [
      "Your enquiry or online order is an offer to purchase. An order is confirmed only once we have acknowledged it and agreed the design, specification, pricing, advance and delivery with you.",
      "As every piece is made to order, crafting begins specifically for you once the order is confirmed and any advance is paid. We reserve the right to decline or cancel an order where necessary — for example, if a product is unavailable or a pricing error has occurred.",
    ],
  },
  {
    h: "5. Payment",
    body: [
      "We accept payment through our listed, secure payment methods. An advance may be required to begin a made-to-order piece. Title to the goods passes to you only once payment has been received in full.",
    ],
  },
  {
    h: "6. Delivery",
    body: [
      "Orders are dispatched fully insured until they reach you, and a signature is required on delivery. Delivery timelines are estimates confirmed at the time of your order and may vary for bespoke work. Please see our",
    ],
  },
  {
    h: "7. Cancellations, exchange & buyback",
    body: [
      "Cancellations, exchanges, resizing and our lifetime exchange & buyback are governed by our Return & Refund Policy, which forms part of these terms. In short: change-of-mind returns are not available on made-to-order pieces, but damaged, faulty or incorrect items are fully protected.",
    ],
  },
  {
    h: "8. Certification & warranty",
    body: [
      "Every certified diamond is supplied with its GIA / IGI or in-house certificate, and gold pieces are BIS hallmarked. Please retain your certificate and invoice — they are required for any resize, exchange or buyback. We warrant our craftsmanship against manufacturing defects; damage from wear, misuse or accident is not covered.",
    ],
  },
  {
    h: "9. Intellectual property",
    body: [
      `All content on this website — including designs, images, text, graphics and logos — is the property of ${siteConfig.name} and is protected by law. You may not copy, reproduce or use it for commercial purposes without our written permission.`,
    ],
  },
  {
    h: "10. Acceptable use",
    body: ["When using this site, you agree not to:"],
    list: [
      "Use it for any unlawful or fraudulent purpose.",
      "Attempt to gain unauthorised access to our systems or interfere with the site's operation.",
      "Copy, scrape or misuse our content, images or designs.",
      "Submit false information or impersonate another person.",
    ],
  },
  {
    h: "11. Limitation of liability",
    body: [
      `To the fullest extent permitted by law, ${siteConfig.name} is not liable for any indirect, incidental or consequential loss arising from the use of this website or our products. Nothing in these terms excludes any liability that cannot be excluded under applicable law.`,
    ],
  },
  {
    h: "12. Governing law & jurisdiction",
    body: [
      "These terms are governed by the laws of India. Any dispute arising out of or relating to them is subject to the exclusive jurisdiction of the courts of Surat, Gujarat.",
    ],
  },
  {
    h: "13. Changes to these terms",
    body: [
      "We may update these terms from time to time. The current version will always be posted on this page with a revised date, and applies to orders placed after it is posted.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          The Fine Print
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Terms of <em className="italic text-primary">service</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          The terms on which we provide this website and craft your jewellery — written plainly, so
          you know exactly where you stand.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: 7 September 2026</p>
      </div>

      <div className="max-w-3xl space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="mb-2 font-heading text-xl text-foreground">{s.h}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mb-3 font-light leading-relaxed text-muted-foreground">
                {p}
                {s.h.startsWith("6.") && i === 0 && (
                  <>
                    {" "}
                    <Link href="/shipping-returns" className="text-gold hover-underline">
                      Shipping &amp; Returns
                    </Link>{" "}
                    page for full details.
                  </>
                )}
              </p>
            ))}
            {s.list && (
              <ul className="mt-1 space-y-2">
                {s.list.map((item) => (
                  <li key={item} className="flex gap-3 font-light leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <section>
          <h2 className="mb-2 font-heading text-xl text-foreground">Contact</h2>
          <p className="font-light leading-relaxed text-muted-foreground">
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-gold hover-underline">
              {siteConfig.contact.email}
            </a>{" "}
            or via our{" "}
            <Link href="/contact" className="text-gold hover-underline">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
