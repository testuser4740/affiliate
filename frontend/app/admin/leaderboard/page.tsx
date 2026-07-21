"use client";
import React, { useState } from "react";
import { Search, Medal } from "lucide-react";
import { states, cities } from "@/data/options";
import { useVersion } from "@/hooks/useVersion";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

export default function MasterLeaderboard() {
  const { isV2 } = useVersion();
  const [q, setQ] = useState("");
  const [stateF, setStateF] = useState("All States");
  const [cityF, setCityF] = useState("All Cities");
  const [duration, setDuration] = useState("All time");

  const leaderboard = useBackend(() => backend.masterLeaderboard().then(r => r.data), [], [], ["leaderboard", "orders", "commission", "ambassador_created"]);

  const filtered = leaderboard
    .filter(r => !isV2 || stateF === "All States" || r.state === stateF)
    .filter(r => !isV2 || cityF === "All Cities" || r.city === cityF)
    .filter(r => !isV2 || (r.name + r.college + r.city + r.state).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div><span className="gajab-sticker-yellow">Master Leaderboard</span><h1 className="font-display text-3xl sm:text-4xl mt-2">Revenue rankings</h1><p className="text-[#5A6378] mt-1">{isV2 ? `${filtered.length} of ${leaderboard.length} · Live ranking` : "Live ranking, sorted by revenue generated."}</p></div>
      {isV2 && (
        <div className="gajab-card p-4 grid lg:grid-cols-4 gap-3">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, college..." className="input-gajab pl-10" data-testid="lb-search" /></div>
          <select value={stateF} onChange={e=>setStateF(e.target.value)} className="input-gajab" data-testid="lb-state">{states.map(s=><option key={s}>{s}</option>)}</select>
          <select value={cityF} onChange={e=>setCityF(e.target.value)} className="input-gajab" data-testid="lb-city">{cities.map(c=><option key={c}>{c}</option>)}</select>
          <select value={duration} onChange={e=>setDuration(e.target.value)} className="input-gajab" data-testid="lb-duration"><option>All time</option><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option><option>This year</option></select>
        </div>
      )}
      <div className="gajab-card p-0 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-[#1B2D54] text-white"><tr className="text-left text-[10px] font-extrabold uppercase tracking-wider">
          <th className="p-3">Rank</th><th className="p-3">Ambassador</th><th className="p-3">College</th>{isV2 && <><th className="p-3">City</th><th className="p-3">State</th></>}<th className="p-3 text-right">Orders</th><th className="p-3 text-right">Revenue Generated</th>
        </tr></thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.rank} className={`border-b border-[#EFEAE0] ${r.rank<=3?"bg-[#FFF1C2]":""}`} data-testid={`master-row-${r.rank}`}>
              <td className="p-3">
                {r.rank<=3 ? (
                  <span className="inline-flex items-center gap-1.5" data-testid={`medal-${r.rank}`}>
                    <Medal className="w-6 h-6" strokeWidth={2} style={{ color: r.rank===1 ? "#D4A017" : r.rank===2 ? "#8E8E93" : "#B87333" }} />
                    <span className="font-display font-extrabold" style={{ color: r.rank===1 ? "#D4A017" : r.rank===2 ? "#5A6378" : "#8B4513" }}>#{r.rank}</span>
                  </span>
                ) : (
                  <span className="font-display font-extrabold text-xl text-[#1B2D54]">#{r.rank}</span>
                )}
              </td>
              <td className="p-3"><div className="flex items-center gap-2"><img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /><span className="font-bold">{r.name}</span></div></td>
              <td className="p-3">{r.college}</td>
              {isV2 && <><td className="p-3 text-xs">{r.city}</td><td className="p-3 text-xs">{r.state}</td></>}
              <td className="p-3 text-right font-bold">{r.orders}</td>
              <td className="p-3 text-right font-display font-extrabold">₹{r.revenue.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table></div></div>
    </div>
  );
}
