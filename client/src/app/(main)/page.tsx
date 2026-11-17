import { HeroBanner } from "@/components/home/HeroBanner";
import { WhySparenza } from "@/components/home/WhySparenza";
import { Collections } from "@/components/home/Collections";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";
import { LazyHomeMid, LazyInstagram } from "@/components/home/LazyHomeSections";

export default function Home() {
  return (
    <>
      {/* Above-the-fold stays server-rendered (SEO + fast first paint). */}
      <HeroBanner />
      {/* Live metal-rates section removed — replaced by the trust strip below.
          Re-add <LiveGoldRates /> (and its getInitialRates fetch) to bring it back. */}
      <WhySparenza />
      <Collections />
      {/* Below-the-fold, data-driven sections are client-loaded to keep the
          server render light — same look, same order. */}
      <LazyHomeMid />
      <ConsultationCTA />
      <LazyInstagram />
    </>
  );
}
