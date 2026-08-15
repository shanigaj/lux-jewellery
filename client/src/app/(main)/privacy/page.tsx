import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description: "How Sparenza & Co. collects, uses and protects your personal information.",
};

const SECTIONS = [
  {
    h: "Information We Collect",
    p: "We collect information you provide directly — such as your name, phone number, email and delivery address when you make an enquiry or place an order — along with basic usage data (like pages visited) that helps us improve the site.",
  },
  {
    h: "How We Use Your Information",
    p: "We use your information to respond to enquiries, process and deliver orders, provide customer support, and — only with your consent — send you occasional updates about new collections and offers.",
  },
  {
    h: "Sharing",
    p: "We do not sell your personal information. We share it only with trusted partners who help us operate (for example, delivery and payment providers) and only to the extent needed to serve you.",
  },
  {
    h: "Cookies",
    p: "We use essential cookies to keep the site working and optional cookies to understand usage. You can control cookies through your browser settings at any time.",
  },
  {
    h: "Data Security",
    p: "We take reasonable technical and organisational measures to protect your information. No method of transmission over the internet is ever completely secure, but we work to safeguard your data.",
  },
  {
    h: "Your Rights",
    p: "You may request access to, correction of, or deletion of your personal information at any time by contacting us.",
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
            Questions about this policy? Email us at{" "}
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
