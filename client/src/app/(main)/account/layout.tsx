"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  CalendarDays,
  Gift,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Overview", href: "/account", icon: User, exact: true },
  { name: "Profile Details", href: "/account/profile", icon: User },
  { name: "Orders & Returns", href: "/account/orders", icon: Package },
  { name: "Wishlist", href: "/account/wishlist", icon: Heart },
  { name: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
  { name: "Appointments", href: "/account/appointments", icon: CalendarDays },
  { name: "Rewards & Referrals", href: "/account/rewards", icon: Gift },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generate breadcrumb label based on pathname
  const currentLink = sidebarLinks.find((link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href)
  );
  const breadcrumbLabel = currentLink ? currentLink.name : "My Account";

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="container-luxury py-8">
        <Breadcrumb items={[{ label: breadcrumbLabel }]} />

        <div className="mt-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-muted/30 p-4 border border-border rounded-xl">
            <span className="font-medium">{breadcrumbLabel}</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={mobileMenuOpen ? "Close account menu" : "Open account menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Sidebar — always in the DOM; shown on desktop, toggled on mobile
              via CSS (no window-width read, so no hydration mismatch). */}
          <aside
            className={cn(
              "lg:w-64 flex-shrink-0 lg:block",
              mobileMenuOpen ? "block" : "hidden"
            )}
          >
                <div className="sticky top-24 space-y-8">
                  {/* User Info Brief */}
                  <div className="pb-6 border-b border-border">
                    <h2 className="font-heading text-xl">Welcome, Priya</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Platinum Member
                    </p>
                  </div>

                  {/* Nav Links */}
                  <nav className="space-y-1">
                    {sidebarLinks.map((link) => {
                      const isActive = link.exact
                        ? pathname === link.href
                        : pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
                            isActive
                              ? "bg-gold/10 text-gold"
                              : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <link.icon size={18} />
                            {link.name}
                          </div>
                          {isActive && (
                            <ChevronRight size={16} className="text-gold" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Logout */}
                  <div className="pt-6 border-t border-border">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
