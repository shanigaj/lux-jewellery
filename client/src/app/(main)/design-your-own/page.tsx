"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  SETTINGS,
  METALS,
  SHAPES,
  COLOURS,
  CLARITIES,
  CUTS,
  RING_SIZES,
  CARAT_MIN,
  CARAT_MAX,
  CARAT_STEP,
  DEFAULT_CONFIG,
  estimatePrice,
  formatINR,
  buildRingEnquiry,
  type RingConfig,
} from "@/lib/ring-builder";

export default function DesignYourOwnPage() {
  const [config, setConfig] = useState<RingConfig>(DEFAULT_CONFIG);
  const set = <K extends keyof RingConfig>(key: K, value: RingConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const estimate = useMemo(() => estimatePrice(config), [config]);
  const metal = METALS.find((m) => m.id === config.metal)!;
  const shape = SHAPES.find((s) => s.id === config.shape)!;

  const enquire = () =>
    window.open(getWhatsAppUrl(buildRingEnquiry(config, estimate)), "_blank", "noopener,noreferrer");

  // Gem size scales gently with carat (0.3ct → 44px, 5ct → 96px).
  const gemSize = 44 + ((config.carat - CARAT_MIN) / (CARAT_MAX - CARAT_MIN)) * 52;

  return (
    <div className="container-luxury py-16 md:py-24">
      <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-luxury-wide text-gold">
          Bespoke Atelier
        </p>
        <h1 className="font-heading text-4xl leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
          Design your <em className="italic text-primary">own ring</em>
        </h1>
        <p className="mt-6 font-light leading-relaxed text-muted-foreground">
          Compose a ring stone by stone. Choose the setting, metal and diamond — we&apos;ll source
          the matching stones and hand-make it in our atelier.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[420px_1fr]">
        {/* ── Live preview + estimate ── */}
        <aside className="h-fit lg:sticky lg:top-28">
          <div className="relative overflow-hidden rounded-[2px] border border-border bg-card">
            <div className="flex h-80 items-center justify-center bg-gradient-to-b from-secondary to-card">
              {/* soft halo */}
              <div className="absolute h-52 w-52 rounded-full bg-primary/5 blur-2xl" />
              <RingPreview bandColor={metal.band} clip={shape.clip} radius={shape.radius} gemSize={gemSize} />
            </div>
            <div className="border-t border-border p-6">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Indicative estimate
              </p>
              <p className="mt-1 font-heading text-3xl text-foreground tabular-nums">
                {formatINR(estimate)}
              </p>
              <p className="mt-1 text-[11px] font-light text-muted-foreground">
                Final quote confirmed on enquiry · matching certified stones sourced to order.
              </p>
              <button
                type="button"
                onClick={enquire}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[2px] bg-[#25D366] px-8 py-4 text-[12px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#1ebe5b]"
              >
                <MessageCircle size={16} /> Enquire on WhatsApp
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Check size={12} className="text-primary" /> GIA-certified</span>
            <span className="flex items-center gap-1"><Check size={12} className="text-primary" /> Ethically sourced</span>
            <span className="flex items-center gap-1"><Check size={12} className="text-primary" /> Lifetime warranty</span>
          </div>
        </aside>

        {/* ── Controls ── */}
        <div className="space-y-12">
          {/* Setting */}
          <Group step={1} title="Choose your setting">
            <div className="grid gap-3 sm:grid-cols-3">
              {SETTINGS.map((s) => (
                <OptionCard
                  key={s.id}
                  active={config.setting === s.id}
                  onClick={() => set("setting", s.id)}
                  title={s.title}
                  sub={s.blurb}
                />
              ))}
            </div>
          </Group>

          {/* Metal */}
          <Group step={2} title="Choose the metal">
            <div className="flex flex-wrap gap-4">
              {METALS.map((m) => {
                const active = config.metal === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => set("metal", m.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full border-2 p-1 transition-all",
                        active ? "border-primary scale-110" : "border-border hover:border-primary/40"
                      )}
                    >
                      <span className="h-full w-full rounded-full shadow-inner" style={{ background: m.swatch }} />
                    </span>
                    <span className={cn("text-[11px]", active ? "text-foreground" : "text-muted-foreground")}>
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>

          {/* Diamond shape */}
          <Group step={3} title="Choose the diamond shape">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {SHAPES.map((s) => {
                const active = config.shape === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => set("shape", s.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-[2px] border p-3 transition-colors",
                      active ? "border-primary bg-card" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span
                      className="h-7 w-7"
                      style={{
                        background: "linear-gradient(135deg,#eafaf0,#bfe6cf,#eafaf0)",
                        clipPath: s.clip || undefined,
                        borderRadius: s.clip ? undefined : s.radius,
                        boxShadow: "inset 0 0 6px rgba(255,255,255,.7)",
                      }}
                    />
                    <span className={cn("text-[10px]", active ? "text-foreground" : "text-muted-foreground")}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>

          {/* Carat */}
          <Group step={4} title="Carat weight">
            <div className="flex items-center gap-5">
              <input
                type="range"
                min={CARAT_MIN}
                max={CARAT_MAX}
                step={CARAT_STEP}
                value={config.carat}
                onChange={(e) => set("carat", Number(e.target.value))}
                className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border accent-[#0B5D3B]"
                aria-label="Carat weight"
              />
              <span className="min-w-[72px] text-right font-heading text-2xl text-foreground tabular-nums">
                {config.carat.toFixed(2)}ct
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {[0.5, 1, 1.5, 2, 3].map((c) => (
                <Chip key={c} active={config.carat === c} onClick={() => set("carat", c)}>
                  {c.toFixed(1)}ct
                </Chip>
              ))}
            </div>
          </Group>

          {/* Colour / clarity / cut */}
          <Group step={5} title="The 4Cs — colour, clarity &amp; cut">
            <div className="space-y-6">
              <PickRow label="Colour">
                {COLOURS.map((c) => (
                  <Chip key={c} active={config.colour === c} onClick={() => set("colour", c)}>
                    {c}
                  </Chip>
                ))}
              </PickRow>
              <PickRow label="Clarity">
                {CLARITIES.map((c) => (
                  <Chip key={c} active={config.clarity === c} onClick={() => set("clarity", c)}>
                    {c}
                  </Chip>
                ))}
              </PickRow>
              <PickRow label="Cut">
                {CUTS.map((c) => (
                  <Chip key={c} active={config.cut === c} onClick={() => set("cut", c)}>
                    {c}
                  </Chip>
                ))}
              </PickRow>
            </div>
          </Group>

          {/* Size */}
          <Group step={6} title="Ring size">
            <div className="flex flex-wrap gap-2">
              {RING_SIZES.map((s) => (
                <Chip key={s} active={config.size === s} onClick={() => set("size", s)}>
                  US {s}
                </Chip>
              ))}
            </div>
          </Group>
        </div>
      </div>
    </div>
  );
}

/* ── Preview ── */
function RingPreview({
  bandColor,
  clip,
  radius,
  gemSize,
}: {
  bandColor: string;
  clip: string;
  radius: string;
  gemSize: number;
}) {
  return (
    <motion.div className="relative" style={{ width: 200, height: 200 }} initial={false}>
      {/* band */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 150,
          height: 150,
          border: `16px solid ${bandColor}`,
          boxShadow: "0 20px 30px -18px rgba(0,0,0,.5), inset 0 2px 6px rgba(255,255,255,.5)",
        }}
      />
      {/* gemstone */}
      <motion.div
        key={`${clip}-${radius}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 26,
          width: gemSize,
          height: gemSize,
          background:
            "conic-gradient(from 0deg,#ffffff,#cfeede,#ffffff,#a9d8bf,#ffffff,#d8ecdf,#ffffff)",
          clipPath: clip || undefined,
          borderRadius: clip ? undefined : radius,
          boxShadow: "0 0 0 2px rgba(255,255,255,.6), 0 8px 22px -6px rgba(11,93,59,.45), inset 0 0 12px rgba(255,255,255,.6)",
        }}
      />
    </motion.div>
  );
}

/* ── Small UI helpers ── */
function Group({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold text-[11px] font-semibold text-gold tabular-nums">
          {step}
        </span>
        <h2 className="font-heading text-xl text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      {children}
    </section>
  );
}

function OptionCard({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[2px] border p-4 text-left transition-all duration-300",
        active ? "border-primary bg-card shadow-luxury" : "border-border hover:border-primary/40 hover:bg-card"
      )}
    >
      <span className="block font-heading text-base text-foreground">{title}</span>
      <span className="mt-1 block text-[12px] font-light leading-snug text-muted-foreground">{sub}</span>
    </button>
  );
}

function PickRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[2px] border px-4 py-2 text-sm tabular-nums transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary/40"
      )}
    >
      {children}
    </button>
  );
}
