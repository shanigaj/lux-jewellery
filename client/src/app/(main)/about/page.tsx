import { Gem, HandHeart, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Our Story | Sparenza & Co.",
  description:
    "The story, craftsmanship and values behind Sparenza & Co. — fine jewellery made with trust, worn for life.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Trust First", text: "Transparent quality and honest guidance on every piece — no pressure, ever." },
  { icon: Gem, title: "Fine Craft", text: "Hand-finished detailing and hand-set stones on every design we make." },
  { icon: HandHeart, title: "Personal Service", text: "A concierge approach — we help you choose, not just sell." },
  { icon: Leaf, title: "Made to Last", text: "Pieces built to be worn for a lifetime and passed on." },
];

export default function AboutPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      {/* Our Story */}
      <section id="our-story" className="max-w-3xl scroll-mt-24">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Sparenza &amp; Co.
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Our <em className="italic text-primary">story</em>
        </h1>
        <div className="mt-6 space-y-5 font-light leading-relaxed text-muted-foreground">
          <p>
            Sparenza &amp; Co. was founded on a simple belief — that fine jewellery
            should be a source of joy, not intimidation. Every cuff, ring and
            pendant we create is designed to be worn and loved, day after day.
          </p>
          <p>
            From our boutique in Surat, we bring together traditional craftsmanship
            and contemporary design, working closely with each client to find — or
            create — a piece that feels entirely their own. {siteConfig.tagline}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-[2px] border border-border p-6">
            <v.icon size={22} className="mb-4 text-gold" />
            <h3 className="mb-2 font-heading text-lg text-foreground">{v.title}</h3>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">{v.text}</p>
          </div>
        ))}
      </section>

      {/* Explore more */}
      <section className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
        {[
          { href: "/about/craftsmanship", eyebrow: "The Making", title: "Craftsmanship", text: "From sketch to hand-set stones — how every piece is made." },
          { href: "/about/sustainability", eyebrow: "Our Responsibility", title: "Sustainability", text: "Recycled metals, considered quantities, and pieces made to last." },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group rounded-[2px] border border-border p-8 hover:border-gold/50 transition-colors">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">{c.eyebrow}</p>
            <h2 className="font-heading text-2xl text-foreground group-hover:text-gold transition-colors">{c.title}</h2>
            <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{c.text}</p>
            <span className="mt-4 inline-block text-sm font-medium text-gold">Read more →</span>
          </Link>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-[2px] border border-border bg-card p-8 md:p-10 max-w-3xl">
        <h2 className="mb-2 font-heading text-2xl text-foreground">Come say hello</h2>
        <p className="mb-6 font-light leading-relaxed text-muted-foreground">
          Visit our Surat boutique or reach out — we&apos;d love to help you find
          something special.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium text-onyx transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
