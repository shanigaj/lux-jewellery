"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { footerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

// ── Brand icons (lucide-react drops brand glyphs, so inline the SVGs) ──
type BrandIconProps = { size?: number; className?: string };

function InstagramIcon({ size = 14, className }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 14, className }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function YoutubeIcon({ size = 14, className }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  );
}

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
            The Sparenza Circle
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
                {siteConfig.contact.phones.map((num) => (
                  <a
                    key={num}
                    href={`tel:${num.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors group"
                  >
                    <Phone size={14} className="text-gold shrink-0" />
                    <span>{num}</span>
                  </a>
                ))}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors group"
                >
                  <Mail size={14} className="text-gold shrink-0" />
                  <span>{siteConfig.contact.email}</span>
                </a>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
                  <span>{siteConfig.contact.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock size={14} className="text-gold shrink-0" />
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
              © {currentYear} Sparenza &amp; Co. All rights reserved. Crafted with passion in India.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-luxury text-muted-foreground hidden sm:block">
                Follow Us
              </span>
              <div className="flex items-center gap-2">
                {[
                  { icon: InstagramIcon, href: siteConfig.social.instagram, label: "Instagram" },
                  { icon: FacebookIcon, href: siteConfig.social.facebook, label: "Facebook" },
                  { icon: YoutubeIcon, href: siteConfig.social.youtube, label: "YouTube" },
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
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground tracking-wider">
              <span className="flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                SSL Secured
              </span>
              <span aria-hidden="true">•</span>
              <span className="whitespace-nowrap">GIA Certified</span>
              <span aria-hidden="true">•</span>
              <span className="whitespace-nowrap">BIS Hallmarked</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
