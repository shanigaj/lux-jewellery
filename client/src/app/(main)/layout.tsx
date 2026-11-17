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
      {/* Keyboard/screen-reader skip link — first focusable element, hidden
          until focused. Jumps past the header nav to the main content. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-onyx focus:shadow-lg"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <StyleAssistant />
      <FloatingWhatsApp />
    </>
  );
}
