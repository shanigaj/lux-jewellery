import { Truck, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns | Sparenza & Co.",
  description: "How Sparenza & Co. delivers your jewellery, and our approach to exchanges and returns.",
};

const BLOCKS = [
  {
    icon: Truck,
    title: "Secure, Insured Delivery",
    points: [
      "All orders are shipped fully insured until they reach your hands.",
      "We deliver across India; timelines are confirmed at the time of your enquiry.",
      "Signature is required on delivery for your security.",
    ],
  },
  {
    icon: PackageCheck,
    title: "Packaging",
    points: [
      "Every piece arrives in signature Sparenza & Co. packaging.",
      "Certificates and care details are included where applicable.",
    ],
  },
  {
    icon: RotateCcw,
    title: "Exchanges & Returns",
    points: [
      "If something isn't right, contact us within 14 days of delivery.",
      "Items must be unworn and in original condition with packaging.",
      "Custom-made and personalised pieces are not eligible for return.",
      "See our full Return & Refund Policy for details.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Care",
    points: [
      "Complimentary cleaning and inspection at our boutique.",
      "Reach out any time for repairs or maintenance guidance.",
    ],
  },
];

export default function ShippingReturnsPage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Delivered with Care
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Shipping &amp; <em className="italic text-primary">returns</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          We treat every delivery like the treasure it is. Here&apos;s what to expect —
          for anything specific to your order, just get in touch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl">
        {BLOCKS.map((b) => (
          <div key={b.title} className="rounded-[2px] border border-border p-6">
            <b.icon size={22} className="mb-4 text-gold" />
            <h2 className="mb-3 font-heading text-xl text-foreground">{b.title}</h2>
            <ul className="space-y-2">
              {b.points.map((p) => (
                <li key={p} className="text-sm font-light leading-relaxed text-muted-foreground">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
