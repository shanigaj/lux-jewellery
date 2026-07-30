"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Heart, MessageCircle } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/shared/AnimatedSection";

const instagramPosts = [
  { id: 1, type: "image", src: "/images/instagram/grid.png", likes: "12.4k", comments: "142", delay: 0.1 },
  { id: 2, type: "video", src: "/images/hero-ring.png", likes: "8.9k", comments: "95", delay: 0.2 },
  { id: 3, type: "image", src: "/images/products/necklace.png", likes: "15.2k", comments: "218", delay: 0.3 },
  { id: 4, type: "image", src: "/images/products/bracelet.png", likes: "10.1k", comments: "87", delay: 0.4 },
];

export function InstagramGallery() {
  return (
    <section className="section-padding bg-background border-t border-border/50">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <AnimatedSection animation="fadeRight">
            <div className="flex items-center gap-3 mb-4">
              <Camera size={16} className="text-gold" />
              <p className="text-[10px] uppercase tracking-luxury-wide text-gold font-medium">
                Follow Our Journey
              </p>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground">
              @LUXDiamonds
            </h2>
            <p className="text-muted-foreground font-light mt-3 max-w-md">
              Join our community of jewellery connoisseurs. Share your Sparenza moments with #MySparenza.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="fadeLeft" delay={0.2}>
            <Link
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-border rounded-full hover:border-gold transition-colors"
            >
              <Camera size={16} className="text-foreground group-hover:text-gold transition-colors" />
              <span className="text-xs font-medium uppercase tracking-wider text-foreground group-hover:text-gold transition-colors">
                Follow Us
              </span>
            </Link>
          </AnimatedSection>
        </div>

        {/* Gallery Grid */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {instagramPosts.map((post, i) => (
            <StaggerItem key={post.id} className="group relative aspect-square overflow-hidden rounded-xl bg-muted cursor-pointer">
              <Image
                src={post.src}
                alt="Instagram Post"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Heart size={18} className="fill-white" />
                  <span className="font-medium text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <MessageCircle size={18} className="fill-white" />
                  <span className="font-medium text-sm">{post.comments}</span>
                </div>
              </div>
              
              {/* Type Icon */}
              {post.type === "video" && (
                <div className="absolute top-3 right-3 text-white drop-shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <line x1="2" y1="7" x2="7" y2="7"></line>
                    <line x1="2" y1="17" x2="7" y2="17"></line>
                    <line x1="17" y1="17" x2="22" y2="17"></line>
                    <line x1="17" y1="7" x2="22" y2="7"></line>
                  </svg>
                </div>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
