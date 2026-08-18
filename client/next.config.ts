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
  // Hide the framework fingerprint.
  poweredByHeader: false,
  // Security headers applied to every response.
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    const securityHeaders = [
      // Don't let the browser guess (sniff) a response's content type.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // Block the site being framed elsewhere (clickjacking / iframe scraping).
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      // Leak as little referrer info as possible to third parties.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // Deny powerful device APIs the storefront never uses.
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      // Force HTTPS for two years (ignored on plain-http localhost).
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
    ];

    // CSP only in production — dev needs eval/ws for HMR, and a strict policy
    // there would break Fast Refresh. 'unsafe-inline'/'unsafe-eval' are required
    // by Next.js' runtime + framer-motion; the rest is locked to known sources.
    if (isProd) {
      securityHeaders.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https:",
          "upgrade-insecure-requests",
        ].join("; "),
      });
    }

    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
