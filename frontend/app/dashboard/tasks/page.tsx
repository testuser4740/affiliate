"use client";
import React, { useState } from "react";
import { Clock, CheckCircle2, AlertCircle, Send, XCircle, RotateCw, HeadphonesIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";

const DEMO_AMB_ID = "amb_005";

const tabs = ["Pending", "Under Review", "Rejected", "Approved"];

export default function Tasks() {
  const nav = useRouter();
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const [active, setActive] = useState("Pending");
  const [openId, setOpenId] = useState(null);
  const [proof, setProof] = useState("");

  const tasks = useBackend(() => backend.listTasks(ambId), [], [ambId], ["tasks"], ambId);
  const filtered = tasks.filter(t => t.status === active);
  const submit = (id) => {
    if (!proof.trim()) { toast.error("Add a link or note"); return; }
    toast.success(active === "Rejected" ? "Resubmitted for review!" : "Submitted for review!");
    setOpenId(null); setProof("");
  };
  const Icon = active === "Pending" ? Clock : active === "Under Review" ? AlertCircle : active === "Rejected" ? XCircle : CheckCircle2;

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Tasks Hub</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Earn extra ₹ with tasks.</h1>
        <p className="text-[#5A6378] mt-1">Monthly missions from Gajab HQ. Complete & submit proof.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setActive(t)} className={`nav-tab whitespace-nowrap border ${active===t ? "bg-[#1B2D54] text-white border-[#1B2D54]" : "bg-white text-[#1B2D54] border-[#EFEAE0]"}`} data-testid={`tasks-tab-${t.toLowerCase().replace(/ /g,"-")}`}>
            {t} <span className="opacity-60">({tasks.filter(x=>x.status===t).length})</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 && (
          <div className="gajab-card-soft p-10 text-center"><Icon className="w-10 h-10 mx-auto opacity-30" /><p className="mt-3 font-bold">No {active.toLowerCase()} tasks</p></div>
        )}
        {filtered.map(t => (
          <div key={t.id} className="gajab-card p-5" data-testid={`task-${t.id}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5A6378]">{t.id}</span>
                  <span className="gajab-sticker-yellow text-[10px]">₹{t.reward}</span>
                </div>
                <h4 className="font-display text-lg sm:text-xl">{t.title}</h4>
                <p className="text-sm text-[#5A6378] mt-1">{t.description}</p>
                <p className="text-xs text-[#5A6378] mt-2"><Clock className="w-3 h-3 inline mr-1" />Deadline: <b className="text-[#1B2D54]">{t.deadline}</b></p>
                {active === "Rejected" && t.rejectReason && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FEE2E2] border border-[#991B1B]/30 text-sm">
                    <p className="font-bold text-[#991B1B] flex items-center gap-1"><XCircle className="w-4 h-4" /> Rejection reason</p>
                    <p className="text-[#991B1B] mt-1">{t.rejectReason}</p>
                    <button onClick={()=>nav.push("/dashboard/support")} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#991B1B] hover:text-white hover:bg-[#991B1B] border border-[#991B1B]/40 px-3 py-1.5 rounded-full transition-all" data-testid={`contact-poc-${t.id}`}><HeadphonesIcon className="w-3 h-3" /> Contact your POC</button>
                  </div>
                )}
                {t.submission && active === "Under Review" && (
                  <div className="mt-3 p-3 rounded-xl bg-[#FEF3C7] border border-[#92400E]/30 text-xs"><b>Your submission:</b> {t.submission}</div>
                )}
              </div>
              {active === "Pending" && <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="btn-primary" data-testid={`submit-task-${t.id}`}><Send className="w-4 h-4" /> Submit</button>}
              {active === "Rejected" && <button onClick={() => setOpenId(openId === t.id ? null : t.id)} className="btn-primary" data-testid={`resubmit-task-${t.id}`}><RotateCw className="w-4 h-4" /> Resubmit</button>}
              {active === "Approved" && <span className="gajab-sticker bg-[#D1FAE5] text-[#065F46] border border-[#065F46]/40">✓ Approved</span>}
            </div>
            {openId === t.id && (
              <div className="mt-4 pt-4 border-t border-dashed border-[#EFEAE0]">
                <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">{active === "Rejected" ? "Updated proof (link or note)" : "Proof (link or note)"}</span>
                  <textarea value={proof} onChange={e=>setProof(e.target.value)} rows={3} placeholder="Paste your Insta link, drive URL, or describe your submission..." className="input-gajab mt-1 py-3 h-auto resize-none" data-testid={`proof-input-${t.id}`} />
                </label>
                <div className="mt-3 flex gap-2 justify-end">
                  <button onClick={()=>setOpenId(null)} className="btn-ghost">Cancel</button>
                  <button onClick={()=>submit(t.id)} className="btn-primary" data-testid={`proof-submit-${t.id}`}>{active === "Rejected" ? "Resubmit" : "Submit Proof"}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
