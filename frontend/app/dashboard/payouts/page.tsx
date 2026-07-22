"use client";
import React, { useState } from "react";
import { Wallet, Clock, Filter, Gift, Award, FileText, Sparkles, Info } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

const DEMO_AMB_ID = "amb_005";

const rewards = [
  { id: "RW-01", title: "Gajab Welcome Kit", desc: "Received on onboarding · Feb 2026", icon: Gift, tone: "bg-[#FFE9D9] text-[#C9450C]" },
  { id: "RW-02", title: "Silver Tier Certificate", desc: "Unlocked at 50 lifetime orders", icon: Award, tone: "bg-[#FFF1C2] text-[#92400E]" },
  { id: "RW-03", title: "Founder Letter of Recommendation", desc: "Pending — 60 more orders to unlock", icon: FileText, tone: "bg-[#E8E4FB] text-[#5B21B6]" },
];

export default function Payouts() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const [filter, setFilter] = useState("All months");

  const payouts = useBackend(() => backend.ambassadorPayouts(ambId), [], [ambId], ["commission", "orders"], ambId);
  const months = ["All months", ...Array.from(new Set(payouts.map(p => p.month)))];
  const labelOf = (m) => {
    if (m === "All months") return m;
    const [y, mm] = m.split("-");
    return new Date(parseInt(y), parseInt(mm)-1).toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const stats = useBackend(() => backend.ambassadorHome(ambId).then(r => r.stats), null, [ambId], ["commission", "orders"], ambId);
  const pendingPayout = stats?.pendingCommission ?? 0;
  const paidOut = stats?.paidCommission ?? 0;

  const filtered = filter === "All months" ? payouts : payouts.filter(p => p.month === filter);

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow inline-flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" strokeWidth={2} /> Your Money</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Payouts</h1>
        <p className="text-[#5A6378] mt-1">Bi-monthly payouts. Minimum ₹500.</p>
      </div>

      {/* Voucher notice */}
      <div className="gajab-card p-4 bg-[#FFF1C2] border-[#FFC93C]/60 flex items-start gap-3" data-testid="voucher-notice">
        <Sparkles className="w-5 h-5 text-[#92400E] flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-[#92400E]">Payouts arrive as Gajab Cash Vouchers</p>
          <p className="text-xs text-[#92400E]/80 mt-0.5">Redeem instantly at checkout across gajab.com. No withdrawal delay. No processing fees.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="gajab-card p-5 bg-gradient-to-br from-[#FFC93C] to-[#FFB81C] sm:col-span-2">
          <Wallet className="w-6 h-6" strokeWidth={2.5} />
          <p className="text-xs uppercase font-extrabold tracking-wider mt-2 opacity-70">Available balance</p>
          <p className="font-display text-6xl">₹{pendingPayout.toLocaleString()}</p>
          <p className="text-sm font-bold mt-2">Next payout: <b>Dec 20, 2026</b> · as Gajab Voucher</p>
        </div>
        <div className="gajab-card p-5">
          <p className="text-xs uppercase font-extrabold tracking-wider opacity-70">Lifetime earned</p>
          <p className="font-display text-4xl mt-1">₹{(pendingPayout + paidOut).toLocaleString()}</p>
          <hr className="my-3 border-[#EFEAE0]" />
          <p className="text-xs uppercase font-extrabold tracking-wider opacity-70">Already paid out</p>
          <p className="font-display text-2xl">₹{paidOut.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-[#5A6378]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Filter by month:</span>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input-gajab w-auto h-9" data-testid="payouts-month-filter">
          {months.map(m => <option key={m} value={m}>{labelOf(m)}</option>)}
        </select>
      </div>

      <div className="gajab-card p-5">
        <h3 className="font-display text-lg mb-3">Payout history ({filtered.length})</h3>
        <div className="space-y-2">
          {filtered.map(p => (
            <div key={p.id} className="p-4 rounded-xl border border-[#EFEAE0] hover:border-[#F26B1F]/40 transition-all" data-testid={`payout-${p.id}`}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-bold">{p.period}</p>
                  <p className="text-xs text-[#5A6378]">{p.id} · Paid on {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">₹{p.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${p.status==="Paid"?"bg-[#D1FAE5] text-[#065F46] border-[#065F46]/40":"bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40"}`}>{p.status==="Paid" ? "✓ Paid" : (<><Clock className="w-3 h-3 inline" /> {p.status}</>)}</span>
                </div>
              </div>
              {/* Per-period stats */}
              <div className="mt-3 pt-3 border-t border-dashed border-[#EFEAE0] grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Completed orders</p><p className="font-display text-lg mt-0.5">{(p as any).completedOrders ?? Math.round(p.amount / 130)}</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">GMV</p><p className="font-display text-lg mt-0.5">₹{(((p as any).gmv ?? p.amount * 10) / 1000).toFixed(1)}K</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">Voucher code</p><p className="font-mono text-xs mt-1.5 text-[#F26B1F]">GJB-{p.id.slice(-4)}</p></div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="p-6 text-center text-sm text-[#5A6378]">No payouts in this period.</p>}
        </div>
      </div>

      {/* Rewards section */}
      <div className="gajab-card p-5" data-testid="rewards-section">
        <h3 className="font-display text-lg mb-1 flex items-center gap-2"><Award className="w-5 h-5 text-[#F26B1F]" /> Rewards & recognition</h3>
        <p className="text-xs text-[#5A6378] mb-3">Welcome kits, certificates, letters — all in one place.</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {rewards.map(r => (
            <div key={r.id} className="p-4 rounded-xl border border-[#EFEAE0] bg-white" data-testid={`reward-${r.id}`}>
              <div className={`w-10 h-10 rounded-lg grid place-items-center ${r.tone}`}><r.icon className="w-5 h-5" strokeWidth={2.5} /></div>
              <p className="font-bold mt-3">{r.title}</p>
              <p className="text-xs text-[#5A6378] mt-1">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
