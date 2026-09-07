import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Incremental cache backed by Workers KV (free tier, no card required).
// `enableCacheInterception` serves cached ISR/SSG pages early in the Worker —
// before the heavy Next.js render — which keeps CPU well under the free plan's
// per-request limit and stops the intermittent Error 1102 on cold isolates.
// The KV namespace is bound as `NEXT_INC_CACHE_KV` in wrangler.jsonc.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  enableCacheInterception: true,
});
