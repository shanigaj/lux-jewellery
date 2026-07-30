import { SizeGuideContent } from "@/components/shared/SizeGuideContent";

export const metadata = {
  title: "Size Guide | Sparenza & Co.",
  description: "Find your perfect fit for rings, bracelets, bangles and necklaces.",
};

export default function SizeGuidePage() {
  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Fit, Perfected
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Size <em className="italic text-primary">guide</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          A precise fit matters as much as the piece itself. Use the charts below, or book a
          complimentary in-boutique sizing with a specialist.
        </p>
      </div>

      <div className="max-w-3xl">
        <SizeGuideContent />
      </div>
    </div>
  );
}
