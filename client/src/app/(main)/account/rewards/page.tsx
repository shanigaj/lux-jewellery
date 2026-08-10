"use client";

import { Crown, Gift, Share2, Copy, Trophy, Target, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://sparenza.com/ref/priya_s88";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const history = [
    { id: 1, action: "Order LUX-M4X7K2", points: "+ 2,850", date: "Jul 10, 2026", type: "earn" },
    { id: 2, action: "Account Creation", points: "+ 500", date: "Jan 12, 2026", type: "earn" },
    { id: 3, action: "Redeemed on Order LUX-A1B2C", points: "- 850", date: "Mar 05, 2026", type: "spend" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl mb-2">Rewards & Referrals</h1>
        <p className="text-muted-foreground text-sm">
          Earn points on every purchase and unlock exclusive Platinum & Diamond tier benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier & Points Status */}
        <div className="border border-border rounded-xl p-8 bg-gradient-to-br from-background to-gold/5 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Crown size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold text-onyx rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={12} /> Platinum Tier
              </div>
              
              <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">
                Available Balance
              </h2>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-heading text-5xl">2,500</span>
                <span className="text-lg text-gold font-medium">Pts</span>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-xs font-medium">
                  <span>Platinum</span>
                  <span>Diamond</span>
                </div>
                <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gold w-[60%]" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  Earn 1,500 more points by Dec 31, 2026 to reach Diamond Tier.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Lifetime Earned</p>
                <p className="font-medium">3,350 Pts</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Value</p>
                <p className="font-medium">₹2,500</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="border border-border rounded-xl p-8 bg-muted/10 flex flex-col justify-center">
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-6">
            <Share2 size={24} className="text-gold" />
          </div>
          
          <h2 className="font-heading text-2xl mb-3">Refer a Friend</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Give your friends ₹5,000 off their first order over ₹50,000. 
            When they buy, you get 5,000 Reward Points (worth ₹5,000).
          </p>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wider font-medium text-foreground">
              Your Referral Link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-sm font-mono truncate">
                {referralLink}
              </div>
              <button
                onClick={handleCopy}
                className="p-3 bg-onyx dark:bg-gold text-white dark:text-onyx rounded-lg hover:bg-gold dark:hover:bg-white transition-colors"
                title="Copy Link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Points History */}
      <div className="border border-border rounded-xl p-6 md:p-8">
        <h2 className="font-heading text-lg mb-6">Points History</h2>
        
        <div className="divide-y divide-border">
          {history.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'earn' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                  {item.type === 'earn' ? <Trophy size={16} /> : <Target size={16} />}
                </div>
                <div>
                  <p className="font-medium text-sm">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                </div>
              </div>
              <div className={`font-medium ${item.type === 'earn' ? 'text-green-600' : 'text-foreground'}`}>
                {item.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
