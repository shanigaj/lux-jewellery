import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for optimal Docker builds
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizeCss: true, // Optimizes CSS loading
  },
};

export default nextConfig;
