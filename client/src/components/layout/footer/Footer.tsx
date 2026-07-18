"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Share2,
  ExternalLink,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

// ── Newsletter Section ──
function Newsletter() {
  return (
    <div className="relative overflow-hidden bg-onyx text-white py-16 md:py-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gold blur-[80px]" />
      </div>

      <div className="container-luxury relative z-10">
        <AnimatedSection animation="fadeUp" className="max-w-xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-luxury-wide text-gold mb-4">
            The Lux Diamond Circle
          </p>
          <h3 className="font-heading text-2xl md:text-3xl text-white mb-3">
            Join Our World of Luxury
          </h3>
          <p className="text-sm text-white/60 font-light leading-relaxed mb-8">
            Be the first to discover new collections, exclusive events, and
            receive curated insights into the world of fine diamonds.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-3.5 bg-white/10 border border-white/15 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors"
              required
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-onyx text-sm font-medium rounded-full hover:bg-gold-light transition-all duration-300 hover:shadow-gold"
            >
              Subscribe
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>

          <p className="text-[10px] text-white/30 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </AnimatedSection>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// 🏛️ FOOTER — Premium Footer Component
// ══════════════════════════════════════════════════════════════
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Newsletter />

      <footer className="bg-background border-t border-border">
        {/* Main Footer */}
        <div className="container-luxury py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Logo size="lg" showTagline className="mb-6" />

              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs mt-6">
                Since 2024, we have been crafting extraordinary diamond
                jewellery that celebrates life&apos;s most precious moments.
              </p>

              {/* Contact Info */}
              <div className="mt-8 space-y-3">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors group"
                >
                  <Phone size={14} className="text-gold" />
                  <span>{siteConfig.contact.phone}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors group"
                >
                  <Mail size={14} className="text-gold" />
                  <span>{siteConfig.contact.email}</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-gold mt-0.5" />
                  <span>{siteConfig.contact.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock size={14} className="text-gold" />
                  <span>Mon – Sat: 10 AM – 8 PM</span>
                </div>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-luxury font-semibold text-foreground mb-6">
                Shop
              </h4>
              <ul className="space-y-3">
                {footerNavigation.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-luxury font-semibold text-foreground mb-6">
                About
              </h4>
              <ul className="space-y-3">
                {footerNavigation.about.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-luxury font-semibold text-foreground mb-6">
                Support
              </h4>
              <ul className="space-y-3">
                {footerNavigation.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-[11px] uppercase tracking-luxury font-semibold text-foreground mb-6">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerNavigation.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-gold transition-colors duration-300 hover-underline inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Bottom Bar */}
        <div className="container-luxury py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-xs text-muted-foreground font-light tracking-wide">
              © {currentYear} LUX DIAMONDS. All rights reserved. Crafted with passion in India.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-luxury text-muted-foreground hidden sm:block">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                {[
                  { icon: Globe, href: siteConfig.social.instagram, label: "Instagram" },
                  { icon: Share2, href: siteConfig.social.facebook, label: "Facebook" },
                  { icon: ExternalLink, href: siteConfig.social.youtube, label: "YouTube" },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-gold hover:border-gold/30 transition-colors duration-300"
                    aria-label={label}
                  >
                    <Icon size={14} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-wider">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                SSL Secured
              </span>
              <span>•</span>
              <span>GIA Certified</span>
              <span>•</span>
              <span>BIS Hallmarked</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
