import { BadgeCheck, Repeat, Truck, Gem } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { siteConfig } from "@/config/site";

// Trust strip — the four promises that reassure a first-time buyer. Every piece
// is bespoke / made-to-order, so the fourth pillar leans into custom craft
// rather than returns.
const features = [
  {
    icon: BadgeCheck,
    title: "Certified Diamonds",
    description: "Every stone GIA / BIS certified for cut, colour, clarity & carat.",
  },
  {
    icon: Gem,
    title: "Bespoke, Made to Order",
    description:
      "Each piece hand-crafted to your design and exact gram specifications.",
  },
  {
    icon: Repeat,
    title: "Lifetime Exchange",
    description: "Exchange your piece any time under our lifetime programme.",
  },
  {
    icon: Truck,
    title: "Free Insured Shipping",
    description: `Complimentary insured delivery on orders above ₹${siteConfig.features.freeShippingThreshold.toLocaleString(
      "en-IN"
    )}.`,
  },
];

export function WhySparenza() {
  return (
    <section className="section-padding bg-background border-y border-border/60">
      <div className="container-luxury">
        <AnimatedSection animation="fadeUp" className="text-center mb-14">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            The Sparenza Promise
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Crafted with Trust
          </h2>
          <div className="line-separator mt-4 mb-6" />
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Every Sparenza piece is certified, made to order, and backed by a
            promise that lasts a lifetime.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {features.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              animation="fadeUp"
              delay={index * 0.1}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/5 text-gold">
                <feature.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-[15rem] mx-auto">
                {feature.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
