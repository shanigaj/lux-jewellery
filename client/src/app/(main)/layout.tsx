import { Header } from "@/components/layout/header/Header";
import { Footer } from "@/components/layout/footer/Footer";
import { StyleAssistant } from "@/components/shared/StyleAssistant";
import { FloatingWhatsApp } from "@/components/shared/FloatingWhatsApp";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <StyleAssistant />
      <FloatingWhatsApp />
    </>
  );
}
