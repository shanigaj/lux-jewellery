HERO BACKGROUND VIDEO
=====================

Drop your hero video here as:

    public/videos/hero.mp4     (required, H.264/MP4)
    public/videos/hero.webm    (optional, smaller/better — VP9/WebM)

The HeroBanner component (src/components/home/HeroBanner.tsx) references
these paths. Until a file exists, it gracefully falls back to the poster
image (/images/hero-ring.png) plus the animated bokeh shimmer.

Recommended specs for a luxury hero:
  - 8-14 second seamless loop (no hard cut)
  - 1920x1080 (or 1080x1920 crop-safe), object-cover is applied
  - Keep it LIGHT / high-key to match the "Blanc Vert" cream theme
    (soft daylight, ivory backdrop, close-up sparkle) — not dark cinematic
  - Compress hard: aim for < 4-5 MB. Muted, no audio track needed.
  - Subject centered a touch right — the left side is covered by a cream
    scrim where the headline sits.
