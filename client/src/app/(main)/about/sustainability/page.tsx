import Link from "next/link";
import { ArrowLeft, Leaf, Recycle, Package, Timer } from "lucide-react";

export const metadata = {
  title: "Sustainability | Sparenza & Co.",
  description:
    "Sparenza & Co.'s approach to responsible jewellery — considered quantities, recycled metals, minimal packaging, and pieces designed to last a lifetime.",
  alternates: { canonical: "/about/sustainability" },
};

const PILLARS = [
  { icon: Timer, title: "Made to Last", text: "A piece worn for decades is the most sustainable choice of all." },
  { icon: Recycle, title: "Recycled Metals", text: "We reuse and recycle precious metals wherever possible." },
  { icon: Leaf, title: "Considered Quantities", text: "We craft in measured runs — quality over fast-fashion churn." },
  { icon: Package, title: "Minimal Packaging", text: "Packaging is kept minimal and reusable, with waste reduced across the board." },
];

export default function SustainabilityPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <Link href="/about" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Our Story
      </Link>

      <section className="max-w-3xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">Our Responsibility</p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Sustain<em className="italic text-primary">ability</em>
        </h1>
        <div className="mt-6 space-y-5 font-light leading-relaxed text-muted-foreground">
          <p>
            We craft in considered quantities, favour lasting quality over fast-fashion churn, and
            reuse and recycle metals wherever possible. A piece designed to be worn for decades is, in
            itself, the most sustainable choice.
          </p>
          <p>
            Packaging is kept minimal and reusable, and we are continually working to reduce waste
            across everything we do.
          </p>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="rounded-[2px] border border-border p-6">
            <p.icon size={22} className="mb-4 text-gold" />
            <h3 className="mb-2 font-heading text-lg text-foreground">{p.title}</h3>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 max-w-3xl">
        <Link href="/about/craftsmanship" className="text-sm text-gold hover:underline font-medium">
          See how we craft each piece →
        </Link>
      </section>
    </div>
  );
}
