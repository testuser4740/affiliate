"use client";
import React, { useState, useEffect } from "react";
import NavLink from "@/components/NavLink";
import { useRouter } from "next/navigation";
import { Home, ListChecks, Trophy, Wallet, User, LogOut, Activity, Award, Bell, Mail, HelpCircle, Settings, Menu, X, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { tiers } from "@/data/options";
import { VersionToggle } from "@/hooks/useVersion";
import { useAuth } from "@/lib/auth";
import { useBackend } from "@/lib/useBackend";
import { backend } from "@/lib/apiHooks";

const mainNav = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/inbox", icon: Mail, label: "Inbox" },
  { to: "/dashboard/performance", icon: Activity, label: "Performance" },
  { to: "/dashboard/tier", icon: Award, label: "Tier" },
  { to: "/dashboard/tasks", icon: ListChecks, label: "Tasks" },
  { to: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/dashboard/payouts", icon: Wallet, label: "Payouts" },
  { to: "/dashboard/announcements", icon: Bell, label: "Announcements" },
];

const popupNav = [
  { to: "/dashboard/profile", icon: User, label: "My Profile" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "/dashboard/support", icon: HelpCircle, label: "Help Center" },
];

export default function AmbassadorLayout({ children }) {
  const navg = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const ambId = user?.ambassadorId;

  const ambassador = useBackend(() => backend.ambassadorHome(ambId).then(r => r.ambassador), null, [ambId], ["leaderboard", "orders", "commission", "ambassador_created"], ambId);
  const inboxMessages = useBackend(() => backend.ambassadorInbox(ambId), [], [ambId], ["inbox", "ambassador_created", "pocs", "announcements", "tasks"], ambId);

  const unread = inboxMessages.filter(m=>!m.read).length;
  console.log("Unread messages:", unread, inboxMessages);
  const tier = tiers.find(t => t.name === (ambassador?.tier?.name ?? "Bronze")) || tiers[0];
  const inTop10 = (ambassador?.rank ?? 0) <= 10;

  // Role-based guard: only ambassadors may access the dashboard.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || user?.role !== "ambassador") {
      navg.replace("/login");
    }
  }, [loading, isAuthenticated, user, navg]);

  const handleLogout = () => {
    setMenu(false);
    logout();
    navg.replace("/login");
  };

  if (loading || !isAuthenticated || user?.role !== "ambassador") {
    return <div className="min-h-screen bg-[#FFF7EE]" />;
  }

  const ambAvatar = ambassador?.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";
  const ambName = ambassador?.name ?? "Ambassador";
  const ambRank = ambassador?.rank ?? 0;

  return (
    <div className="min-h-screen bg-[#FFF7EE] flex">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EFEAE0] p-5 sticky top-0 h-screen overflow-y-auto">
        <Logo size="md" />
        <nav className="space-y-1 flex-1 mt-6">
          {mainNav.map(n => (
            <NavLink key={n.to} href={n.to} end={n.end} data-testid={`amb-nav-${n.label.toLowerCase().replace(/ /g,"-")}`}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm ${isActive ? "bg-[#F26B1F] text-white shadow-[0_4px_12px_rgba(242,107,31,0.30)]" : "text-[#5A6378] hover:bg-[#FFF7EE]"}`}>
              <n.icon className="w-5 h-5" strokeWidth={2.5} />{n.label}
              {n.label === "Inbox" && unread > 0 && <span className="ml-auto bg-[#F26B1F] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{unread}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0 pb-24 lg:pb-8">
        {/* Top bar with logo (mobile) on left + profile card & hamburger on right */}
        <div className="sticky top-0 z-30 bg-[#FFF7EE]/95 backdrop-blur border-b border-[#EFEAE0] px-4 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="lg:hidden"><Logo size="sm" showTag={false} /></div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-2">
            <VersionToggle />
            <button onClick={()=>setMenu(true)} className="relative flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full border border-[#EFEAE0] bg-white hover:border-[#F26B1F] hover:bg-[#FFF7EE] transition-all max-w-[300px]" data-testid="amb-profile-card">
              {inTop10 && (
                <span className="absolute -top-2 -left-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-br from-[#FFC93C] to-[#F26B1F] text-white text-[9px] font-extrabold uppercase tracking-wider shadow-[0_4px_10px_rgba(242,107,31,0.45)] ring-2 ring-white z-10" data-testid="top10-badge" title="You're in the Top 10 nationally">
                  <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                  Top 10
                </span>
              )}
              <img src={ambAvatar} alt="" className={`w-8 h-8 rounded-full object-cover flex-shrink-0 ${inTop10 ? "ring-2 ring-[#FFC93C]" : "ring-2 ring-[#F26B1F]/30"}`} />
              <div className="text-left min-w-0 hidden sm:block">
                <p className="font-bold text-sm leading-tight truncate text-[#1B2D54]">{ambName}</p>
                <p className="text-[10px] text-[#5A6378] truncate">Rank #{ambRank} • {ambassador?.tier?.name ?? "Bronze"}</p>
              </div>
              <span className="w-8 h-8 grid place-items-center rounded-full ml-1 flex-shrink-0" data-testid="amb-hamburger"><Menu className="w-5 h-5 text-[#1B2D54]" /></span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#EFEAE0] grid grid-cols-5">
          {mainNav.slice(0,5).map(n => (
            <NavLink key={n.to} href={n.to} end={n.end} data-testid={`amb-bnav-${n.label.toLowerCase().replace(/ /g,"-")}`}
              className={({isActive}) => `flex flex-col items-center justify-center py-2 text-[10px] font-extrabold uppercase tracking-wider ${isActive ? "text-[#F26B1F]" : "text-[#5A6378]"}`}>
              <n.icon className="w-5 h-5 mb-0.5" strokeWidth={2.5} />{n.label}
            </NavLink>
          ))}
        </nav>
      </main>

      {/* POPUP MENU */}
      {menu && (
        <div className="fixed inset-0 z-50" onClick={()=>setMenu(false)}>
          <div className="absolute inset-0 bg-[#1B2D54]/20" />
          <div className="absolute top-16 right-4 lg:right-8 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-[0_24px_60px_rgba(27,45,84,0.20)] border border-[#EFEAE0] overflow-hidden" onClick={e=>e.stopPropagation()} data-testid="amb-menu-popup">
            {/* Profile header */}
            <div className="p-5 flex items-center gap-3 border-b border-[#EFEAE0]">
              <img src={ambAvatar} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F26B1F]/30 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg leading-tight truncate">{ambName}</p>
                <p className="text-xs text-[#5A6378] truncate">{ambassador?.email ?? ""}</p>
              </div>
            </div>

            {/* Tier highlight section */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-bold text-[#5A6378] mb-2">My Tier</p>
              <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}dd)` }}>
                <div className="absolute top-3 right-3 w-12 h-12 grid place-items-center bg-white rounded-full text-2xl shadow-[0_2px_8px_rgba(0,0,0,0.15)]">{tier.icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white">{tier.name.toUpperCase()} TIER</p>
                <p className="font-display text-2xl mt-1 leading-tight pr-14">{tier.commission} commission <span className="opacity-90 text-base">| Rank #{ambRank}</span></p>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-white/95"><span className="w-2 h-2 rounded-full bg-[#F26B1F]" /><p className="text-xs font-extrabold" style={{ color: tier.color }}>Current tier</p></div>
              </div>
            </div>

            {/* Menu items */}
            <nav className="py-2">
              {popupNav.map(n => (
                <NavLink key={n.to} href={n.to} onClick={()=>setMenu(false)} data-testid={`amb-popup-${n.label.toLowerCase().replace(/ /g,"-")}`}
                  className={({isActive}) => `flex items-center gap-3 px-5 py-3 font-bold text-sm transition-colors ${isActive ? "bg-[#FFF7EE] text-[#F26B1F] border-l-2 border-[#F26B1F]" : "text-[#1B2D54] hover:bg-[#FFF7EE]"}`}>
                  <n.icon className="w-5 h-5" strokeWidth={2} />{n.label}
                </NavLink>
              ))}
              {/* Mobile-only: show remaining main nav items inside popup */}
              <div className="lg:hidden border-t border-[#EFEAE0] mt-1 pt-1">
                {mainNav.slice(5).map(n => (
                  <NavLink key={n.to} href={n.to} onClick={()=>setMenu(false)} className={({isActive}) => `flex items-center gap-3 px-5 py-3 font-bold text-sm transition-colors ${isActive ? "bg-[#FFF7EE] text-[#F26B1F]" : "text-[#1B2D54] hover:bg-[#FFF7EE]"}`}>
                    <n.icon className="w-5 h-5" strokeWidth={2} />{n.label}
                  </NavLink>
                ))}
              </div>
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 font-bold text-sm text-[#1B2D54] hover:bg-[#FEE2E2] hover:text-[#991B1B] border-t border-[#EFEAE0]" data-testid="amb-popup-logout">
                <LogOut className="w-5 h-5" strokeWidth={2} />Log out
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
