import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms of Service | Sparenza & Co.",
  description: "The terms under which Sparenza & Co. provides this website and its products.",
};

const SECTIONS = [
  {
    h: "Overview",
    p: "By accessing and using this website, you agree to these terms. Please read them carefully. If you do not agree, kindly do not use the site.",
  },
  {
    h: "Products & Enquiries",
    p: "Product images are representative; slight variations in colour, size and finish may occur as pieces are individually crafted. Prices and availability are confirmed at the time of your enquiry and may change without notice.",
  },
  {
    h: "Orders",
    p: "An order is confirmed only once we have acknowledged it and agreed pricing, availability and delivery with you. We reserve the right to decline or cancel an order where necessary.",
  },
  {
    h: "Intellectual Property",
    p: "All content on this site — including designs, images, text and logos — is the property of Sparenza & Co. and may not be used without our written permission.",
  },
  {
    h: "Limitation of Liability",
    p: "To the extent permitted by law, Sparenza & Co. is not liable for any indirect or consequential loss arising from the use of this website.",
  },
  {
    h: "Governing Law",
    p: "These terms are governed by the laws of India, and any disputes are subject to the jurisdiction of the courts of Surat, Gujarat.",
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
      </div>

      <div className="max-w-3xl space-y-8">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="mb-2 font-heading text-xl text-foreground">{s.h}</h2>
            <p className="font-light leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <section>
          <h2 className="mb-2 font-heading text-xl text-foreground">Contact</h2>
          <p className="font-light leading-relaxed text-muted-foreground">
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-gold hover-underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
