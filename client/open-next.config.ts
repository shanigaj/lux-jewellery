import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config — no R2 incremental cache (keeps everything on the free plan).
// The storefront is API-driven, so ISR persistence isn't required to go live;
// an R2 cache can be added later for faster revalidation.
export default defineCloudflareConfig({});
