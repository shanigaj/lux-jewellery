import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Sparenza & Co. collects, uses, stores and protects your personal information — and the rights you have under India's Digital Personal Data Protection Act.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { h: string; body: string[]; list?: string[] }[] = [
  {
    h: "1. Who we are",
    body: [
      `${siteConfig.name} ("we", "us", "our") operates this website and sells fine, made-to-order diamond and gold jewellery from our boutique in Surat, Gujarat. We are the data fiduciary responsible for the personal information described in this policy.`,
      "This policy explains what we collect, why, how we protect it, and the choices and rights you have. By using this website or making an enquiry, you agree to the practices described here.",
    ],
  },
  {
    h: "2. Information we collect",
    body: ["We collect only what we need to serve you well:"],
    list: [
      "Identity & contact details — your name, phone number, email and delivery/billing address when you enquire, book an appointment or place an order.",
      "Order & preference information — the designs, metals, purity, sizes and specifications you choose, and your communications with us.",
      "Payment information — processed securely by our payment partners; we do not store your full card or bank details on our servers.",
      "Technical & usage data — IP address, device and browser type, and pages visited, collected via cookies and analytics to keep the site working and improve it.",
    ],
  },
  {
    h: "3. How we use your information",
    body: ["We use your information to:"],
    list: [
      "Respond to enquiries, prepare quotations and provide design consultations.",
      "Process, craft, insure and deliver your made-to-order pieces.",
      "Provide after-sales service — resizing, repairs, exchange and buyback.",
      "Verify certification and maintain records required for warranty and hallmarking.",
      "Send you updates about new collections and offers — only where you have consented, and you can opt out at any time.",
      "Meet our legal, tax and accounting obligations, and prevent fraud.",
    ],
  },
  {
    h: "4. Lawful basis & your consent",
    body: [
      "We process your information on the basis of your consent, to perform the contract when you place an order, and to comply with legal obligations. Where processing relies on consent, you may withdraw it at any time by contacting us — this will not affect processing already carried out.",
    ],
  },
  {
    h: "5. Sharing your information",
    body: [
      "We do not sell or rent your personal information. We share it only with trusted parties who help us serve you, and only to the extent needed:",
    ],
    list: [
      "Logistics and insured-delivery partners, to ship your order.",
      "Payment gateways and banks, to process payments securely.",
      "Certification laboratories and hallmarking centres, where relevant to your piece.",
      "IT, hosting and analytics providers who operate our website.",
      "Authorities or regulators, where disclosure is required by law.",
    ],
  },
  {
    h: "6. Cookies",
    body: [
      "We use essential cookies to keep the site secure and working, and optional analytics cookies to understand how the site is used. You can accept, reject or delete cookies through your browser settings at any time; blocking essential cookies may affect how the site functions.",
    ],
  },
  {
    h: "7. Data security",
    body: [
      "Your connection to this site is encrypted with SSL/TLS, and we apply reasonable technical and organisational safeguards — access controls, secure hosting and payment tokenisation — to protect your information. No method of transmission or storage is ever completely secure, but we work continually to keep your data safe.",
    ],
  },
  {
    h: "8. How long we keep your data",
    body: [
      "We retain your information only for as long as needed to fulfil the purposes above and to meet legal, warranty, buyback and accounting requirements. When it is no longer required, we securely delete or anonymise it.",
    ],
  },
  {
    h: "9. Your rights",
    body: [
      "Under India's Digital Personal Data Protection Act, 2023 and applicable law, you have the right to:",
    ],
    list: [
      "Access the personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of your information, subject to our legal retention duties.",
      "Withdraw consent to marketing or other consent-based processing.",
      "Nominate another person to exercise your rights in the event of death or incapacity.",
      "Raise a grievance with us, and escalate to the Data Protection Board of India if unresolved.",
    ],
  },
  {
    h: "10. Children's privacy",
    body: [
      "This website is intended for adults. We do not knowingly collect personal information from children. If you believe a child has provided us information, please contact us and we will delete it.",
    ],
  },
  {
    h: "11. Changes to this policy",
    body: [
      "We may update this policy from time to time to reflect changes in our practices or the law. The latest version will always be posted on this page with a revised date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Your Privacy Matters
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Privacy <em className="italic text-primary">policy</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          We keep only what we need to serve you, protect it carefully, and never sell it. This
          policy explains exactly how.
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
          <h2 className="mb-2 font-heading text-xl text-foreground">Contact & grievances</h2>
          <p className="font-light leading-relaxed text-muted-foreground">
            Questions about this policy, or want to exercise your rights? Email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-gold hover-underline">
              {siteConfig.contact.email}
            </a>{" "}
            or reach us via our{" "}
            <Link href="/contact" className="text-gold hover-underline">
              contact page
            </Link>
            . We aim to respond within a reasonable time.
          </p>
        </section>
      </div>
    </div>
  );
}
