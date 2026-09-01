import { HeroBanner } from "@/components/home/HeroBanner";
import { LiveGoldRates } from "@/components/home/LiveGoldRates";
import { Collections } from "@/components/home/Collections";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { BestSellers } from "@/components/home/BestSellers";
import { DiamondCollection } from "@/components/home/DiamondCollection";
import { DiamondShowcase } from "@/components/home/DiamondShowcase";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import type { IMetalRates } from "@/store/api/metalsApi";

// Fetch the live metal rates on the server so the "Today's Metal Rates" cards
// paint real numbers in the first HTML (no skeleton flash) and stay correct even
// if the client-side request is momentarily unavailable. The client query then
// keeps them fresh every 5 minutes.
async function getInitialRates(): Promise<IMetalRates | undefined> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return undefined;
  try {
    const res = await fetch(`${base}/metals/rates`, { next: { revalidate: 300 } });
    if (!res.ok) return undefined;
    const json = await res.json();
    const d = json?.data;
    return d && typeof d.gold24k === "number" ? (d as IMetalRates) : undefined;
  } catch {
    return undefined;
  }
}

export default async function Home() {
  const initialRates = await getInitialRates();

  return (
    <>
      <HeroBanner />
      <LiveGoldRates initialData={initialRates} />
      <Collections />
      <FeaturedProducts />
      <BestSellers />
      <DiamondCollection />
      <DiamondShowcase />
      <InstagramGallery />
    </>
  );
}
