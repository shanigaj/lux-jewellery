import { HeroBanner } from "@/components/home/HeroBanner";
import { WhySparenza } from "@/components/home/WhySparenza";
import { Collections } from "@/components/home/Collections";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { DiamondCollection } from "@/components/home/DiamondCollection";
import { DiamondShowcase } from "@/components/home/DiamondShowcase";
import { ConsultationCTA } from "@/components/home/ConsultationCTA";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export default function Home() {
  return (
    <>
      <HeroBanner />
      {/* Live metal-rates section removed — replaced by the trust strip below.
          Re-add <LiveGoldRates /> (and its getInitialRates fetch) to bring it back. */}
      <WhySparenza />
      <Collections />
      <FeaturedProducts />
      <BestSellers />
      <DiamondCollection />
      <DiamondShowcase />
      <ConsultationCTA />
      <InstagramGallery />
    </>
  );
}
