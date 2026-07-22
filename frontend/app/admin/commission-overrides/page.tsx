"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

const statusClr = { Scheduled: "bg-[#E0E7FF] text-[#3730A3]", Active: "bg-[#D1FAE5] text-[#065F46]", Expired: "bg-[#FEE2E2] text-[#991B1B]" };

export default function AdminCommissionOverrides() {
  const overrides = useBackend(() => backend.listCommissionOverrides().then(r => r.data), [], [], ["commission_overrides"]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ label: "", appliesTo: "All ambassadors", overridePct: 12, originalPct: 8, startDate: "", endDate: "", status: "Scheduled" });

  const openCreate = () => { setEditing(null); setForm({ label: "", appliesTo: "All ambassadors", overridePct: 12, originalPct: 8, startDate: "", endDate: "", status: "Scheduled" }); setOpen(true); };
  const openEdit = (o) => { setEditing(o); setForm({ label: o.label, appliesTo: o.appliesTo, overridePct: o.overridePct, originalPct: o.originalPct, startDate: o.startDate?.slice(0, 10), endDate: o.endDate?.slice(0, 10), status: o.status }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    console.log("save triggered", { editing: !!editing, form });
    if (!form.label) { toast.error("Label required"); return; }
    try {
      if (editing) {
        await backend.updateCommissionOverride(editing.id, form);
        toast.success(`Override "${form.label}" updated`);
      } else {
        await backend.createCommissionOverride(form);
        toast.success(`Override "${form.label}" created`);
      }
      setOpen(false);
    } catch (err) {
      console.error("save failed", err);
      toast.error("Failed to save override");
    }
  };

  const del = async (o) => {
    try {
      await backend.deleteCommissionOverride(o.id);
      toast.success(`Deleted "${o.label}"`);
    } catch (err) {
      toast.error("Failed to delete override");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="gajab-sticker-yellow">Commission Overrides</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Temporary commission campaigns</h1>
          <p className="text-[#5A6378] mt-1">Boost commission % for a period. Auto-reverts when the window ends.</p>
        </div>
        <button onClick={openCreate} className="btn-primary" data-testid="new-override-btn"><Plus className="w-4 h-4" /> New Override</button>
      </div>

      <div className="grid gap-3">
        {overrides.map(o => (
          <div key={o.id} className="gajab-card p-5" data-testid={`override-${o.id}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{o.id}</span>
                  <span className={`gajab-sticker ${statusClr[o.status] || "bg-[#F3F4F6] text-[#374151]"} border border-current/30`}>{o.status}</span>
                </div>
                <h3 className="font-display text-lg mt-1.5">{o.label}</h3>
                <p className="text-sm text-[#5A6378] mt-1">Applies to: {o.appliesTo}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#5A6378]">
                  <span>Override: <b className="text-[#1B2D54]">{o.overridePct}%</b></span>
                  <span>Original: <b className="text-[#1B2D54]">{o.originalPct}%</b></span>
                  <span>Start: <b className="text-[#1B2D54]">{o.startDate}</b></span>
                  <span>End: <b className="text-[#1B2D54]">{o.endDate}</b></span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(o)} className="p-2 hover:bg-[#FFF7EE] rounded-lg" data-testid={`edit-${o.id}`}><Edit className="w-4 h-4 text-[#5A6378]" /></button>
                <button onClick={() => del(o)} className="p-2 hover:bg-[#FEE2E2] rounded-lg" data-testid={`delete-${o.id}`}><Trash2 className="w-4 h-4 text-[#991B1B]" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4">
          <form onSubmit={save} className="gajab-card p-6 bg-white w-full max-w-lg space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing ? "Edit" : "New"} commission override</h3><button type="button" onClick={()=>setOpen(false)}><X className="w-5 h-5" /></button></div>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Label</span><input value={form.label} onChange={e=>setForm({...form, label:e.target.value})} className="input-gajab mt-1" placeholder="Year-end bonus..." data-testid="override-label" /></label>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Applies to</span>
              <select value={form.appliesTo} onChange={e=>setForm({...form, appliesTo:e.target.value})} className="input-gajab mt-1"><option>All ambassadors</option><option>Gold + Platinum tiers</option><option>Silver tier</option><option>Bronze tier</option></select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Override %</span><input type="number" value={form.overridePct} onChange={e=>setForm({...form, overridePct: Number(e.target.value)})} className="input-gajab mt-1" data-testid="override-pct" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Original %</span><input type="number" value={form.originalPct} onChange={e=>setForm({...form, originalPct: Number(e.target.value)})} className="input-gajab mt-1" data-testid="original-pct" /></label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Start date</span><input type="date" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="input-gajab mt-1" data-testid="override-start" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">End date</span><input type="date" value={form.endDate} onChange={e=>setForm({...form, endDate:e.target.value})} className="input-gajab mt-1" data-testid="override-end" /></label>
            </div>
            <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Status</span>
              <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="input-gajab mt-1"><option>Scheduled</option><option>Active</option><option>Expired</option></select>
            </label>
            <button type="submit" className="btn-primary w-full" data-testid="override-submit">{editing ? "Update" : "Create"} override</button>
          </form>
        </div>
      )}
    </div>
  );
}
