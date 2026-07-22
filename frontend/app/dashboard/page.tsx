"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MousePointerClick, ShoppingBag, PackageCheck, TrendingUp, IndianRupee, Trophy, Repeat, UserPlus, XOctagon, PackageX, Calendar, Users, ShieldCheck, Target, Hand } from "lucide-react";
import ShareRow from "@/components/ShareRow";
import TierProgress from "@/components/TierProgress";
const TrendChart = dynamic(() => import("@/components/TrendChart"), { ssr: false });
import { useVersion } from "@/hooks/useVersion";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";

const DEMO_AMB_ID = "amb_005";

const maskPhone = (p) => p.slice(0, 4) + " ***** " + p.slice(-2);
const buyers = ["Rahul K.", "Anita P.", "Deepak S.", "Neha R.", "Aman T."];

const Stat = ({ icon: Icon, label, value, bg }) => (
  <div className={`gajab-card p-4 ${bg}`}>
    <Icon className="w-5 h-5 mb-2 text-[#1B2D54]" strokeWidth={2} />
    <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-70">{label}</p>
    <p className="font-display text-2xl sm:text-3xl font-extrabold mt-0.5">{value}</p>
  </div>
);

export default function Home() {
  const { isV2 } = useVersion();
  const { user } = useAuth();
  const [period, setPeriod] = useState("Monthly");

  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;

  const home = useBackend(
    () => backend.ambassadorHome(ambId),
    null,
    [ambId],
    ["leaderboard", "orders", "commission", "ambassador_created"],
    ambId,
  );
  const ambassador = home?.ambassador ?? null;
  const stats = home?.stats ?? null;
  const orders = home?.recentOrders ?? [];
  const affiliateLink = home?.urls?.[0]?.url ?? "";

  const trendData = stats?.trend ?? [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <span className="gajab-sticker-yellow inline-flex items-center gap-1.5"><Hand className="w-3.5 h-3.5" /> Hi {ambassador?.name?.split(" ")[0] ?? "Ambassador"}</span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">What&apos;s selling today?</h1>
        <p className="text-[#5A6378] mt-1">Here's how your hustle's looking this month.</p>
      </div>

      {/* Filter card — period + optional date range in one row */}
      <div className="gajab-card p-3 sm:p-4" data-testid="home-period-filter">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#5A6378]" strokeWidth={2} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A6378]">Period</span>
          </div>
          <div className="flex items-center gap-1 p-1 bg-[#FFF7EE] border border-[#EFEAE0] rounded-xl">
            {["Weekly", "Monthly", "Custom"].map(p => (
              <button key={p} onClick={()=>setPeriod(p)} className={`nav-tab text-xs ${period===p ? "bg-[#F26B1F] text-white" : "text-[#5A6378] hover:bg-white"}`} data-testid={`period-${p.toLowerCase()}`}>{p}</button>
            ))}
          </div>
          {period === "Custom" && (
            <div className="flex items-center gap-2" data-testid="home-custom-dates">
              <input type="date" className="input-gajab h-9 w-40 text-xs" data-testid="home-date-from" />
              <span className="text-xs font-bold text-[#5A6378]">to</span>
              <input type="date" className="input-gajab h-9 w-40 text-xs" data-testid="home-date-to" />
            </div>
          )}
          <div className="ml-auto text-[11px] font-bold text-[#5A6378]">Showing <b className="text-[#1B2D54]">{period}</b> view</div>
        </div>
      </div>

      {/* Affiliate link card - only show if ambassador exists */}
      {ambassador && (
        <div className="gajab-card p-5 sm:p-6 bg-[#1B2D54] text-white">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase font-extrabold tracking-wider text-[#FFC93C]">Your magic link</p>
               <p className="font-display text-xl sm:text-2xl font-extrabold mt-1 break-all text-white">{affiliateLink}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/15">
            <p className="text-[10px] uppercase font-bold tracking-wider text-white/60 mb-2">Share in one tap</p>
             <ShareRow link={affiliateLink} />
          </div>
        </div>
      )}

      {/* Tier progress */}
      <TierProgress compact={true} revenue={ambassador?.revenue} rank={ambassador?.rank} />

      {/* Quick highlights — clean pastel pills with lucide icons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Quick view</span>
        {isV2 && stats && (
          <span className="gajab-sticker bg-[#E0E7FF] text-[#3730A3] border border-[#6366F1]/40 inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" strokeWidth={2} /> {stats.totalClicks?.toLocaleString() ?? 0} total users
          </span>
        )}
        <span className="gajab-sticker bg-[#E6F8EF] text-[#065F46] border border-[#10B981]/40 inline-flex items-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" strokeWidth={2} /> {stats?.signups ?? 0} new users onboarded · 7d
        </span>
        <span className="gajab-sticker bg-[#FFE9D9] text-[#C9450C] border border-[#F26B1F]/40 inline-flex items-center gap-1.5">
          <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} /> {stats?.orders ?? 0} orders · today
        </span>
      </div>

      {isV2 && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: "Registered · No order", value: 84, bg: "bg-[#E0E7FF]", tx: "text-[#3730A3]" },
            { label: "Order placed", value: 32, bg: "bg-[#FEF3C7]", tx: "text-[#92400E]" },
            { label: "Completed", value: 152, bg: "bg-[#D1FAE5]", tx: "text-[#065F46]" },
            { label: "Repeat orders", value: 41, bg: "bg-[#FFE9D9]", tx: "text-[#C9450C]" },
            { label: "Cancelled", value: 24, bg: "bg-[#FEE2E2]", tx: "text-[#991B1B]" },
            { label: "Returned", value: 8, bg: "bg-[#F3EFE9]", tx: "text-[#5A6378]" },
          ].map(s => (
            <div key={s.label} className={`gajab-card p-3 ${s.bg}`} data-testid={`status-${s.label.split(" ")[0].toLowerCase()}`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${s.tx}`}>{s.label}</p>
              <p className="font-display text-2xl mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Stat icon={MousePointerClick} label="Clicks" value={stats?.totalClicks?.toLocaleString() ?? "0"} bg="bg-white" />
        <Stat icon={ShoppingBag} label="Orders" value={stats?.ordersPlaced ?? 0} bg="bg-[#FFF6DC]" />
        <Stat icon={PackageCheck} label="Delivered" value={stats?.ordersDelivered ?? 0} bg="bg-[#E6F8EF]" />
        <Stat icon={TrendingUp} label="Revenue" value={stats?.revenue ? `₹${(stats.revenue/1000).toFixed(1)}K` : "₹0"} bg="bg-[#FFE3E5]" />
        <Stat icon={IndianRupee} label="Commission" value={stats?.commission ? `₹${(stats.commission/1000).toFixed(1)}K` : "₹0"} bg="bg-[#E8E4FB]" />
      </div>

      {/* Chart + Rank */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="gajab-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-extrabold">7-day trend</h3>
            <span className="gajab-sticker-yellow text-[10px]">+18% vs last week</span>
          </div>
          <div className="h-56">
            <TrendChart data={trendData} />
          </div>
        </div>
        <div className="gajab-card p-5 bg-gradient-to-br from-[#FFC93C] to-[#FFB81C]">
          <Trophy className="w-6 h-6 mb-2 text-[#1B2D54]" strokeWidth={2} />
          <p className="text-xs uppercase font-extrabold tracking-wider">National rank</p>
          <p className="font-display text-7xl font-extrabold leading-none mt-2">#{ambassador?.rank ?? 0}</p>
          <p className="text-sm font-bold mt-2">{stats?.totalAmbassadors ?? 0} ambassadors</p>
          <div className="mt-5 p-3 rounded-xl bg-white/40 border border-[#EFEAE0]">
            <p className="text-xs font-bold flex items-center gap-1.5"><Target className="w-3.5 h-3.5" strokeWidth={2} /> Climb to #5</p>
            <p className="text-xs mt-1">Earn ₹39,200 more to overtake Rohan Patel</p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="gajab-card p-5">
        <h3 className="font-display text-lg font-extrabold mb-3">{isV2 ? "New orders" : "Recent orders"}</h3>
        <div className="space-y-2">
          {orders.map((o, i) => (
            <div key={o.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#EFEAE0] hover:border-[#EFEAE0] transition-all" data-testid={`order-${o.id}`}>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{o.product}</p>
                {isV2 ? (
                  <p className="text-xs text-[#5A6378]">Order <b className="text-[#1B2D54]">{o.id}</b> • Buyer: <b className="text-[#1B2D54]">{buyers[i % buyers.length]}</b> · <span className="font-mono">{maskPhone("+91 98765 43210")}</span></p>
                ) : (
                  <p className="text-xs text-[#5A6378]">{o.id} • {o.date}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-display font-extrabold">₹{o.commission}</p>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${o.status==="Delivered"?"bg-[#D1FAE5] text-[#065F46] border-[#065F46]":o.status==="Cancelled"?"bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]":"bg-[#FEF3C7] text-[#92400E] border-[#92400E]"}`}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customers onboarded (V2) */}
      {isV2 && (
        <div className="gajab-card p-5" data-testid="customers-onboarded">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-extrabold flex items-center gap-2"><UserPlus className="w-5 h-5 text-[#F26B1F]" strokeWidth={2} /> Customers onboarded</h3>
            <span className="gajab-sticker-orange text-[10px]">12 · Last 7 days</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {["Rahul K.", "Anita P.", "Deepak S.", "Neha R.", "Aman T.", "Priya J."].map((n, i) => (
              <div key={n} className="flex items-center justify-between p-3 rounded-xl border border-[#EFEAE0] hover:border-[#F26B1F]/40 transition-all" data-testid={`cust-${i}`}>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#1B2D54]">{n}</p>
                  <p className="text-[11px] font-mono text-[#5A6378]">+91 98765 4** ***</p>
                </div>
                <span className={`gajab-sticker text-[10px] ${i%3===0 ? "bg-[#D1FAE5] text-[#065F46]" : i%3===1 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#E0E7FF] text-[#3730A3]"} border border-current/30`}>{i%3===0 ? "Placed order" : i%3===1 ? "Registered" : "Repeat customer"}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#5A6378] mt-3 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} /> Contact details are masked for privacy — full data available with admin only.</p>
        </div>
      )}

      {/* Order buckets breakdown (V2) */}
      {isV2 && (
        <div className="grid sm:grid-cols-3 gap-3" data-testid="order-buckets">
          <div className="gajab-card p-4 bg-[#D1FAE5] border-[#10B981]/30" data-testid="bucket-completed">
            <PackageCheck className="w-5 h-5 text-[#065F46]" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#065F46] mt-2">Completed orders</p>
            <p className="font-display text-3xl text-[#065F46] mt-0.5">{orders.filter(o => o.status === "Delivered" || o.status === "Confirmed").length || 152}</p>
            <p className="text-[11px] text-[#065F46]/80 mt-1">Delivered & confirmed</p>
          </div>
          <div className="gajab-card p-4 bg-[#FEE2E2] border-[#EF4444]/30" data-testid="bucket-cancelled">
            <XOctagon className="w-5 h-5 text-[#991B1B]" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#991B1B] mt-2">Cancelled</p>
            <p className="font-display text-3xl text-[#991B1B] mt-0.5">{orders.filter(o => o.status === "Cancelled").length || 24}</p>
            <p className="text-[11px] text-[#991B1B]/80 mt-1">Auto-reversed commission</p>
          </div>
          <div className="gajab-card p-4 bg-[#F3EFE9] border border-[#EFEAE0]" data-testid="bucket-returned">
            <PackageX className="w-5 h-5 text-[#5A6378]" strokeWidth={2} />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mt-2">Returned</p>
            <p className="font-display text-3xl text-[#5A6378] mt-0.5">{orders.filter(o => o.status === "Returned").length || 8}</p>
            <p className="text-[11px] text-[#5A6378]/80 mt-1">Refunded to customer</p>
          </div>
        </div>
      )}
    </div>
  );
}
