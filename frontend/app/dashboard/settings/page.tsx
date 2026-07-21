"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Bell, ShieldCheck, PauseCircle, Lock, Eye, EyeOff, Check, X, Calendar } from "lucide-react";
import { useVersion } from "@/hooks/useVersion";

const Toggle = ({ label, defaultChecked = true }) => (
  <label className="flex items-center justify-between p-3 rounded-xl border border-[#EFEAE0]">
    <span className="text-sm font-bold">{label}</span>
    <input type="checkbox" defaultChecked={defaultChecked} className="w-10 h-5 appearance-none rounded-full bg-[#EFEAE0] checked:bg-[#F26B1F] relative cursor-pointer transition-colors" />
  </label>
);

const fmt = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export default function AccountSettings() {
  const { isV2 } = useVersion();

  // Change password inline form
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwShow, setPwShow] = useState(false);

  const savePassword = () => {
    if (!pwCurrent) return toast.error("Current password required");
    if (pwNew.length < 8) return toast.error("New password must be at least 8 characters");
    if (pwNew !== pwConfirm) return toast.error("Passwords do not match");
    toast.success("Password updated successfully");
    setPwOpen(false); setPwCurrent(""); setPwNew(""); setPwConfirm("");
  };
  const cancelPassword = () => { setPwOpen(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); };

  // Pause account with date range
  const [pauseOpen, setPauseOpen] = useState(false);
  const [pauseFrom, setPauseFrom] = useState("");
  const [pauseTo, setPauseTo] = useState("");
  const [pauseActive, setPauseActive] = useState(null); // { from, to } once confirmed

  const confirmPause = () => {
    if (!pauseFrom || !pauseTo) return toast.error("Select both start and end dates");
    if (new Date(pauseTo) <= new Date(pauseFrom)) return toast.error("End date must be after start date");
    setPauseActive({ from: pauseFrom, to: pauseTo });
    setPauseOpen(false);
    toast.success(`Account will be paused from ${fmt(pauseFrom)} until ${fmt(pauseTo)}`);
  };
  const cancelPause = () => { setPauseOpen(false); setPauseFrom(""); setPauseTo(""); };
  const resumeAccount = () => { setPauseActive(null); toast.success("Account resumed. Welcome back!"); };

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Account</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Account settings</h1>
        <p className="text-[#5A6378] mt-1">Notifications, security & account controls.</p>
      </div>

      <div className="gajab-card p-5 space-y-2">
        <h3 className="font-display text-lg mb-2 flex items-center gap-2"><Bell className="w-5 h-5 text-[#F26B1F]" /> Notifications</h3>
        <Toggle label="WhatsApp updates from admin" />
        <Toggle label="Email notifications" />
        <Toggle label="In-app inbox alerts" />
        <Toggle label="New task notifications" />
        <Toggle label="Tier upgrade celebrations" />
      </div>

      <div className={`gajab-card p-5 space-y-3 ${isV2 ? "hidden" : ""}`}>
        <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Language</span>
          <select className="input-gajab mt-1"><option>English</option><option>हिंदी (Hindi)</option><option>தமிழ் (Tamil)</option><option>తెలుగు (Telugu)</option><option>বাংলা (Bengali)</option></select>
        </label>
        <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Time zone</span>
          <select className="input-gajab mt-1"><option>Asia/Kolkata (IST)</option></select>
        </label>
      </div>

      <div className="gajab-card p-5 space-y-4">
        <h3 className="font-display text-lg flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#F26B1F]" /> Security</h3>

        {/* Change password — inline expandable form */}
        <div className="rounded-xl border border-[#EFEAE0] overflow-hidden">
          <button onClick={()=>setPwOpen(!pwOpen)} className="w-full flex items-center justify-between p-3 hover:bg-[#FFF7EE]" data-testid="change-password-toggle">
            <span className="font-bold text-sm inline-flex items-center gap-2"><Lock className="w-4 h-4 text-[#F26B1F]" /> Change password</span>
            <span className="text-xs font-bold text-[#5A6378]">{pwOpen ? "Cancel" : "Edit"}</span>
          </button>
          {pwOpen && (
            <div className="p-4 space-y-3 border-t border-[#EFEAE0] bg-[#FFF7EE]/40" data-testid="change-password-form">
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Current password</span>
                <input type={pwShow ? "text" : "password"} value={pwCurrent} onChange={e=>setPwCurrent(e.target.value)} placeholder="Enter current password" className="input-gajab mt-1" data-testid="pw-current" />
              </label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">New password</span>
                <input type={pwShow ? "text" : "password"} value={pwNew} onChange={e=>setPwNew(e.target.value)} placeholder="At least 8 characters" className="input-gajab mt-1" data-testid="pw-new" />
              </label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Confirm new password</span>
                <input type={pwShow ? "text" : "password"} value={pwConfirm} onChange={e=>setPwConfirm(e.target.value)} placeholder="Re-type new password" className="input-gajab mt-1" data-testid="pw-confirm" />
              </label>
              <button type="button" onClick={()=>setPwShow(!pwShow)} className="text-xs font-bold text-[#F26B1F] inline-flex items-center gap-1 hover:underline" data-testid="pw-toggle-visibility">
                {pwShow ? <><EyeOff className="w-3.5 h-3.5" /> Hide passwords</> : <><Eye className="w-3.5 h-3.5" /> Show passwords</>}
              </button>
              <div className="flex gap-2 pt-1">
                <button onClick={savePassword} className="btn-primary text-sm" data-testid="pw-save"><Check className="w-4 h-4" /> Save</button>
                <button onClick={cancelPassword} className="btn-ghost text-sm" data-testid="pw-cancel"><X className="w-4 h-4" /> Cancel</button>
              </div>
            </div>
          )}
        </div>

        {!isV2 && <button className="btn-ghost w-full justify-start" onClick={()=>toast.success("2FA enabled")}>Enable two-factor auth</button>}

        {/* Pause account with date range */}
        {pauseActive ? (
          <div className="rounded-xl border border-[#FFC93C] bg-[#FFF1C2] p-4" data-testid="pause-active-banner">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="font-bold text-[#92400E] inline-flex items-center gap-2"><PauseCircle className="w-4 h-4" /> Account paused</p>
                <p className="text-xs text-[#92400E]/90 mt-1">Paused from <b>{fmt(pauseActive.from)}</b></p>
                <p className="text-sm text-[#92400E] font-display mt-1" data-testid="pause-until-text">Paused until <b className="text-lg">{fmt(pauseActive.to)}</b></p>
              </div>
              <button onClick={resumeAccount} className="btn-primary text-xs h-8" data-testid="resume-account-btn">Resume now</button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#EFEAE0] overflow-hidden">
            <button onClick={()=>setPauseOpen(!pauseOpen)} className="w-full flex items-center justify-between p-3 hover:bg-[#FEF3C7]/50" data-testid="pause-account-btn">
              <span className="font-bold text-sm inline-flex items-center gap-2 text-[#92400E]"><PauseCircle className="w-4 h-4" /> Pause my account</span>
              <span className="text-xs font-bold text-[#5A6378]">{pauseOpen ? "Cancel" : "Set dates"}</span>
            </button>
            {pauseOpen && (
              <div className="p-4 space-y-3 border-t border-[#EFEAE0] bg-[#FEF3C7]/30" data-testid="pause-date-form">
                <p className="text-xs text-[#92400E]">Choose the date range for which your account should be paused. You&apos;ll be auto-resumed on the end date.</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> Pause from</span>
                    <input type="date" value={pauseFrom} onChange={e=>setPauseFrom(e.target.value)} min={new Date().toISOString().slice(0,10)} className="input-gajab mt-1" data-testid="pause-from" />
                  </label>
                  <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378] inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> Pause until</span>
                    <input type="date" value={pauseTo} onChange={e=>setPauseTo(e.target.value)} min={pauseFrom || new Date().toISOString().slice(0,10)} className="input-gajab mt-1" data-testid="pause-to" />
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={confirmPause} className="btn-primary text-sm" data-testid="pause-confirm"><Check className="w-4 h-4" /> Confirm pause</button>
                  <button onClick={cancelPause} className="btn-ghost text-sm" data-testid="pause-cancel"><X className="w-4 h-4" /> Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-[11px] text-[#5A6378] pl-1">You can pause activity anytime. All your data, earnings history and tier progress will be preserved.</p>
      </div>

      <button className="btn-primary w-full" onClick={()=>toast.success("Settings saved")}>Save changes</button>
    </div>
  );
}
