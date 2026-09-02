import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { StyleAssistant } from "@/components/shared/StyleAssistant";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

// Metal rates now load on the client (LivePriceTicker fetches them and shows an
// indicative fallback first), so the layout no longer makes a blocking server
// fetch on every page. That keeps the per-request Worker render light — the main
// lever against Cloudflare's free-tier "resource limits" (Error 1102).
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StyleAssistant />
      <FloatingWhatsApp />
    </>
  );
}
