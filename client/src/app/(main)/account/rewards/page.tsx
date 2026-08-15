"use client";

import { useEffect, useMemo, useState } from "react";
import { Crown, Share2, Copy, Trophy, Sparkles, Check } from "lucide-react";
import { api } from "@/lib/axios";
import { useGetUserOrdersQuery } from "@/store/api/orderApi";

const TIER_ORDER = ["silver", "gold", "platinum", "diamond"] as const;
type Tier = (typeof TIER_ORDER)[number];
// Points needed to reach the next tier (₹100 spent = 1 point).
const TIER_THRESHOLD: Record<Tier, number> = { silver: 0, gold: 5000, platinum: 15000, diamond: 40000 };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const [me, setMe] = useState<{ tier?: Tier; email?: string } | null>(null);

  useEffect(() => {
    api.get("/auth/me").then((r) => setMe(r.data?.data)).catch(() => {});
  }, []);

  const { data } = useGetUserOrdersQuery();
  const orders = useMemo(() => data?.orders ?? [], [data]);

  const lifetime = useMemo(() => Math.floor(orders.reduce((s, o) => s + (o.totalAmount || 0), 0) / 100), [orders]);
  const tier: Tier = me?.tier ?? "silver";
  const tierIdx = TIER_ORDER.indexOf(tier);
  const nextTier = TIER_ORDER[Math.min(tierIdx + 1, TIER_ORDER.length - 1)];
  const nextThreshold = TIER_THRESHOLD[nextTier];
  const pointsToNext = Math.max(0, nextThreshold - lifetime);
  const progress = tier === "diamond" ? 100 : Math.min(100, Math.round((lifetime / (nextThreshold || 1)) * 100));

  const referralLink = `https://sparenza.com/ref/${(me?.email || "you").split("@")[0]}`;
  const handleCopy = () => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const history = useMemo(
    () => [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((o) => ({ id: o._id, action: `Order ${o.orderNumber}`, points: `+ ${Math.floor((o.totalAmount || 0) / 100).toLocaleString("en-IN")}`, date: fmtDate(o.createdAt) })),
    [orders]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl mb-2">Rewards & Referrals</h1>
        <p className="text-muted-foreground text-sm">Earn points on every purchase and unlock exclusive tier benefits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-border rounded-xl p-8 bg-gradient-to-br from-background to-gold/5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10"><Crown size={180} /></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold text-onyx rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={12} /> {tier} Tier
              </div>
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Available Balance</h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-heading text-5xl">{lifetime.toLocaleString("en-IN")}</span>
                <span className="text-lg text-gold font-medium">Pts</span>
              </div>
              {tier !== "diamond" && (
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-xs font-medium capitalize"><span>{tier}</span><span>{nextTier}</span></div>
                  <div className="h-1.5 w-full bg-border rounded-full overflow-hidden"><div className="h-full bg-gold" style={{ width: `${progress}%` }} /></div>
                  <p className="text-[11px] text-muted-foreground mt-2">Earn {pointsToNext.toLocaleString("en-IN")} more points to reach {nextTier} tier.</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Lifetime Earned</p><p className="font-medium">{lifetime.toLocaleString("en-IN")} Pts</p></div>
              <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Value</p><p className="font-medium">₹{lifetime.toLocaleString("en-IN")}</p></div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-xl p-8 bg-muted/10 flex flex-col justify-center">
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-6"><Share2 size={24} className="text-gold" /></div>
          <h2 className="font-heading text-2xl mb-3">Refer a Friend</h2>
          <p className="text-muted-foreground text-sm mb-6">Give friends ₹5,000 off their first order over ₹50,000. When they buy, you earn 5,000 points (worth ₹5,000).</p>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider font-medium text-foreground">Your Referral Link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono truncate">{referralLink}</div>
              <button onClick={handleCopy} className="p-3 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg hover:bg-gold dark:hover:bg-white transition-colors" title="Copy Link">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl p-6 md:p-8">
        <h2 className="font-heading text-lg mb-6">Points History</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No points yet — you&apos;ll earn points on your first order.</p>
        ) : (
          <div className="divide-y divide-border">
            {history.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500/10 text-green-600"><Trophy size={16} /></div>
                  <div><p className="font-medium text-sm">{item.action}</p><p className="text-xs text-muted-foreground mt-0.5">{item.date}</p></div>
                </div>
                <div className="font-medium text-green-600">{item.points}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
