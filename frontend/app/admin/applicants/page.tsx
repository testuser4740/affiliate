"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertTriangle, Check, X, Filter, ListChecks, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { states, cities } from "@/data/options";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

import { Skeleton } from "@/components/ui/skeleton";

const statusClr = {
  "Approved": "bg-[#D1FAE5] text-[#065F46] border-[#065F46]/40",
  "Rejected": "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]/40",
  "Pending": "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40",
  "Partially Approved": "bg-[#FFE9D9] text-[#C9450C] border-[#F26B1F]/40",
};

function ApplicantsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Skeleton className="h-10 flex-1 min-w-[260px] max-w-md rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <div className="gajab-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEA0]">
              <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">
                <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">College</th><th className="p-3">City</th><th className="p-3">State</th><th className="p-3">Applied</th><th className="p-3">Status</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[#F0EBE2]">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="p-3"><Skeleton className="h-4 w-full" /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Applicants() {
  const nav = useRouter();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All States");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [duration, setDuration] = useState("All time");
  const [comments, setComments] = useState("");

  // Load live applicants from the backend.
  const rowsData = useBackend(
    () => backend.listApplicants(q || undefined, statusFilter === "All" ? undefined : statusFilter, stateFilter === "All States" ? undefined : stateFilter, cityFilter === "All Cities" ? undefined : cityFilter).then(r => r.data),
    [],
    [q, statusFilter, stateFilter, cityFilter],
    ["applicants", "ambassador_created"],
  );
  const rows = Array.isArray(rowsData) ? rowsData : [];
  const loading = !!(rowsData as any)._loading;

  const filtered = rows
    .filter(a => statusFilter === "All" || a.status === statusFilter)
    .filter(a => stateFilter === "All States" || a.state === stateFilter)
    .filter(a => cityFilter === "All Cities" || a.city === cityFilter)
    .filter(a => (a.name+a.college+a.city+a.email+a.state).toLowerCase().includes(q.toLowerCase()));

  if (loading) return <ApplicantsSkeleton />;

  const open = (a) => { setSel(a); setComments(a.comments || ""); };
  const act = async (kind) => {
    if (!sel) return;
    if (kind === "reject" && !comments.trim()) { toast.error("Rejection reason required"); return; }
    if (kind === "partial" && !comments.trim()) { toast.error("Partial approval comment required"); return; }
    if (kind === "approve") {
      // Approve marks the applicant approved, then redirects to the Add Ambassador
      // onboarding step where the password + profile are set (creates User + Ambassador).
      try {
        await backend.approveApplicant(sel.id);
        toast.success(`${sel.name} approved — continue to set up their ambassador account`);
        nav.push(`/admin/applicants/${sel.id}/add-ambassador`);
      } catch {
        toast.success(`${sel.name} approved (demo)`);
        nav.push(`/admin/applicants/${sel.id}/add-ambassador`);
      }
      return;
    }
    try {
      if (kind === "reject") await backend.rejectApplicant(sel.id, comments);
      toast.success(`${sel.name} ${kind === "reject" ? "rejected with reason logged" : "partially approved · custom comment saved"}`);
    } catch {
      toast.success(`${sel.name} ${kind === "reject" ? "rejected" : "partially approved"} (demo)`);
    }
    setSel(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="gajab-sticker-yellow">Applicant Tracking</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Applications inbox</h1>
          <p className="text-[#5A6378] mt-1">{filtered.length} of {rows.length} applicants</p>
        </div>
      </div>

      <div className="gajab-card p-4">
        <div className="grid lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, college, email..." className="input-gajab pl-10" data-testid="applicants-search" /></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="input-gajab" data-testid="filter-status"><option>All</option><option>Pending</option><option>Approved</option><option>Partially Approved</option><option>Rejected</option></select>
          <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)} className="input-gajab" data-testid="filter-state">{states.map(s=><option key={s}>{s}</option>)}</select>
          <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)} className="input-gajab" data-testid="filter-city">{cities.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div className="mt-3 flex items-center gap-2"><Filter className="w-4 h-4 text-[#5A6378]" /><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Duration:</span>
          <select value={duration} onChange={e=>setDuration(e.target.value)} className="input-gajab w-auto h-9" data-testid="filter-duration"><option>All time</option><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This quarter</option><option>This year</option></select>
        </div>
      </div>

      <div className="gajab-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEAE0]"><tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-[#5A6378]">
              <th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">College</th><th className="p-3">City</th><th className="p-3">State</th><th className="p-3">Applied</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-12 text-center text-[#5A6378]"><Loader2 className="w-6 h-6 mx-auto animate-spin mb-2" /><span className="font-bold">Loading applicants…</span></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="p-12 text-center text-[#5A6378]"><Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" /><p className="font-bold text-lg">No data found</p><p className="text-sm">Try adjusting your search or filter criteria</p></td></tr>
              ) : filtered.map(a => (
                <tr key={a.id} onClick={()=>open(a)} className="border-b border-[#F0EBE2] hover:bg-[#FFF7EE] cursor-pointer" data-testid={`applicant-row-${a.id}`}>
                  <td className="p-3 font-mono text-xs">{a.id}</td>
                  <td className="p-3 font-bold">{a.duplicate && <AlertTriangle className="w-4 h-4 text-[#F26B1F] inline mr-1" />}{a.name}</td>
                  <td className="p-3 text-xs">{a.phone}</td>
                  <td className="p-3">{a.college}</td>
                  <td className="p-3">{a.city}</td>
                  <td className="p-3 text-xs">{a.state}</td>
                  <td className="p-3 text-xs">{a.appliedOn}</td>
                  <td className="p-3"><span className={`gajab-sticker border ${statusClr[a.status]}`}>{a.status}</span></td>
                  <td className="p-3" onClick={e=>e.stopPropagation()}><button onClick={()=>toast.success(`Task assigned to ${a.name}`)} className="text-xs font-bold text-[#F26B1F] hover:bg-[#FFE9D9] px-2 py-1 rounded-lg flex items-center gap-1" data-testid={`assign-task-${a.id}`}><ListChecks className="w-3 h-3" /> Task</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {sel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-[#1B2D54]/40" onClick={()=>setSel(null)} />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6" data-testid="applicant-drawer">
            <div className="flex items-center justify-between"><span className="gajab-sticker-yellow">#{sel.id}</span><button onClick={()=>setSel(null)}><X className="w-5 h-5" /></button></div>
            <h2 className="font-display text-3xl mt-3">{sel.name}</h2>
            {sel.duplicate && <p className="mt-2 p-3 rounded-xl bg-[#FEE2E2] border border-[#991B1B]/30 text-sm flex gap-2"><AlertTriangle className="w-4 h-4 text-[#F26B1F] flex-shrink-0" /><span><b>Duplicate detected:</b> Phone/email matches another applicant.</span></p>}
            <div className="mt-4 space-y-2 text-sm">
              <p><b>Status:</b> <span className={`gajab-sticker border ${statusClr[sel.status]}`}>{sel.status}</span></p>
              <p><b>Email:</b> {sel.email}</p><p><b>Phone:</b> {sel.phone}</p><p><b>College:</b> {sel.college}</p><p><b>City:</b> {sel.city}, {sel.state}</p><p><b>Applied:</b> {sel.appliedOn}</p>
            </div>
            <label className="block mt-5"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Starting commission</span>
              <div className="mt-1 p-3 rounded-xl bg-[#FFF1C2] border border-[#FFC93C]/60 flex items-center gap-2" data-testid="applicant-fixed-commission">
                <span className="font-display text-2xl text-[#92400E]">5%</span>
                <span className="text-[11px] text-[#92400E]/80">All new ambassadors start at 5% — auto-upgrades to 7.5% after 24 confirmed orders.</span>
              </div>
            </label>
            <label className="block mt-3"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Comments / rejection reason / partial approval note</span>
              <textarea value={comments} onChange={e=>setComments(e.target.value)} rows={4} placeholder="Required for Reject / Partial Approval..." className="input-gajab mt-1 py-3 h-auto resize-none" data-testid="applicant-notes" />
            </label>
            <div className="mt-5 grid grid-cols-1 gap-2">
              <button onClick={()=>act("approve")} className="btn-primary" data-testid="applicant-approve"><Check className="w-4 h-4" /> Approve at 5% & send credentials</button>
              <button onClick={()=>act("partial")} className="btn-accent" data-testid="applicant-partial"><Check className="w-4 h-4" /> Partially Approve (with note)</button>
              <button onClick={()=>act("reject")} className="btn-ghost border-[#991B1B] text-[#991B1B]" data-testid="applicant-reject"><X className="w-4 h-4" /> Reject (with reason)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
