import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/admin",
          "/checkout",
          "/cart",
          "/order-success",
          "/wishlist",
          "/compare",
          "/search",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-otp",
          "/api/",
          "/*?*sort=",
          "/*?*page=",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
