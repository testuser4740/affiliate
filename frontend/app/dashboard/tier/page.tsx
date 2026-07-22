"use client";
import React from "react";
import { Check, Lock, Sparkles } from "lucide-react";
import { tiers } from "@/data/options";
import TierProgress from "@/components/TierProgress";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";

const DEMO_AMB_ID = "amb_005";

export default function TierPage() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const tierData = useBackend(() => backend.ambassadorTier(ambId), null, [ambId], ["leaderboard", "orders", "commission"], ambId);
  const currentRevenue = tierData?.ambassador?.revenue ?? 0;
  const currentIdx = tiers.findIndex(t => currentRevenue >= t.min && currentRevenue < t.max);

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Tier Engine</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Your level up journey</h1>
        <p className="text-[#5A6378] mt-1">Earn more, unlock more. Every tier upgrade boosts your commission & perks.</p>
      </div>

      <TierProgress revenue={currentRevenue} rank={tierData?.ambassador?.rank ?? 0} />

      <div>
        <h3 className="font-display text-xl mb-3">All tiers & perks</h3>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {tiers.map((t, i) => {
            const status = i < currentIdx ? "achieved" : i === currentIdx ? "current" : "locked";
            return (
              <div key={t.name} className={`gajab-card p-5 relative ${status === "current" ? "ring-2 ring-offset-2" : ""}`} style={status === "current" ? { boxShadow: `0 8px 24px ${t.color}33` } : {}} data-testid={`tier-card-${t.name.toLowerCase()}`}>
                {status === "current" && (
                  <span className="absolute -top-3 right-4 gajab-sticker bg-[#F26B1F] text-white border border-[#F26B1F]">
                    <Sparkles className="w-3 h-3" /> CURRENT
                  </span>
                )}
                {status === "achieved" && (
                  <span className="absolute -top-3 right-4 gajab-sticker bg-[#D1FAE5] text-[#065F46] border border-[#10B981]/40">
                    <Check className="w-3 h-3" /> UNLOCKED
                  </span>
                )}
                {status === "locked" && (
                  <span className="absolute -top-3 right-4 gajab-sticker bg-[#F3EFE9] text-[#5A6378] border border-[#EFEAE0]">
                    <Lock className="w-3 h-3" /> LOCKED
                  </span>
                )}
                <div className={`w-16 h-16 rounded-2xl ${t.bg} grid place-items-center text-4xl mb-3`}>{t.icon}</div>
                <p className="font-display text-2xl" style={{ color: t.color }}>{t.name}</p>
                <p className="text-xs text-[#5A6378] mt-0.5">₹{t.min.toLocaleString()} – {t.max > 100000000 ? "∞" : `₹${t.max.toLocaleString()}`} revenue</p>
                <div className="my-3 p-2.5 rounded-xl bg-[#FFF7EE] border border-[#EFEAE0]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Commission rate</p>
                  <p className="font-display text-3xl mt-0.5" style={{ color: t.color }}>{t.commission}</p>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mb-1.5">Perks</p>
                <ul className="space-y-1 text-xs text-[#1B2D54]">
                  {t.perks.map((p, j) => (
                    <li key={j} className="flex gap-1.5"><span className="text-[#F26B1F] flex-shrink-0">★</span>{p}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="gajab-card p-5 bg-gradient-to-br from-[#FFE9D9] to-[#FFF1C2]">
        <h3 className="font-display text-xl">How tier upgrades work</h3>
        <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-white/60 border border-[#EFEAE0]">
            <p className="font-bold text-[#1B2D54]">1. Generate revenue</p>
            <p className="text-xs text-[#5A6378] mt-1">Lifetime ambassador revenue (delivered orders only) decides your tier.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-[#EFEAE0]">
            <p className="font-bold text-[#1B2D54]">2. Auto-upgrade</p>
            <p className="text-xs text-[#5A6378] mt-1">Hit the next tier threshold and you&apos;re upgraded instantly. No paperwork.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/60 border border-[#EFEAE0]">
            <p className="font-bold text-[#1B2D54]">3. New rate applies</p>
            <p className="text-xs text-[#5A6378] mt-1">Higher commission % kicks in on the next order placed after upgrade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
