import { Droplets, Gem, ShieldCheck, Sparkles } from "lucide-react";
import { CareReminderButton } from "@/components/shared/CareReminderButton";

export const metadata = {
  title: "Care Instructions",
  description: "How to clean, store and protect your fine jewellery.",
};

const GUIDES = [
  {
    icon: Gem,
    title: "Diamonds",
    tips: [
      "Soak in warm water with a drop of mild dish soap, then brush gently with a soft toothbrush.",
      "Rinse and pat dry with a lint-free cloth — avoid paper towels, which can leave scratches.",
      "Have prongs checked annually; a loose setting is the most common cause of a lost stone.",
    ],
  },
  {
    icon: Sparkles,
    title: "Gold & Rose Gold",
    tips: [
      "Wipe after each wear with a soft cloth to remove oils and lotion residue.",
      "Avoid chlorine and household cleaning chemicals — they can pit and discolour gold alloys.",
      "Store pieces separately in soft pouches to prevent surface scratching.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Platinum",
    tips: [
      "Platinum develops a natural patina over time — this is normal and can be polished back to a mirror finish.",
      "Clean the same way as diamonds: warm water, mild soap, soft brush.",
      "Extremely durable, but still remove before heavy manual work or contact sports.",
    ],
  },
  {
    icon: Droplets,
    title: "Pearls & Coloured Gemstones",
    tips: [
      "Apply perfume, hairspray and lotion before putting jewellery on, never after.",
      "Wipe pearls with a damp soft cloth after wearing — never soak them.",
      "Some gemstones (opal, emerald, pearl) are porous or brittle — avoid ultrasonic cleaners.",
    ],
  },
];

export default function CarePage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Keep It Brilliant
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Care <em className="italic text-primary">instructions</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Fine jewellery is made to last generations — a little routine care keeps it looking its
          best.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl">
        {GUIDES.map((guide) => (
          <div key={guide.title} className="rounded-[2px] border border-border p-6">
            <guide.icon size={22} className="mb-4 text-gold" />
            <h2 className="mb-3 font-heading text-xl text-foreground">{guide.title}</h2>
            <ul className="space-y-2">
              {guide.tips.map((tip) => (
                <li
                  key={tip}
                  className="text-sm font-light leading-relaxed text-muted-foreground"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-2xl rounded-[2px] border border-border bg-card p-8">
        <h2 className="mb-2 font-heading text-2xl text-foreground">
          A gentle nudge, every few months
        </h2>
        <p className="mb-6 font-light leading-relaxed text-muted-foreground">
          Add a recurring reminder to your calendar for a quarterly clean, inspection and prong
          check — complimentary at any Sparenza &amp; Co. boutique.
        </p>
        <CareReminderButton />
      </div>
    </div>
  );
}
