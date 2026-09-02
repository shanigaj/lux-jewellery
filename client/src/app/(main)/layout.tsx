import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { StyleAssistant } from "@/components/shared/StyleAssistant";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { ScrollToTop } from "@/components/shared/ScrollToTop";
import type { MetalTickerRates } from "@/components/layout/header/LivePriceTicker";

// Fetch the metal rates on the server so the top-bar ticker paints the correct
// numbers in the first HTML instead of flashing stale fallbacks, then updating
// a few seconds later once the client request lands. Cached for 5 minutes
// (the backend itself only recomputes hourly), and it degrades to the client
// fetch / indicative fallback if the API is momentarily unreachable.
async function getInitialRates(): Promise<MetalTickerRates | undefined> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return undefined;
  try {
    const res = await fetch(`${base}/metals/rates`, { next: { revalidate: 300 } });
    if (!res.ok) return undefined;
    const json = await res.json();
    const d = json?.data;
    if (!d || typeof d.gold24k !== "number") return undefined;
    return { gold24k: d.gold24k, gold22k: d.gold22k, silver: d.silver };
  } catch {
    return undefined;
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialRates = await getInitialRates();

  return (
    <>
      <ScrollToTop />
      <Header initialRates={initialRates} />
      <main className="flex-1">{children}</main>
      <Footer />
      <StyleAssistant />
      <FloatingWhatsApp />
    </>
  );
}
