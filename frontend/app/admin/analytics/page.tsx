"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Filter, Search, ShoppingBag, Repeat } from "lucide-react";

const AnalyticsBarChart = dynamic(() => import("@/components/AnalyticsCharts").then(m => m.AnalyticsBarChart), { ssr: false });
const AnalyticsPieChart = dynamic(() => import("@/components/AnalyticsCharts").then(m => m.AnalyticsPieChart), { ssr: false });
import { useVersion } from "@/hooks/useVersion";
import { useBackend } from "@/lib/useBackend";
import { backend } from "@/lib/apiHooks";
import { states, cities } from "@/data/options";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoading } from "@/lib/loading";

const Kpi = ({ label, value, sub, bg }) => (
  <div className={`gajab-card p-5 ${bg}`}><p className="text-xs uppercase font-extrabold tracking-wider opacity-70">{label}</p><p className="font-display text-4xl mt-1">{value}</p>{sub && <p className="text-xs text-[#5A6378] mt-1">{sub}</p>}</div>
);

function AnalyticsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
      </div>
      <div className="gajab-card p-4 grid lg:grid-cols-4 gap-3">
        <div className="space-y-2"><Skeleton className="h-3 w-16 mb-1" /><Skeleton className="h-10 w-full rounded-lg" /></div>
        <div className="space-y-2"><Skeleton className="h-3 w-12 mb-1" /><Skeleton className="h-10 w-full rounded-lg" /></div>
        <div className="space-y-2"><Skeleton className="h-3 w-8 mb-1" /><Skeleton className="h-10 w-full rounded-lg" /></div>
        <div className="space-y-2"><Skeleton className="h-3 w-10 mb-1" /><Skeleton className="h-10 w-full rounded-lg" /></div>
      </div>
      <div className="gajab-card p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 flex-1 min-w-[240px] max-w-md rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`gajab-card p-5 space-y-2 ${["bg-[#FFE9D9]", "bg-[#FFF1C2]", "bg-[#D1FAE5]", "bg-[#E0E7FF]"][i]}`}>
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="gajab-card p-5"><Skeleton className="h-64 w-full rounded-lg" /></div>
        <div className="gajab-card p-5"><Skeleton className="h-64 w-full rounded-lg" /></div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="gajab-card p-6 bg-gradient-to-br from-[#E0E7FF] to-white space-y-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="gajab-card p-6 bg-gradient-to-br from-[#FFE9D9] to-white space-y-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { isV2 } = useVersion();
  const [frequency, setFrequency] = useState("Weekly");
  const [stateF, setStateF] = useState("All States");
  const [cityF, setCityF] = useState("All Cities");
  const [scope, setScope] = useState("Overall");
  const [ambSearch, setAmbSearch] = useState("");
  const [selectedAmb, setSelectedAmb] = useState(null);

  const adminKpis = useBackend(() => backend.analyticsKpis().then(r => r), {}, [], ["analytics"]);
  const trendData = useBackend(() => backend.analyticsTrend().then(r => r), [], [], ["orders", "analytics"]);
  const leaderboard = useBackend(() => backend.masterLeaderboard().then(r => r.data), [], [], ["leaderboard", "orders", "commission", "ambassador_created"]);
  const analyticsLoading = getLoading(adminKpis, {}) || getLoading(trendData, []) || getLoading(leaderboard, []);

  const convData = adminKpis.conversionWithRef !== undefined ? [{ name: "With Referral", value: adminKpis.conversionWithRef }, { name: "Without Referral", value: adminKpis.conversionWithoutRef }] : [];

  const ambMatches = ambSearch.trim().length >= 1
    ? leaderboard.filter(a => a.name.toLowerCase().includes(ambSearch.toLowerCase()) || a.college.toLowerCase().includes(ambSearch.toLowerCase())).slice(0, 6)
    : [];

  // Derive stats from selected scope
  const activeAmbName = selectedAmb ? selectedAmb.name : "";

  if (analyticsLoading) return <AnalyticsSkeleton />;

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Analytics</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Program performance</h1>
      </div>

      <div className="gajab-card p-4 grid lg:grid-cols-4 gap-3">
        <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mb-1 flex items-center gap-1"><Filter className="w-3 h-3" /> Frequency</span>
          <select value={frequency} onChange={e=>setFrequency(e.target.value)} className="input-gajab h-10" data-testid="analytics-frequency"><option>Daily</option><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Yearly</option>{isV2 && <option>Custom Date</option>}</select>
          {isV2 && frequency === "Custom Date" && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <input type="date" className="input-gajab h-9 text-xs" data-testid="analytics-custom-from" />
              <input type="date" className="input-gajab h-9 text-xs" data-testid="analytics-custom-to" />
            </div>
          )}
        </div>
        <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mb-1">State</span><select value={stateF} onChange={e=>setStateF(e.target.value)} className="input-gajab h-10" data-testid="analytics-state">{states.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mb-1">City</span><select value={cityF} onChange={e=>setCityF(e.target.value)} className="input-gajab h-10" data-testid="analytics-city">{cities.map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="flex flex-col"><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mb-1">Scope</span><select value={scope} onChange={e=>setScope(e.target.value)} className="input-gajab h-10" data-testid="analytics-scope"><option>Overall</option><option>By tier</option><option>By college</option><option>By channel</option></select></div>
      </div>

      <p className="text-xs text-[#5A6378]">Showing: <b className="text-[#1B2D54]">{frequency}</b> · <b className="text-[#1B2D54]">{stateF}</b> · <b className="text-[#1B2D54]">{cityF}</b> · <b className="text-[#1B2D54]">{scope}</b>{selectedAmb && (<> · <b className="text-[#F26B1F]">Ambassador: {activeAmbName}</b> <button onClick={()=>{setSelectedAmb(null); setAmbSearch("");}} className="ml-1 text-[#F26B1F] underline">clear</button></>)}</p>

      {/* Individual-level lookup */}
      <div className="gajab-card p-4" data-testid="analytics-ambassador-search">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] flex items-center gap-1"><Search className="w-3 h-3" /> Drill into a specific ambassador</span>
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" />
            <input value={ambSearch} onChange={e=>{setAmbSearch(e.target.value); if (!e.target.value) setSelectedAmb(null);}} placeholder="Search ambassador by name or college..." className="input-gajab pl-10 h-10" data-testid="analytics-amb-input" />
          </div>
        </div>
        {ambMatches.length > 0 && !selectedAmb && (
          <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2" data-testid="analytics-amb-matches">
            {ambMatches.map(a => (
              <button key={a.rank} onClick={()=>setSelectedAmb(a)} className="flex items-center gap-2 p-2 rounded-lg border border-[#EFEAE0] hover:border-[#F26B1F] hover:bg-[#FFF7EE] text-left transition-all">
                <img src={a.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0"><p className="font-bold text-sm">{a.name}</p><p className="text-[10px] text-[#5A6378]">{a.college} · #{a.rank}</p></div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="% Orders w/ Referral" value={`${adminKpis.refOrdersPercent ?? 0}%`} sub="of total orders" bg="bg-[#FFE9D9]" />
        <Kpi label="Conversion w/ Ref" value={`${adminKpis.conversionWithRef ?? 0}%`} sub={`vs ${adminKpis.conversionWithoutRef ?? 0}% without`} bg="bg-[#FFF1C2]" />
        <Kpi label="Total Commission Paid" value={`₹${((adminKpis.totalCommissionPaid ?? 0)/100000).toFixed(1)}L`} sub="lifetime to date" bg="bg-[#D1FAE5]" />
        <Kpi label="Total GMV via Refs" value={`₹${((adminKpis.totalGMV ?? 0)/100000).toFixed(1)}L`} sub="from referral orders" bg="bg-[#E0E7FF]" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <AnalyticsBarChart data={trendData} frequency={frequency} />
        <AnalyticsPieChart data={convData} />
      </div>

      {/* New vs Repeat orders */}
      <div className="grid sm:grid-cols-2 gap-4" data-testid="new-vs-repeat">
        <div className="gajab-card p-6 bg-gradient-to-br from-[#E0E7FF] to-white">
          <div className="w-10 h-10 rounded-full grid place-items-center bg-white shadow"><ShoppingBag className="w-5 h-5 text-[#3730A3]" strokeWidth={2.5} /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#3730A3] mt-3">New Orders</p>
          <p className="font-display text-5xl text-[#1B2D54] mt-1">{adminKpis.newOrders ?? 0}</p>
          <p className="text-xs text-[#5A6378] mt-2">First-time buyers this {frequency.toLowerCase()} · <b className="text-[#3730A3]">+18%</b> vs prior period</p>
        </div>
        <div className="gajab-card p-6 bg-gradient-to-br from-[#FFE9D9] to-white">
          <div className="w-10 h-10 rounded-full grid place-items-center bg-white shadow"><Repeat className="w-5 h-5 text-[#C9450C]" strokeWidth={2.5} /></div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9450C] mt-3">Repeat Orders</p>
          <p className="font-display text-5xl text-[#1B2D54] mt-1">{adminKpis.repeatOrders ?? 0}</p>
          <p className="text-xs text-[#5A6378] mt-2">Returning customers · <b className="text-[#C9450C]">26.4%</b> repeat rate</p>
        </div>
      </div>
    </div>
  );
}
