"use client";
import React, { useEffect } from "react";
import NavLink from "@/components/NavLink";
import { useRouter } from "next/navigation";
import { UserCheck, Users, ListChecks, Trophy, BarChart3, Activity, LogOut, Link2, Megaphone, HeadphonesIcon } from "lucide-react";
import Logo from "@/components/Logo";
import { VersionToggle } from "@/hooks/useVersion";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/admin/applicants", icon: UserCheck, label: "Applicants" },
  { to: "/admin/directory", icon: Users, label: "Directory" },
  { to: "/admin/affiliate-urls", icon: Link2, label: "Affiliate URLs" },
  { to: "/admin/tasks", icon: ListChecks, label: "Tasks" },
  { to: "/admin/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/admin/utilization", icon: Activity, label: "Commissions" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/admin/support", icon: HeadphonesIcon, label: "Support" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminLayout({ children }) {
  const navg = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();

  // Role-based guard: only admins may access the admin console.
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || user?.role !== "admin") {
      navg.replace("/login");
    }
  }, [loading, isAuthenticated, user, navg]);

  const handleLogout = () => {
    logout();
    navg.replace("/login");
  };

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <div className="min-h-screen bg-[#FFF7EE]" />;
  }

  return (
    <div className="min-h-screen bg-[#FFF7EE] flex">
      <aside className="w-64 bg-[#1B2D54] text-white p-5 sticky top-0 h-screen hidden md:flex flex-col">
        <Logo size="md" showTag={false} variant="light" />
        <div className="mt-3 flex items-center gap-2"><span className="gajab-sticker-orange">ADMIN CONSOLE</span><VersionToggle /></div>
        <nav className="space-y-1 mt-6 flex-1">
          {nav.map(n => (
            <NavLink key={n.to} href={n.to} data-testid={`admin-nav-${n.label.toLowerCase().replace(/ /g,"-")}`}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm ${isActive ? "bg-[#F26B1F] text-white shadow-[0_4px_12px_rgba(242,107,31,0.30)]" : "text-white/70 hover:bg-white/10"}`}>
              <n.icon className="w-5 h-5" strokeWidth={2.5} />{n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-white/70 hover:bg-white/10" data-testid="admin-logout">
          <LogOut className="w-5 h-5" />Exit Admin
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="md:hidden p-4 bg-[#1B2D54] text-white flex items-center justify-between">
          <Logo size="sm" showTag={false} variant="light" />
          <div className="flex items-center gap-2"><VersionToggle /><span className="gajab-sticker-orange">ADMIN</span></div>
        </div>
        <div className="md:hidden p-2 bg-white border-b border-[#EFEAE0] overflow-x-auto">
          <div className="flex gap-2">
            {nav.map(n => (
              <NavLink key={n.to} href={n.to} className={({isActive}) => `whitespace-nowrap nav-tab border ${isActive ? "bg-[#F26B1F] text-white border-[#F26B1F]" : "bg-white border-[#EFEAE0] text-[#5A6378]"}`}>{n.label}</NavLink>
            ))}
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
