"use client";
import React, { useState } from "react";
import { Search, ExternalLink, MousePointerClick, ShoppingBag, IndianRupee, Link as LinkIcon, Inbox } from "lucide-react";
import { useBackend } from "@/lib/useBackend";
import { backend } from "@/lib/apiHooks";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoading } from "@/lib/loading";

const channelColor = {
  "All": "bg-[#FFF1C2] text-[#92400E] border-[#FFC93C]/60",
  "Instagram": "bg-[#FCE4F0] text-[#9D174D] border-[#EC4899]/40",
  "WhatsApp": "bg-[#D1FAE5] text-[#065F46] border-[#10B981]/40",
  "Offline / QR": "bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]/40",
};

const Kpi = ({ icon: Icon, label, value, accent }) => (
  <div className="gajab-card p-5">
    <div className={`w-10 h-10 rounded-lg grid place-items-center mb-3 ${accent}`}><Icon className="w-5 h-5" strokeWidth={2.5} /></div>
    <p className="text-xs uppercase font-bold tracking-wider text-[#5A6378]">{label}</p>
    <p className="font-display text-3xl mt-1">{value}</p>
  </div>
);

function AffiliateUrlsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="gajab-card p-5 space-y-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Skeleton className="h-10 flex-1 min-w-[260px] max-w-md rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <div className="gajab-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEAE0]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">
                <th className="p-3">URL ID</th><th className="p-3">Ambassador</th><th className="p-3">College</th><th className="p-3">Label</th><th className="p-3">URL</th><th className="p-3">Channel</th><th className="p-3 text-right">Clicks</th><th className="p-3 text-right">Signups</th><th className="p-3 text-right">Orders</th><th className="p-3 text-right">Revenue</th><th className="p-3 text-right">Commission</th><th className="p-3">Last Click</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[#F0EBE2]">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <td key={j} className="p-3"><Skeleton className="h-4 w-full" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminAffiliateUrls() {
  const [q, setQ] = useState("");
  const [chan, setChan] = useState("All");

  const urls = useBackend(() => backend.listAffiliateUrls(undefined, chan === "All" ? undefined : chan, q || undefined).then(r => r.data), [], [], ["affiliate_urls", "leaderboard", "orders"]);
  const loading = getLoading(urls, []);

  const filtered = urls.filter(u => {
    const ambName = u.ambassador?.name ?? u.ambassadorId ?? "";
    return (ambName + u.college + u.label + u.url).toLowerCase().includes(q.toLowerCase());
  });

  const totals = urls.reduce((a, u) => ({
    clicks: a.clicks + (u.clicks ?? 0),
    signups: a.signups + (u.signups ?? 0),
    orders: a.orders + (u.orders ?? 0),
    revenue: a.revenue + Number(u.revenue ?? 0),
    commission: a.commission + Number(u.commission ?? 0),
  }), { clicks: 0, signups: 0, orders: 0, revenue: 0, commission: 0 });

  if (loading) return <AffiliateUrlsSkeleton />;

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">URL Tracking</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Affiliate URLs</h1>
        <p className="text-[#5A6378] mt-1">Every link, every ambassador, every click. {urls.length} URLs live.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={LinkIcon} label="Total URLs" value={urls.length} accent="bg-[#FFE9D9] text-[#C9450C]" />
        <Kpi icon={MousePointerClick} label="Total Clicks" value={totals.clicks.toLocaleString()} accent="bg-[#FFF1C2] text-[#92400E]" />
        <Kpi icon={ShoppingBag} label="Orders via URLs" value={totals.orders.toLocaleString()} accent="bg-[#D1FAE5] text-[#065F46]" />
        <Kpi icon={IndianRupee} label="Commission Earned" value={`₹${(totals.commission/100000).toFixed(2)}L`} accent="bg-[#FFE9D9] text-[#C9450C]" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search ambassador, college, URL, label..." className="input-gajab pl-10" data-testid="admin-url-search" />
        </div>
        <select value={chan} onChange={e=>setChan(e.target.value)} className="input-gajab w-auto" data-testid="admin-url-channel-filter">
          <option>All</option><option>Instagram</option><option>WhatsApp</option><option>Offline / QR</option>
        </select>
      </div>

      <div className="gajab-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEAE0]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">
                <th className="p-3">URL ID</th><th className="p-3">Ambassador</th><th className="p-3">College</th><th className="p-3">Label</th><th className="p-3">URL</th><th className="p-3">Channel</th><th className="p-3 text-right">Clicks</th><th className="p-3 text-right">Signups</th><th className="p-3 text-right">Orders</th><th className="p-3 text-right">Revenue</th><th className="p-3 text-right">Commission</th><th className="p-3">Last Click</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={12} className="p-12 text-center text-[#5A6378]"><Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" /><p className="font-bold text-lg">No data found</p><p className="text-sm">Try adjusting your search or filter criteria</p></td></tr>
              ) : filtered.map(u => {
                const ambName = u.ambassador?.name ?? u.ambassadorId ?? "—";
                return (
                <tr key={u.id} className="border-b border-[#F0EBE2] hover:bg-[#FFF7EE]" data-testid={`admin-url-row-${u.id}`}>
                  <td className="p-3 font-mono text-xs">{u.id}</td>
                  <td className="p-3 font-bold">{ambName}</td>
                  <td className="p-3 text-xs">{u.college}</td>
                  <td className="p-3">{u.label}</td>
                  <td className="p-3 max-w-[220px]"><div className="flex items-center gap-1 text-xs text-[#5A6378] truncate"><ExternalLink className="w-3 h-3 flex-shrink-0" /><span className="truncate">{u.url}</span></div></td>
                  <td className="p-3"><span className={`gajab-sticker ${channelColor[u.channel] || channelColor["All"]}`}>{u.channel}</span></td>
                  <td className="p-3 text-right font-bold">{u.clicks.toLocaleString()}</td>
                  <td className="p-3 text-right">{u.signups}</td>
                  <td className="p-3 text-right">{u.orders}</td>
                  <td className="p-3 text-right">₹{(Number(u.revenue)/1000).toFixed(1)}K</td>
                  <td className="p-3 text-right font-display text-[#F26B1F]">₹{(Number(u.commission)/1000).toFixed(1)}K</td>
                  <td className="p-3 text-xs text-[#5A6378]">{u.lastClick ?? "—"}</td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
