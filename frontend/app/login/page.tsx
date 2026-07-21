"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useVersion } from "@/hooks/useVersion";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const nav = useRouter();
  const { isV2 } = useVersion();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) { toast.error("Enter your email and password"); return; }
    setBusy(true);
    try {
      const user = await login(email.trim().toLowerCase(), pwd);
      toast.success(`Welcome back, ${user.name || user.email}!`);
      // Role-based redirect
      if (user.role === "admin") nav.push("/admin");
      else nav.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative bg-[#F26B1F] text-white overflow-hidden">
        <img src="https://images.pexels.com/photos/15598638/pexels-photo-15598638.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Indian college students working together" className="absolute inset-0 w-full h-full object-cover opacity-45 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#F26B1F]/85 via-[#F26B1F]/70 to-[#1B2D54]/80" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #FFC93C 0%, transparent 40%), radial-gradient(circle at 80% 70%, #FFC93C 0%, transparent 40%)" }} />
        <div className="relative p-12 flex flex-col justify-between w-full">
          <Logo size="lg" variant="light" />
          <div>
            <p className="gajab-sticker-yellow inline-block mb-4">🏆 Top earners</p>
            <h2 className="font-display text-5xl font-extrabold leading-none">Welcome back,<br />Gajab champ.</h2>
            <p className="mt-4 text-white/85 max-w-md">Your dashboard&apos;s been waiting. New orders, leaderboard moves, and fresh tasks — all inside.</p>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <div className="bg-white/15 border border-white/25 rounded-xl p-3 backdrop-blur"><p className="text-xs opacity-80">This month</p><p className="font-display text-2xl font-extrabold">₹24K</p></div>
              <div className="bg-white/15 border border-white/25 rounded-xl p-3 backdrop-blur"><p className="text-xs opacity-80">Your rank</p><p className="font-display text-2xl font-extrabold">#7</p></div>
              <div className="bg-white/15 border border-white/25 rounded-xl p-3 backdrop-blur"><p className="text-xs opacity-80">Orders</p><p className="font-display text-2xl font-extrabold">184</p></div>
            </div>
            <div className="mt-8 inline-flex items-center gap-3 bg-white/15 border border-white/25 rounded-2xl p-3 pr-5 backdrop-blur max-w-md">
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/60" alt="" />
              <div><p className="text-sm font-bold">&quot;Made ₹68k last month sharing my link.&quot;</p><p className="text-[11px] opacity-80">— Aarav M., IIT Bombay · Rank #1</p></div>
            </div>
          </div>
          <p className="text-sm opacity-70">© 2026 Gajab Bazaar</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#FFF7EE]">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo size="md" /></div>
          <span className="gajab-sticker-yellow">Ambassador / Admin Login</span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-4">Login to your<br />Gajab profile.</h1>
          <p className="text-[#5A6378] mt-3">Enter your email and password to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</span>
              <input data-testid="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@gajab.com" autoComplete="email" className="input-gajab mt-1" />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Password</span>
              <div className="relative mt-1">
                <input data-testid="login-password" type={show ? "text" : "password"} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="input-gajab pr-12" />
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6378]">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </label>
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60" data-testid="login-submit-btn">
              {busy ? "Signing in..." : "Sign in"} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-[#5A6378] text-center">By continuing you agree to Gajab&apos;s Terms & Privacy Policy.</p>
          </form>

          <p className="mt-6 text-sm text-[#5A6378]">Not an ambassador yet? <Link href="/apply" className="font-bold text-[#F26B1F] underline" data-testid="login-apply-link">Apply via Campus →</Link></p>
        </div>
      </div>
    </div>
  );
}
