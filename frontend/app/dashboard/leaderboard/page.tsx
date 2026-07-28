"use client";
import React, { useState, useEffect, useRef } from "react";
import { Crown, Trophy, Medal, MapPin, Globe, Sparkles, X } from "lucide-react";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoading } from "@/lib/loading";

const PodiumCard = ({ rank, name, college, revenue, avatar, color, icon: Icon }) => (
  <div className={`gajab-card p-3 sm:p-4 text-center ${color} flex flex-col justify-end`}>
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2" strokeWidth={2.5} />
    <img src={avatar} alt="" className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full object-cover" />
    <p className="font-display text-2xl sm:text-3xl mt-1 sm:mt-2">#{rank}</p>
    <p className="font-display font-extrabold mt-1 truncate">{name}</p>
    <p className="text-[10px] sm:text-xs text-[#5A6378] truncate">{college}</p>
    <p className="font-display text-lg sm:text-xl mt-1 sm:mt-2">₹{(revenue/1000).toFixed(0)}K</p>
  </div>
);

const scopes = ["Overall", "My State", "My City"];

function LeaderboardSkeleton() {
  return (
    <div className="space-y-5 pb-20">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-64 sm:w-80" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Skeleton className="gajab-card p-3 sm:p-4 h-32" />
        <Skeleton className="gajab-card p-3 sm:p-4 h-40" />
        <Skeleton className="gajab-card p-3 sm:p-4 h-32" />
      </div>
      <div className="gajab-card p-2 sm:p-3">
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 items-center px-3 py-3">
              <Skeleton className="col-span-1 h-5 w-8" />
              <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="hidden sm:block sm:col-span-2 h-4 w-16" />
              <Skeleton className="hidden sm:block sm:col-span-2 h-4 w-16" />
              <Skeleton className="col-span-5 sm:col-span-2 text-right h-5 w-12 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId;
  const [scope, setScope] = useState("Overall");
  const [showTop10Popup, setShowTop10Popup] = useState(false);
  const firedRef = useRef(false);

  const leaderboard = useBackend(() => backend.publicLeaderboard().then(r => r), [], [], ["leaderboard", "orders", "commission", "ambassador_created"]);
  const ambassador = useBackend(() => backend.ambassadorHome(ambId).then(r => r.ambassador), null, [ambId], ["leaderboard", "orders", "commission"], ambId);
  const leaderboardLoading = getLoading(leaderboard, []) || ambassador === null;

  const ambState = ambassador?.state ?? "";
  const ambCity = ambassador?.city ?? "";
  const ambRank = ambassador?.rank ?? 0;

  let data = leaderboard;
  if (scope === "My State") data = leaderboard.filter(r => r.state === ambState);
  if (scope === "My City") data = leaderboard.filter(r => r.city === ambCity);
  const ranked = data.map((r, i) => ({ ...r, displayRank: i + 1, isYou: r.id === ambId }));
  const [first, second, third, ...rest] = ranked;

  useEffect(() => {
    const yourEntry = ranked.find(r => r.isYou);
    if (yourEntry && yourEntry.displayRank <= 10 && !firedRef.current) {
      firedRef.current = true;
      setShowTop10Popup(true);
      const brand = ["#F26B1F", "#FFC93C", "#1B2D54", "#10B981", "#EF4444"];
      import("canvas-confetti").then((mod) => {
        const confetti = mod.default;
        const shoot = (originX) => confetti({
          particleCount: 80,
          spread: 70,
          startVelocity: 45,
          origin: { x: originX, y: 0.6 },
          colors: brand,
        });
        shoot(0.25);
        setTimeout(() => shoot(0.75), 200);
        setTimeout(() => confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 }, colors: brand }), 400);
      });
    }
  }, [ranked]);

  if (leaderboardLoading) return <LeaderboardSkeleton />;

  const yourRank = ranked.find(r => r.isYou)?.displayRank || ambRank;

  return (
    <div className="space-y-5 pb-20">
      {/* Top-10 celebration popup */}
      {showTop10Popup && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[#1B2D54]/60 backdrop-blur-sm" data-testid="top10-popup" onClick={()=>setShowTop10Popup(false)}>
          <div onClick={e=>e.stopPropagation()} className="gajab-card p-8 max-w-md w-full text-center bg-gradient-to-br from-[#FFF7EE] to-white relative animate-in fade-in zoom-in duration-300">
            <button onClick={()=>setShowTop10Popup(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full grid place-items-center hover:bg-[#EFEAE0]" data-testid="top10-popup-close"><X className="w-4 h-4" /></button>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#FFC93C] to-[#F26B1F] grid place-items-center shadow-[0_10px_30px_rgba(242,107,31,0.4)]">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <span className="gajab-sticker-orange inline-flex items-center gap-1.5 mt-5"><Sparkles className="w-3.5 h-3.5" strokeWidth={2} /> Congratulations</span>
            <h2 className="font-display text-4xl font-extrabold mt-3 text-[#1B2D54]">You&apos;re in the Top 10!</h2>
            <p className="text-[#5A6378] mt-2">You&apos;re currently ranked <b className="font-display text-2xl text-[#F26B1F]">#{yourRank}</b> in the {scope.toLowerCase()} board. Keep pushing — quarterly prizes are within reach.</p>
            <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
              <div className="px-3 py-1.5 rounded-full bg-[#FFF1C2] border border-[#FFC93C]/60 text-xs font-bold text-[#92400E]">Silver Tier bonus unlocked</div>
              <div className="px-3 py-1.5 rounded-full bg-[#E6F8EF] border border-[#10B981]/40 text-xs font-bold text-[#065F46]">Founder LOR nomination</div>
            </div>
            <button onClick={()=>setShowTop10Popup(false)} className="btn-primary mt-6" data-testid="top10-popup-continue">Keep Hustling <Trophy className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      <div>
        <span className="gajab-sticker-yellow inline-flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" strokeWidth={2} /> The Big Board</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Top hustlers, ranked.</h1>
        <p className="text-[#5A6378] mt-1">Updated live. Race to the top is real.</p>
      </div>

      <div className="flex gap-2">
        {scopes.map(s => (
          <button key={s} onClick={() => { setScope(s); firedRef.current = false; }} className={`nav-tab border inline-flex items-center gap-1.5 ${scope===s ? "bg-[#1B2D54] text-white border-[#1B2D54]" : "bg-white border-[#EFEAE0] text-[#5A6378]"}`} data-testid={`lb-scope-${s.toLowerCase().replace(/ /g,"-")}`}>
            {s === "Overall" ? <><Globe className="w-3.5 h-3.5" strokeWidth={2} /> Overall</> : s === "My State" ? <><MapPin className="w-3.5 h-3.5" strokeWidth={2} /> {ambState}</> : <><MapPin className="w-3.5 h-3.5" strokeWidth={2} /> {ambCity}</>}
          </button>
        ))}
      </div>

      {first && second && third && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <PodiumCard rank={second.displayRank} name={second.name} college={second.college} revenue={second.revenue} avatar={second.avatar} icon={Trophy} color="bg-[#F3EFE9]" />
          <PodiumCard rank={first.displayRank} name={first.name} college={first.college} revenue={first.revenue} avatar={first.avatar} icon={Crown} color="bg-gradient-to-br from-[#FFC93C] to-[#FFB81C]" />
          <PodiumCard rank={third.displayRank} name={third.name} college={third.college} revenue={third.revenue} avatar={third.avatar} icon={Medal} color="bg-[#FFE3E5]" />
        </div>
      )}

      <div className="gajab-card p-2 sm:p-3">
        <div className="grid grid-cols-12 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[#5A6378]">
          <div className="col-span-1">Rank</div>
          <div className="col-span-6 sm:col-span-5">Name</div>
          <div className="hidden sm:block sm:col-span-2">City</div>
          <div className="hidden sm:block sm:col-span-2">State</div>
          <div className="col-span-5 sm:col-span-2 text-right">Revenue</div>
        </div>
        {rest.map(r => (
          <div key={r.rank} className={`grid grid-cols-12 items-center px-3 py-3 rounded-xl ${r.isYou ? "bg-[#FFF7EE] border border-[#F26B1F]/40" : "hover:bg-[#FFF7EE]"}`} data-testid={`leaderboard-row-${r.rank}`}>
            <div className="col-span-1 font-display text-lg">#{r.displayRank}</div>
            <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
              <img src={r.avatar} className="w-9 h-9 rounded-full object-cover" alt="" />
              <div className="min-w-0">
                <p className="font-bold truncate">{r.name} {r.isYou && <span className="gajab-sticker-orange text-[9px] ml-1">YOU</span>}</p>
                <p className="text-xs text-[#5A6378] sm:hidden truncate">{r.city}, {r.state}</p>
              </div>
            </div>
            <div className="hidden sm:block sm:col-span-2 text-sm text-[#5A6378]"><MapPin className="w-3 h-3 inline mr-0.5" />{r.city}</div>
            <div className="hidden sm:block sm:col-span-2 text-sm text-[#5A6378]">{r.state}</div>
            <div className="col-span-5 sm:col-span-2 text-right font-display">₹{(r.revenue/1000).toFixed(0)}K</div>
          </div>
        ))}
        {rest.length === 0 && <p className="p-6 text-center text-sm text-[#5A6378]">No other ambassadors in this scope yet.</p>}
      </div>

      <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-8 lg:w-80 z-20 gajab-card p-3 bg-[#1B2D54] text-white flex items-center gap-3 shadow-2xl">
        <div className="font-display text-3xl text-[#FFC93C]">#{ambRank}</div>
        <div className="flex-1 min-w-0"><p className="text-xs uppercase font-extrabold tracking-wider opacity-70">Your overall rank</p><p className="font-bold truncate">{ambassador?.name ?? "You"}</p></div>
        <div className="text-right"><p className="font-display text-lg">₹{ambassador?.revenue ? (ambassador.revenue/1000).toFixed(0) + "K" : "0"}</p></div>
      </div>
    </div>
  );
}
