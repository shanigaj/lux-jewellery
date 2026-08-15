import Link from "next/link";
import { ArrowLeft, Gem, Hammer, Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Craftsmanship | Sparenza & Co.",
  description:
    "How Sparenza & Co. jewellery is made — sketch to hand-set stones, mirror-polished settings, and a final inspection before it reaches you.",
  alternates: { canonical: "/about/craftsmanship" },
};

const STEPS = [
  { icon: Gem, title: "Design", text: "Every piece begins as a sketch, refined until the proportion, balance and feel are exactly right." },
  { icon: Hammer, title: "Handcraft", text: "Skilled artisans cast, file and shape each setting by hand, stone by stone." },
  { icon: Sparkles, title: "Finishing", text: "Settings are polished to a mirror finish and detailed in places you may never see." },
  { icon: ShieldCheck, title: "Inspection", text: "Every finished piece is checked for security, comfort and brilliance before it ships." },
];

export default function CraftsmanshipPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <Link href="/about" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Our Story
      </Link>

      <section className="max-w-3xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">The Making</p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Crafts<em className="italic text-primary">manship</em>
        </h1>
        <div className="mt-6 space-y-5 font-light leading-relaxed text-muted-foreground">
          <p>
            Each design begins as a sketch and is brought to life by skilled artisans. Stones are
            hand-set one by one, settings are polished to a mirror finish, and every finished piece is
            inspected before it reaches you.
          </p>
          <p>
            We obsess over the details you can&apos;t always see — the smoothness of a gallery, the
            security of a clasp, the comfort of a band — because those are the things that make a
            piece wearable for a lifetime.
          </p>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <div key={s.title} className="rounded-[2px] border border-border p-6">
            <s.icon size={22} className="mb-4 text-gold" />
            <h3 className="mb-2 font-heading text-lg text-foreground">{s.title}</h3>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">{s.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 max-w-3xl">
        <Link href="/about/sustainability" className="text-sm text-gold hover:underline font-medium">
          Read about our sustainability →
        </Link>
      </section>
    </div>
  );
}
