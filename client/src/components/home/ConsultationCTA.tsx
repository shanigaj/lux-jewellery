import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

// A dark, editorial conversion banner. For a price-on-consultation catalogue,
// the strongest call to action is a personal appointment rather than a cart.
export function ConsultationCTA() {
  return (
    <section className="relative overflow-hidden bg-onyx text-white section-padding">
      {/* Decorative gold glows (mirrors the newsletter treatment) */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-gold blur-[100px]" />
        <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-gold blur-[80px]" />
      </div>

      <div className="container-luxury relative z-10">
        <AnimatedSection animation="fadeUp" className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 text-gold">
            <CalendarDays size={24} strokeWidth={1.5} />
          </div>
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium mb-4">
            Personal Consultation
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Book a Free Appointment
          </h2>
          <p className="text-white/60 font-light leading-relaxed mb-8">
            Sit with our diamond experts — in person or online — for personalised
            guidance, custom designs, and transparent pricing on the piece of your
            dreams.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/book-appointment"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-[12px] font-medium uppercase tracking-wider text-onyx transition-all duration-300 hover:bg-gold-light hover:shadow-gold"
            >
              Book Appointment
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/design-your-own"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-8 py-4 text-[12px] font-medium uppercase tracking-wider text-white transition-colors duration-300 hover:border-gold/40 hover:text-gold"
            >
              Design Your Own
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
