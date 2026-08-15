"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { Logo } from "@/components/shared/Logo";
import { mainNavigation, type NavItem } from "@/config/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Profile / login is hidden for now — orders are placed directly over
// WhatsApp (no payment system yet). Flip to `true` to bring accounts back.
const SHOW_ACCOUNT = false;

// ── Announcement Bar ──
function AnnouncementBar() {
  const announcements = [
    "Complimentary worldwide shipping on orders above ₹50,000",
    "Every diamond is GIA certified — Authenticity guaranteed",
    "Lifetime exchange & buyback on all collections",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-onyx text-white/90">
      <div className="container-luxury flex items-center justify-between py-2">
        <div className="hidden md:flex items-center gap-4 text-[11px] tracking-wider">
          <a
            href="tel:+916352751091"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <Phone size={11} />
            <span>+91 63527 51091</span>
          </a>
          <span className="w-px h-3 bg-white/20" />
          <a
            href="/stores"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <MapPin size={11} />
            <span>Find a Boutique</span>
          </a>
        </div>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-center text-[11px] tracking-wider font-light"
            >
              {announcements[current]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden md:block text-[11px] tracking-wider">
          <Link href="/book-appointment" className="hover:text-gold transition-colors">
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Desktop Mega Menu ──
function MegaMenu({
  item,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}: {
  item: NavItem;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  if (!item.children) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 right-0 top-full z-50"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="bg-background border-b border-border shadow-luxury-lg">
            <div className="container-luxury py-10">
              <div className="grid grid-cols-4 gap-8">
                {/* Category Links */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onMouseLeave}
                      className="group flex flex-col gap-1.5 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-300"
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors duration-300">
                        {child.label}
                      </span>
                      {child.description && (
                        <span className="text-xs text-muted-foreground font-light leading-relaxed">
                          {child.description}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Featured Image — category based */}
                <Link
                  href={item.href}
                  onClick={onMouseLeave}
                  className="col-span-2 relative rounded-lg overflow-hidden bg-muted aspect-[16/10] group cursor-pointer"
                >
                  <Image
                    src={item.image || "/images/hero-ring.png"}
                    alt={item.label}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <p className="text-[10px] uppercase tracking-luxury text-gold font-medium mb-1">
                      Explore
                    </p>
                    <p className="text-white font-heading text-2xl">
                      {item.label}
                    </p>
                    <p className="text-white/70 text-xs mt-1 font-light">
                      {item.description || `Discover our finest ${item.label.toLowerCase()}`}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Search Overlay ──
function SearchOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
        >
          <div className="container-luxury pt-32">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl text-foreground">Search</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search for rings, necklaces, diamonds..."
                  autoFocus
                  className="w-full pl-8 pr-4 py-4 text-lg bg-transparent border-b-2 border-border focus:border-gold outline-none transition-colors font-light tracking-wide placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="mt-12">
                <p className="text-[10px] uppercase tracking-luxury text-muted-foreground mb-4">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Solitaire Ring",
                    "Tennis Bracelet",
                    "Diamond Studs",
                    "Engagement Ring",
                    "Pendant Necklace",
                    "Eternity Band",
                  ].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      onClick={onClose}
                      className="px-4 py-2 rounded-full border border-border text-sm hover:border-gold hover:text-gold transition-colors duration-300"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Mobile Menu ──
function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger>
        <div
          role="button"
          tabIndex={0}
          className="lg:hidden p-2 -ml-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[340px] p-0 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-center py-8 border-b border-border">
            <Logo size="md" />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4 px-6">
            <Accordion className="w-full">
              {mainNavigation.map((item) => (
                <AccordionItem key={item.href} value={item.href} className="border-none">
                  {item.children ? (
                    <>
                      <AccordionTrigger className="py-4 text-sm font-medium uppercase tracking-wider hover:text-gold hover:no-underline">
                        {item.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-1 pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="py-2.5 text-sm text-muted-foreground hover:text-gold transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex py-4 text-sm font-medium uppercase tracking-wider hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </AccordionItem>
              ))}
            </Accordion>

            <div className="border-t border-border mt-4 pt-4 space-y-1">
              {SHOW_ACCOUNT && (
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User size={18} />
                  Account
                </Link>
              )}
              <Link
                href="/wishlist"
                className="flex items-center gap-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Heart size={18} />
                Wishlist
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border bg-muted/30">
            <a
              href="tel:+916352751091"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors"
            >
              <Phone size={14} />
              +91 63527 51091
            </a>
            <p className="text-xs text-muted-foreground mt-2">
              Mon – Sat: 10 AM – 8 PM
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ══════════════════════════════════════════════════════════════
// 🏛️ HEADER — Main Navigation Component
// ══════════════════════════════════════════════════════════════
export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Wishlist count from the redux store. `mounted` avoids a hydration
  // mismatch: the server renders 0, the client fills in the real count.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const wishlistCount = useAppSelector((state) => state.product.wishlist.length);

  // Live cart count — total quantity across all cart items.
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleMouseEnter = (href: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(href);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150); // Small delay to allow moving mouse into the menu
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <AnnouncementBar />

      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-background border-b border-border/30"
        )}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20 lg:h-28">
            {/* Left: Mobile Menu + Logo (highlighted) */}
            <div className="flex items-center gap-3">
              <MobileMenu />
              <Logo size={isScrolled ? "md" : "lg"} />
            </div>

            {/* Middle-right: Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-auto mr-2">
                {mainNavigation.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 px-4 py-2 text-[13px] font-medium uppercase tracking-wider transition-colors duration-300 hover:text-gold",
                        pathname?.startsWith(item.href)
                          ? "text-gold"
                          : "text-foreground"
                      )}
                    >
                      {item.label}
                      {item.children && (
                        <ChevronDown
                          size={12}
                          className={cn(
                            "transition-transform duration-300",
                            activeMenu === item.href && "rotate-180"
                          )}
                        />
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full hover:bg-muted transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative hidden sm:flex p-2.5 rounded-full hover:bg-muted transition-colors duration-300"
                aria-label={`Wishlist (${wishlistCount} items)`}
              >
                <Heart size={18} />
                {mounted && wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[9px] font-semibold bg-gold text-white rounded-full"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Account — hidden until accounts/payments are enabled */}
              {SHOW_ACCOUNT && (
                <Link
                  href="/account"
                  className="hidden sm:flex p-2.5 rounded-full hover:bg-muted transition-colors duration-300"
                  aria-label="Account"
                >
                  <User size={18} />
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full hover:bg-muted transition-colors duration-300"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[9px] font-semibold bg-gold text-white rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {mainNavigation.map(
          (item) =>
            item.children && (
              <MegaMenu
                key={item.href}
                item={item}
                isOpen={activeMenu === item.href}
                onMouseEnter={() => handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              />
            )
        )}
      </header>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
