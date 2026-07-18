import { HeroBanner } from "@/components/home/HeroBanner";
import { Collections } from "@/components/home/Collections";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { DiamondCollection } from "@/components/home/DiamondCollection";
import { LuxuryWatches } from "@/components/home/LuxuryWatches";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { InstagramGallery } from "@/components/home/InstagramGallery";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <Collections />
      <FeaturedProducts />
      <BestSellers />
      <DiamondCollection />
      <LuxuryWatches />
      <CustomerReviews />
      <InstagramGallery />
    </>
  );
}
