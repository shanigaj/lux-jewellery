"use client";

// Below-the-fold homepage sections that fetch their data on the client anyway.
// Loading them with `ssr: false` keeps them out of the server render, which
// trims the homepage's Worker CPU cost (helping avoid Cloudflare's free-tier
// "resource limits" error) — the visible result is identical, the sections just
// mount a moment later, well below the fold where it isn't noticeable.
import dynamic from "next/dynamic";

const FeaturedProducts = dynamic(
  () => import("./FeaturedProducts").then((m) => m.FeaturedProducts),
  { ssr: false }
);
const BestSellers = dynamic(
  () => import("./BestSellers").then((m) => m.BestSellers),
  { ssr: false }
);
const DiamondCollection = dynamic(
  () => import("./DiamondCollection").then((m) => m.DiamondCollection),
  { ssr: false }
);
const DiamondShowcase = dynamic(
  () => import("./DiamondShowcase").then((m) => m.DiamondShowcase),
  { ssr: false }
);
const InstagramGallery = dynamic(
  () => import("./InstagramGallery").then((m) => m.InstagramGallery),
  { ssr: false }
);

// The four data-driven sections that sit between Collections and the
// consultation banner — kept in their exact original order.
export function LazyHomeMid() {
  return (
    <>
      <FeaturedProducts />
      <BestSellers />
      <DiamondCollection />
      <DiamondShowcase />
    </>
  );
}

// The Instagram gallery, which sits after the consultation banner.
export function LazyInstagram() {
  return <InstagramGallery />;
}
