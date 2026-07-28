"use client";
import React, { useState } from "react";
import { Plus, Check, X, ExternalLink, Search, Filter, ArrowLeft, RotateCw, Bell, AlertTriangle, Clock, Activity, Users, IndianRupee, Loader2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import DateInputDDMMYYYY from "@/components/DateInputDDMMYYYY";
import { get, post } from "@/lib/api";
import { useBackend } from "@/lib/useBackend";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoading } from "@/lib/loading";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  reward?: number;
  assignedCount?: number;
  completedCount?: number;
  status: string;
}

interface TaskSubmission {
  submissionId: string;
  taskId: string | null;
  ambassador?: string;
  college?: string;
  task?: string;
  submittedOn?: string;
  proof?: string;
  status: string;
  rejectReason?: string;
}

const statusClr = {
  "Approved": "bg-[#D1FAE5] text-[#065F46] border-[#065F46]/40",
  "Rejected": "bg-[#FEE2E2] text-[#991B1B] border-[#991B1B]/40",
  "Pending": "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40",
  "Under Review": "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40",
  "Resubmitted": "bg-[#E0E7FF] text-[#3730A3] border-[#3730A3]/30",
};

function AdminTasksSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="gajab-card p-4 grid lg:grid-cols-3 gap-3">
        <Skeleton className="h-10 lg:col-span-2 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gajab-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <div className="gajab-card p-5 space-y-3">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl border border-[#EFEAE0] flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminTasks() {
  const [detail, setDetail] = useState(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [rejecting, setRejecting] = useState(null); // { submissionId, ambassador } waiting for rejection reason
  const [rejectReason, setRejectReason] = useState("");
  const [form, setForm] = useState({ title:"", desc:"", deadline:"", reward:"", target:"all", selectedAmbassadors: [] as string[] });
  const [ambassadorList, setAmbassadorList] = useState<any[]>([]);
  const [loadingAmbassadors, setLoadingAmbassadors] = useState(false);
  const [ambSearch, setAmbSearch] = useState("");

  const loadAmbassadors = async () => {
    setLoadingAmbassadors(true);
    try {
      const res = await get("/admin/ambassadors") as any;
      setAmbassadorList(res.data ?? []);
    } catch {
      toast.error("Failed to load ambassadors");
    } finally {
      setLoadingAmbassadors(false);
    }
  };

  const toggleAmbassador = (id: string) => {
    setForm(prev => ({
      ...prev,
      selectedAmbassadors: prev.selectedAmbassadors.includes(id)
        ? prev.selectedAmbassadors.filter(a => a !== id)
        : [...prev.selectedAmbassadors, id],
    }));
  };

  const filteredAmbassadors = ambassadorList.filter(a =>
    (a.name + a.college + a.city + a.state + a.email).toLowerCase().includes(ambSearch.toLowerCase())
  );

  const tasks = useBackend<Task[]>(() => get("/admin/tasks").then(r => (r as any).data), [], [], ["tasks"]);
  const submissions = useBackend<TaskSubmission[]>(() => get("/admin/tasks/submissions").then(r => (r as any).data), [], [], ["tasks"]);
  const tasksLoading = getLoading(tasks, []) || getLoading(submissions, []);

  const adminPendingTasks = submissions.filter(s => s.status === "Under Review" || s.status === "Resubmitted");
  const assigneesByTask: Record<string, TaskSubmission[]> = {};
  for (const s of submissions) {
    if (!s.taskId) continue;
    (assigneesByTask[s.taskId] ||= []).push(s);
  }

  const filtered = tasks
    .filter(t => filter === "All" || t.status === filter)
    .filter(t => (t.title + t.description + t.id).toLowerCase().includes(q.toLowerCase()));

  if (tasksLoading) return <AdminTasksSkeleton />;

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) { toast.error("Title & description required"); return; }
    try {
      const task = await post("/admin/tasks", {
        title: form.title,
        description: form.desc,
        deadline: form.deadline || undefined,
        reward: form.reward ? parseInt(form.reward) : 0,
      }) as any;

      const res = await get("/admin/ambassadors") as any;
      const allAmbassadors = res.data ?? [];
      let targets = allAmbassadors;
      if (form.target === "gold") {
        targets = allAmbassadors.filter((a: any) => parseInt(a.revenue) >= 150000);
      } else if (form.target === "specific") {
        targets = allAmbassadors.filter((a: any) => form.selectedAmbassadors.includes(a.id));
        if (targets.length === 0) {
          toast.error("Please select at least one ambassador");
          return;
        }
      }

      let assignedCount = 0;
      for (const amb of targets) {
        try {
          await post(`/admin/tasks/${task.id}/assign`, { ambassador: amb.id, college: amb.college });
          await post(`/admin/ambassadors/${amb.id}/inbox`, {
            from: "Gajab Admin",
            subject: `New task assigned: ${task.title}`,
            body: `Hi ${amb.name},\n\nA new task has been assigned to you:\n\n📌 Task: ${task.title}\n📝 Description: ${task.description}\n📅 Deadline: ${form.deadline || "No deadline"}\n💰 Reward: ₹${form.reward || 0}\n\nPlease complete and submit your proof before the deadline.\n\n- Gajab Admin Team`,
          });
          assignedCount++;
        } catch { /* skip failed assignments */ }
      }

      toast.success(`Task created & assigned to ${assignedCount} ambassador(s)`);
      setOpen(false);
      setForm({ title:"", desc:"", deadline:"", reward:"", target:"all", selectedAmbassadors: [] });
    } catch (err) {
      toast.error("Failed to create task");
    }
  };
  const approve = async (submissionId: string, name: string) => {
    try {
      await post(`/admin/tasks/submissions/${submissionId}/review`, { status: "Approved" });
      toast.success(`${name}'s submission approved!`);
    } catch {
      toast.error("Failed to approve submission");
    }
  };
  const confirmReject = async () => {
    if (!rejectReason.trim()) { toast.error("Rejection reason is required"); return; }
    try {
      await post(`/admin/tasks/submissions/${rejecting.submissionId}/review`, { status: "Rejected", rejectReason: rejectReason.trim() });
      toast.error(`${rejecting.ambassador}'s submission rejected · reason logged`);
    } catch {
      toast.error("Failed to reject submission");
    }
    setRejecting(null); setRejectReason("");
  };

  if (detail) {
    const assignees = assigneesByTask[detail.id] || [];
    const sendTaskReminder = () => toast.success(`Reminder sent for "${detail.title}" to ${detail.assignedCount - detail.completedCount} pending ambassador(s)`);
    return (
      <div className="space-y-5">
        <button onClick={()=>setDetail(null)} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4" /> Back to all tasks</button>
        <div className="gajab-card p-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{detail.id}</span>
              <h1 className="font-display text-3xl mt-1">{detail.title}</h1>
              <p className="text-[#5A6378] mt-1">{detail.description}</p>
            </div>
            <button onClick={sendTaskReminder} className="btn-primary text-sm" data-testid="task-detail-remind-btn"><Bell className="w-4 h-4" /> Send reminder</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5"><IndianRupee className="w-4 h-4" strokeWidth={2} /> Reward: <b>₹{detail.reward ?? 0}</b></span>
            <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" strokeWidth={2} /> Deadline: <b>{detail.deadline}</b></span>
            <span className="inline-flex items-center gap-1.5"><Activity className="w-4 h-4" strokeWidth={2} /> Status: <b>{detail.status}</b></span>
            <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" strokeWidth={2} /> Assigned: <b>{detail.assignedCount}</b></span>
            <span className="inline-flex items-center gap-1.5"><Check className="w-4 h-4" strokeWidth={2} /> Completed: <b>{detail.completedCount}</b></span>
          </div>
        </div>

        <div className="gajab-card p-5">
          <h3 className="font-display text-lg mb-3">Assigned affiliates ({assignees.length})</h3>
          <div className="space-y-2">
            {assignees.map((a, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#EFEAE0] flex-wrap" data-testid={`assignee-${i}`}>
                <div className="min-w-0">
                  <p className="font-bold">{a.ambassador}</p><p className="text-xs text-[#5A6378]">{a.college}{a.submittedOn ? ` • Submitted: ${a.submittedOn}` : " • Not submitted yet"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`gajab-sticker border ${statusClr[a.status]}`}>{a.status}</span>
                  {a.status === "Resubmitted" && <button onClick={()=>approve(a.submissionId, a.ambassador)} className="btn-primary text-xs h-8 px-3" data-testid={`approve-resub-${i}`}><Check className="w-3 h-3" /> Approve Resubmission</button>}
                  {a.status === "Under Review" && (<><button onClick={()=>approve(a.submissionId, a.ambassador)} className="btn-primary text-xs h-8 px-3"><Check className="w-3 h-3" /></button><button onClick={()=>setRejecting({ submissionId: a.submissionId, ambassador: a.ambassador })} className="btn-ghost text-xs h-8 px-3 border-[#991B1B] text-[#991B1B]"><X className="w-3 h-3" /></button></>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="gajab-sticker-yellow">Tasks Dashboard</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Task library & verifications</h1>
          <p className="text-[#5A6378] mt-1">{filtered.length} of {tasks.length} tasks · {adminPendingTasks.length} pending verifications</p>
        </div>
        <button onClick={()=>setOpen(true)} className="btn-primary" data-testid="create-task-btn"><Plus className="w-4 h-4" /> New Task</button>
      </div>

      <div className="gajab-card p-4 grid lg:grid-cols-3 gap-3">
        <div className="relative lg:col-span-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search task title, ID..." className="input-gajab pl-10" data-testid="tasks-search" /></div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="input-gajab" data-testid="tasks-filter"><option>All</option><option>Active</option><option>Closed</option></select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(t => (
          <button key={t.id} onClick={()=>setDetail(t)} className="gajab-card p-5 text-left" data-testid={`task-card-${t.id}`}>
            <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{t.id}</span><div className="flex items-center gap-2"><span className="gajab-sticker bg-[#FFF1C2] text-[#92400E] border border-[#FFC93C]/60 text-[9px]">₹{t.reward ?? 0}</span><span className={`gajab-sticker border ${t.status==="Active"?"bg-[#D1FAE5] text-[#065F46] border-[#065F46]/40":"bg-[#F3EFE9] text-[#5A6378] border-[#EFEAE0]"}`}>{t.status}</span></div></div>
            <h3 className="font-display text-lg mt-1">{t.title}</h3>
            <p className="text-sm text-[#5A6378] mt-1 line-clamp-2">{t.description}</p>
            <div className="mt-3 flex justify-between items-end">
              <div><p className="text-[10px] uppercase font-bold text-[#5A6378]">Deadline</p><p className="font-bold text-sm">{t.deadline}</p></div>
              <div className="text-right"><p className="text-[10px] uppercase font-bold text-[#5A6378]">Progress</p><p className="font-display text-lg text-[#F26B1F]">{t.completedCount}/{t.assignedCount}</p></div>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[#F3EFE9] overflow-hidden"><div className="h-full bg-[#F26B1F]" style={{width: `${(t.completedCount/t.assignedCount*100).toFixed(0)}%`}} /></div>
          </button>
        ))}
      </div>

      <div className="gajab-card p-5">
        <h3 className="font-display text-lg mb-3">Pending verifications ({adminPendingTasks.length})</h3>
        <div className="space-y-2">
          {adminPendingTasks.map(t => (
            <div key={t.submissionId} className="p-3 rounded-xl border border-[#EFEAE0] flex items-center justify-between gap-3 flex-wrap" data-testid={`pending-task-${t.submissionId}`}>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{t.submissionId} • {t.submittedOn}{t.status === "Resubmitted" && <span className="ml-2 gajab-sticker bg-[#E0E7FF] text-[#3730A3] border border-[#3730A3]/30 text-[9px]"><RotateCw className="w-2.5 h-2.5" /> RESUBMITTED</span>}</p>
                <p className="font-bold">{t.task}</p>
                <p className="text-xs text-[#5A6378]">{t.ambassador} • {t.college}</p>
                <p className="text-xs mt-1 flex items-center gap-1 text-[#F26B1F]"><ExternalLink className="w-3 h-3" />{t.proof}</p>
              </div>
              <div className="flex gap-2">
                  <button onClick={()=>setRejecting({ submissionId: t.submissionId, ambassador: t.ambassador })} className="btn-ghost border-[#991B1B] text-[#991B1B] text-xs h-9" data-testid={`reject-${t.submissionId}`}><X className="w-3 h-3" /></button>
                  <button onClick={()=>approve(t.submissionId, t.ambassador)} className="btn-primary text-xs h-9" data-testid={`approve-${t.submissionId}`}><Check className="w-3 h-3" /> Approve</button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4" data-testid="reject-modal">
          <div className="gajab-card p-6 bg-white w-full max-w-md space-y-3">
            <div className="flex items-center gap-2 text-[#991B1B]"><AlertTriangle className="w-5 h-5" /><h3 className="font-display text-xl">Reject submission</h3></div>
            <p className="text-sm text-[#5A6378]">Rejecting <b className="text-[#1B2D54]">{rejecting.ambassador}</b>'s submission. Please provide a clear reason — it&apos;s shown to the ambassador.</p>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Rejection reason <span className="text-[#991B1B]">*</span></span>
              <textarea value={rejectReason} onChange={e=>setRejectReason(e.target.value)} rows={4} placeholder="e.g. Proof link doesn't match the task requirement. Please repost on your public feed and resubmit." className="input-gajab mt-1 py-3 h-auto resize-none" data-testid="reject-reason-input" autoFocus />
            </label>
            <div className="flex gap-2 justify-end">
              <button onClick={()=>{setRejecting(null); setRejectReason("");}} className="btn-ghost">Cancel</button>
              <button onClick={confirmReject} className="btn-primary bg-[#991B1B] hover:bg-[#7F1D1D] shadow-[0_4px_12px_rgba(153,27,27,0.30)]" data-testid="reject-confirm-btn"><X className="w-4 h-4" /> Reject with reason</button>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4">
          <form onSubmit={create} className="gajab-card p-6 bg-white w-full max-w-lg space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">New task</h3><button type="button" onClick={()=>setOpen(false)}><X className="w-5 h-5" /></button></div>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Title</span><input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="input-gajab mt-1" data-testid="task-title" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Description</span><textarea value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} rows={3} className="input-gajab mt-1 py-3 h-auto resize-none" data-testid="task-desc" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Reward (₹)</span><input type="number" min="0" value={form.reward} onChange={e=>setForm({...form, reward:e.target.value})} placeholder="0" className="input-gajab mt-1" data-testid="task-reward" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Deadline (dd/mm/yyyy)</span><div className="mt-1"><DateInputDDMMYYYY value={form.deadline} onChange={v=>setForm({...form, deadline:v})} testId="task-deadline" /></div></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Assign to</span><select value={form.target} onChange={e=>{setForm({...form, target:e.target.value, selectedAmbassadors: []}); if (e.target.value === "specific") loadAmbassadors();}} className="input-gajab mt-1"><option value="all">All ambassadors</option><option value="gold">Gold tier+</option><option value="specific">Specific ambassadors</option></select></label>
            {form.target === "specific" && (
              <div className="border border-[#EFEAE0] rounded-xl overflow-hidden">
                <div className="relative p-2 border-b border-[#EFEAE0]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={ambSearch} onChange={e=>setAmbSearch(e.target.value)} placeholder="Search ambassadors..." className="input-gajab pl-8 h-9 text-sm" /></div>
                <div className="max-h-48 overflow-y-auto p-1 space-y-0.5">
                  {loadingAmbassadors ? (
                    <div className="p-4 text-center text-[#5A6378] text-sm"><Loader2 className="w-5 h-5 mx-auto animate-spin mb-1" />Loading...</div>
                  ) : filteredAmbassadors.length === 0 ? (
                    <div className="p-4 text-center text-[#5A6378] text-sm">No ambassadors found</div>
                  ) : filteredAmbassadors.map(a => (
                    <label key={a.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FFF7EE] cursor-pointer text-sm">
                      <input type="checkbox" checked={form.selectedAmbassadors.includes(a.id)} onChange={() => toggleAmbassador(a.id)} className="accent-[#F26B1F]" />
                      <div className="flex-1 min-w-0"><span className="font-bold">{a.name}</span><span className="text-xs text-[#5A6378] ml-2">{a.college}</span></div>
                      <span className="text-xs text-[#5A6378]">₹{(a.revenue/1000).toFixed(0)}K</span>
                    </label>
                  ))}
                </div>
                <div className="p-2 border-t border-[#EFEAE0] bg-[#FFF7EE] text-xs text-[#5A6378] font-bold">{form.selectedAmbassadors.length} selected</div>
              </div>
            )}
            <button className="btn-primary w-full" data-testid="submit-task-btn"><Plus className="w-4 h-4" /> Create & Assign</button>
          </form>
        </div>
      )}
    </div>
  );
}
