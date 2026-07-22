"use client";
import React, { useState } from "react";
import { Download, Search, Filter, MousePointerClick, Users, ShoppingBag, IndianRupee, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useVersion } from "@/hooks/useVersion";
import { useAuth } from "@/lib/auth";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

const DEMO_AMB_ID = "amb_005";

const buyerNames = ["Rahul K.", "Anita P.", "Deepak S.", "Neha R.", "Aman T.", "Priya J.", "Kiran M.", "Sanjay B.", "Rohan D.", "Meera S."];
const maskPhone = (p) => p.slice(0, 4) + " ***** " + p.slice(-2);

const KpiCard = ({ icon: Icon, label, value, iconBg, iconColor, testId }) => (
  <div className="gajab-card p-5 bg-white flex flex-col" data-testid={testId}>
    <div className={`w-11 h-11 rounded-full grid place-items-center mb-4 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} strokeWidth={2.5} />
    </div>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{label}</p>
    <p className="font-display text-3xl sm:text-4xl font-extrabold text-[#1B2D54] mt-1">{value}</p>
  </div>
);

const statusBadge = (s) => {
  if (s === "Confirmed") return "bg-[#D1FAE5] text-[#065F46] border-[#10B981]/40";
  if (s === "Placed") return "bg-[#FEF3C7] text-[#92400E] border-[#FFC93C]/60";
  if (s === "Cancelled") return "bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/40";
  return "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]";
};

const payoutBadge = (s) => {
  if (s === "Paid") return "bg-[#D1FAE5] text-[#065F46] border-[#10B981]/40";
  if (s === "Pending") return "bg-[#FEF3C7] text-[#92400E] border-[#FFC93C]/60";
  if (s === "Locked") return "bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]/40";
  if (s === "Reversed") return "bg-[#FEE2E2] text-[#991B1B] border-[#EF4444]/40";
  return "bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]";
};

export default function Performance() {
  const { isV2 } = useVersion();
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const commissionHistory = useBackend(() => backend.ambassadorHome(ambId).then(r => r.recentOrders ?? []), [], [ambId], ["commission"], ambId);
  const urls = useBackend(() => backend.ambassadorHome(ambId).then(r => r.urls ?? []), [], [ambId], ["leaderboard", "orders", "affiliate_urls"], ambId);

  const filtered = commissionHistory
    .filter(o => filter === "All" || o.status === filter)
    .filter(o => (o.id + o.product + o.urlLabel + o.category).toLowerCase().includes(q.toLowerCase()));

  const totals = filtered.reduce((a, o) => ({
    orders: a.orders + 1, value: a.value + o.orderValue, commission: a.commission + o.commission,
    paid: a.paid + (o.payoutStatus === "Paid" ? o.commission : 0),
  }), { orders: 0, value: 0, commission: 0, paid: 0 });

  const aggr = urls.reduce((a, u) => ({ clicks: a.clicks + (u.clicks ?? 0), signups: a.signups + (u.signups ?? 0) }), { clicks: 0, signups: 0 });

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Order-level history</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Performance log</h1>
        <p className="text-[#5A6378] mt-1">Every order, every commission. Your full earnings trail.</p>
      </div>

      {/* Summary — 6 KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard icon={MousePointerClick} label="Clicks" value={aggr.clicks.toLocaleString()} iconBg="bg-[#FFF1C2]" iconColor="text-[#92400E]" testId="kpi-clicks" />
        <KpiCard icon={Users} label="Signups" value={aggr.signups} iconBg="bg-[#E0E7FF]" iconColor="text-[#3730A3]" testId="kpi-signups" />
        <KpiCard icon={ShoppingBag} label="Orders" value={totals.orders} iconBg="bg-[#D1FAE5]" iconColor="text-[#065F46]" testId="kpi-orders" />
        <KpiCard icon={TrendingUp} label="Order Value" value={`₹${(totals.value/1000).toFixed(1)}K`} iconBg="bg-[#FCE4F0]" iconColor="text-[#9D174D]" testId="kpi-order-value" />
        <KpiCard icon={IndianRupee} label="Commission" value={`₹${(totals.commission/1000).toFixed(1)}K`} iconBg="bg-[#FFE9D9]" iconColor="text-[#C9450C]" testId="kpi-commission" />
        <KpiCard icon={Wallet} label="Paid Out" value={`₹${(totals.paid/1000).toFixed(1)}K`} iconBg="bg-[#E8E4FB]" iconColor="text-[#5B21B6]" testId="kpi-paidout" />
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by order ID, product, link..." className="input-gajab pl-10" data-testid="perf-search" />
        </div>
        <div className="flex gap-1 p-1 bg-white border border-[#EFEAE0] rounded-xl">
          {["All", "Confirmed", "Placed", "Cancelled"].map(f => (
            <button key={f} onClick={()=>setFilter(f)} className={`nav-tab text-xs ${filter===f ? "bg-[#F26B1F] text-white" : "text-[#5A6378] hover:bg-[#FFF7EE]"}`} data-testid={`perf-filter-${f.toLowerCase()}`}>{f}</button>
          ))}
        </div>
        <button onClick={()=>toast.success("CSV export coming soon")} className="btn-ghost" data-testid="perf-export"><Download className="w-4 h-4" /> Export</button>
      </div>

      {/* Table - card layout on mobile, table on larger screens */}
      <div className="gajab-card p-0 overflow-hidden">
        <div className="hidden sm:overflow-x-auto sm:block">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEAE0]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">
                <th className="p-3">Order ID</th><th className="p-3">Date</th><th className="p-3">Product</th>{isV2 && <th className="p-3 text-right">Qty</th>}<th className="p-3">Category</th><th className="p-3">{isV2 ? "Buyer" : "Via Link"}</th><th className="p-3 text-right">Order ₹</th><th className="p-3 text-right">Comm %</th><th className="p-3 text-right">Comm ₹</th><th className="p-3">Order</th><th className="p-3">Payout</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, idx) => (
                <tr key={o.id} className="border-b border-[#F0EBE2] hover:bg-[#FFF7EE]" data-testid={`perf-row-${o.id}`}>
                  <td className="p-3 font-mono text-xs">{o.id}</td>
                  <td className="p-3 text-xs">{o.date}</td>
                  <td className="p-3 font-bold">{o.product}</td>
                  {isV2 && <td className="p-3 text-right font-bold">{(idx % 3) + 1}</td>}
                  <td className="p-3 text-xs text-[#5A6378]">{o.category}</td>
                  <td className="p-3 text-xs">{isV2 ? (<div><p className="font-bold text-[#1B2D54]">{buyerNames[idx % buyerNames.length]}</p><p className="font-mono text-[10px] text-[#5A6378]">{maskPhone("+91 98765 43210")}</p></div>) : o.urlLabel}</td>
                  <td className="p-3 text-right">₹{o.orderValue.toLocaleString()}</td>
                  <td className="p-3 text-right">{o.commissionPct}%</td>
                  <td className="p-3 text-right font-display text-[#F26B1F]">₹{o.commission}</td>
                  <td className="p-3"><span className={`gajab-sticker border ${statusBadge(o.status)}`}>{o.status}</span></td>
                  <td className="p-3"><span className={`gajab-sticker border ${payoutBadge(o.payoutStatus)}`}>{o.payoutStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden space-y-2 p-3">
          {filtered.map((o, idx) => (
            <div key={o.id} className="p-3 rounded-xl border border-[#EFEAE0] bg-white space-y-2" data-testid={`perf-row-mobile-${o.id}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#5A6378]">{o.id}</span>
                <span className="text-xs text-[#5A6378]">{o.date}</span>
              </div>
              <p className="font-bold text-sm">{o.product}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5A6378]">{o.category}</span>
                {isV2 && <span className="text-xs text-[#5A6378]">Qty: {(idx % 3) + 1}</span>}
              </div>
              {isV2 ? (
                <div className="text-xs">
                  <span className="font-bold text-[#1B2D54]">{buyerNames[idx % buyerNames.length]}</span>
                  <span className="text-[#5A6378] font-mono ml-1">{maskPhone("+91 98765 43210")}</span>
                </div>
              ) : (
                <p className="text-xs text-[#5A6378]">{o.urlLabel}</p>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-dashed border-[#EFEAE0]">
                <div>
                  <p className="text-xs text-[#5A6378]">Order <span className="font-bold text-[#1B2D54]">₹{o.orderValue.toLocaleString()}</span></p>
                  <p className="text-xs text-[#5A6378]">Comm <span className="font-bold text-[#F26B1F]">₹{o.commission}</span> ({o.commissionPct}%)</p>
                </div>
                <div className="text-right space-y-1">
                  <div><span className={`gajab-sticker border text-[9px] px-2 ${statusBadge(o.status)}`}>{o.status}</span></div>
                  <div><span className={`gajab-sticker border text-[9px] px-2 ${payoutBadge(o.payoutStatus)}`}>{o.payoutStatus}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-[#5A6378]"><Filter className="w-3 h-3 inline" /> Commission % may vary by category (Beauty 12%, Stationery 8%, others 10%). Cancelled orders auto-reverse commission. Confirmed orders move to "Paid" after the next bi-monthly payout cycle.</p>
    </div>
  );
}
