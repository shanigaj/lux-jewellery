import {
  Ruler,
  Truck,
  RotateCcw,
  CalendarDays,
  Gem,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface FaqTopic {
  id: string;
  label: string;
  icon: LucideIcon;
  answer: string;
  linkHref?: string;
  linkLabel?: string;
}

export const FAQ_TOPICS: FaqTopic[] = [
  {
    id: "sizing",
    label: "Ring & chain sizing",
    icon: Ruler,
    answer:
      "You can measure at home with a strip of string or paper, or book a complimentary in-boutique sizing. Our size guide has full conversion charts for rings, bracelets and necklaces.",
    linkHref: "/size-guide",
    linkLabel: "Open size guide",
  },
  {
    id: "shipping",
    label: "Shipping & delivery",
    icon: Truck,
    answer:
      "We offer complimentary, fully insured express shipping worldwide. Most pieces are handcrafted to order, so please allow 2–3 weeks before dispatch.",
  },
  {
    id: "returns",
    label: "Returns & warranty",
    icon: RotateCcw,
    answer:
      "Returns are accepted within 30 days of delivery, provided the piece is unworn with its original tags and certification. Every piece also carries a lifetime craftsmanship warranty.",
  },
  {
    id: "appointment",
    label: "Book an appointment",
    icon: CalendarDays,
    answer:
      "We'd love to see you — in one of our boutiques or over a private video call. It's complimentary and entirely without obligation.",
    linkHref: "/book-appointment",
    linkLabel: "Book an appointment",
  },
  {
    id: "bespoke",
    label: "Custom / bespoke design",
    icon: Sparkles,
    answer:
      "Compose a piece stone by stone with our Design Your Own studio, or bring your vision to a specialist during a private consultation.",
    linkHref: "/design-your-own",
    linkLabel: "Design your own",
  },
  {
    id: "certification",
    label: "Diamond certification",
    icon: Gem,
    answer:
      "Every diamond over 0.30ct ships with independent GIA, IGI, AGS or HRD certification, verifying its cut, clarity, colour and carat weight.",
  },
  {
    id: "care",
    label: "Care instructions",
    icon: ShieldCheck,
    answer:
      "Store pieces separately to avoid scratching, remove them before swimming or exercising, and have them professionally cleaned and inspected every few months.",
    linkHref: "/care",
    linkLabel: "Read the care guide",
  },
];
