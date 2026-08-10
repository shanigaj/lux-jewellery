import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Required for optimal Docker builds
  devIndicators: false, // Hide the dev-only Next.js indicator (was overlapping the WhatsApp button)
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
      {
        protocol: "https",
        hostname: "overnightmountings.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
