"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { backend } from "@/lib/apiHooks";
import type { Applicant } from "@/lib/apiHooks";

export default function AddAmbassador() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const nav = useRouter();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [commissionPct, setCommissionPct] = useState(5);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    backend
      .getApplicant(id)
      .then((a) => {
        setApplicant(a);
        setName(a.name);
        setEmail(a.email);
        setPhone(a.phone);
        setCollege(a.college);
        setCity(a.city);
        setState(a.state);
        setCommissionPct(a.commissionPct || 5);
      })
      .catch(() => toast.error("Could not load applicant"))
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      const ambassador = await backend.convertApplicant(id, {
        password,
        name,
        email,
        phone,
        college,
        city,
        state,
        commissionPct: Number(commissionPct),
      });
      toast.success(`${ambassador.name} is now an ambassador — login created!`);
      nav.push("/admin/directory");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create ambassador");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-[#5A6378]">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-bold">Loading applicant…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => nav.push("/admin/applicants")} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5A6378] hover:text-[#F26B1F] mb-4" data-testid="add-amb-back">
        <ArrowLeft className="w-4 h-4" /> Back to applicants
      </button>

      <span className="gajab-sticker-yellow">Onboarding</span>
      <h1 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">Add Ambassador</h1>
      <p className="text-[#5A6378] mt-1">
        Approved applicant <b>#{id}</b>. Set their login password and confirm profile details — this creates both the
        ambassador record and their login account.
      </p>

      <form onSubmit={submit} className="gajab-card p-6 mt-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-name" required />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Email (login)</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-email" required />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Phone</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-phone" required />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">College</span>
            <input value={college} onChange={(e) => setCollege(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-college" required />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">City</span>
            <input value={city} onChange={(e) => setCity(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-city" required />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">State</span>
            <input value={state} onChange={(e) => setState(e.target.value)} className="input-gajab mt-1" data-testid="add-amb-state" required />
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Starting commission (%)</span>
          <input
            type="number"
            min={0}
            max={100}
            value={commissionPct}
            onChange={(e) => setCommissionPct(Number(e.target.value))}
            className="input-gajab mt-1 w-32"
            data-testid="add-amb-commission"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Login password</span>
          <div className="relative mt-1">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="input-gajab pr-12"
              data-testid="add-amb-password"
              required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6378]">
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-[11px] text-[#5A6378] mt-1">This password is used by the ambassador to log in to their dashboard.</p>
        </label>

        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-60" data-testid="add-amb-submit">
          <UserPlus className="w-4 h-4" /> {busy ? "Creating…" : "Create Ambassador & Login"}
        </button>
      </form>
    </div>
  );
}
