import React from "react";
import { tiers } from "@/data/options";

interface TierProgressProps {
  compact?: boolean;
  revenue?: number;
  rank?: number;
}

export default function TierProgress({ compact = false, revenue = 0, rank = 0 }: TierProgressProps) {
  const currentRevenue = revenue;
  const idx = tiers.findIndex(t => currentRevenue >= t.min && currentRevenue < t.max);
  const current = tiers[idx] || tiers[tiers.length - 1];
  const next = tiers[idx + 1];
  const progress = next
    ? ((currentRevenue - current.min) / (current.max - current.min)) * 100
    : 100;
  const toGo = next ? (next.min - currentRevenue) : 0;

  return (
    <div className="gajab-card p-5 bg-gradient-to-br from-white to-[#FFF7EE]" data-testid="tier-progress">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl ${current.bg} grid place-items-center text-3xl ring-2 ${current.ring}`}>{current.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Your current tier</p>
              <p className="font-display text-2xl" style={{ color: current.color }}>{current.name}</p>
              <p className="text-xs text-[#5A6378]">{current.commission} commission • Rank #{rank}</p>
            </div>
        </div>
        {next && (
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Next tier</p>
            <p className="font-display text-xl" style={{ color: next.color }}>{next.icon} {next.name}</p>
            <p className="text-xs text-[#5A6378]">₹{toGo.toLocaleString()} more in revenue</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="h-3 rounded-full bg-[#F3EFE9] overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${progress.toFixed(1)}%`, background: `linear-gradient(90deg, ${current.color}, ${next ? next.color : current.color})` }} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">
          <span>₹{(current.min/1000).toFixed(0)}K</span>
          <span className="text-[#1B2D54]">You: ₹{(currentRevenue/1000).toFixed(1)}K • {progress.toFixed(0)}%</span>
          <span>₹{next ? (next.min/1000).toFixed(0) + "K" : "MAX"}</span>
        </div>
      </div>

      {!compact && next && (
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#EFEAE0] p-3 bg-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Unlock at {next.name}</p>
            <ul className="mt-1 space-y-0.5 text-xs">
              {next.perks.slice(0, 2).map((p, i) => <li key={i} className="flex gap-1.5"><span className="text-[#F26B1F]">★</span> {p}</li>)}
            </ul>
          </div>
          <div className="rounded-xl border border-[#EFEAE0] p-3 bg-[#FFF1C2]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#92400E]">Pro tip</p>
            <p className="mt-1 text-xs text-[#1B2D54]">Focus on <b>Beauty (12%)</b> and <b>Electronics (10%)</b> orders — they pay more commission per ₹.</p>
          </div>
        </div>
      )}
    </div>
  );
}
