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

      {/* Craftsmanship */}
      <section id="craftsmanship" className="mt-20 max-w-3xl scroll-mt-24">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          The Making
        </p>
        <h2 className="font-heading text-3xl text-foreground md:text-4xl">
          Craftsmanship
        </h2>
        <div className="mt-6 space-y-5 font-light leading-relaxed text-muted-foreground">
          <p>
            Each design begins as a sketch and is brought to life by skilled
            artisans. Stones are hand-set one by one, settings are polished to a
            mirror finish, and every finished piece is inspected before it reaches
            you.
          </p>
          <p>
            We obsess over the details you can&apos;t always see — the smoothness of
            a gallery, the security of a clasp, the comfort of a band — because
            those are the things that make a piece wearable for a lifetime.
          </p>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="mt-20 max-w-3xl scroll-mt-24">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Our Responsibility
        </p>
        <h2 className="font-heading text-3xl text-foreground md:text-4xl">
          Sustainability
        </h2>
        <div className="mt-6 space-y-5 font-light leading-relaxed text-muted-foreground">
          <p>
            We craft in considered quantities, favour lasting quality over
            fast-fashion churn, and reuse and recycle metals wherever possible.
            A piece designed to be worn for decades is, in itself, the most
            sustainable choice.
          </p>
          <p>
            Packaging is kept minimal and reusable, and we are continually working
            to reduce waste across everything we do.
          </p>
        </div>
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
