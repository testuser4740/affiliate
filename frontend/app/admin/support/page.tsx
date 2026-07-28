"use client";
import React, { useState } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, Mail, Phone, MessageCircle, UserPlus, UserMinus, Search } from "lucide-react";
import { toast } from "sonner";
import { useVersion } from "@/hooks/useVersion";
import { get, post, put } from "@/lib/api";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { Skeleton } from "@/components/ui/skeleton";
import { getLoading } from "@/lib/loading";

function AdminSupportSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="gajab-card p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EFEAE0] grid grid-cols-2 gap-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
            </div>
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminSupport() {
  const { isV2 } = useVersion();
  const pocs = useBackend(() => get("/admin/pocs").then(r => (r as any).data ?? []), [], [], ["pocs"]);
  const leaderboard = useBackend(() => backend.masterLeaderboard().then(r => r.data), [], [], ["leaderboard", "orders", "commission", "ambassador_created"]);
  const supportLoading = getLoading(pocs, []) || getLoading(leaderboard, []);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", region: "", email: "", phone: "", whatsapp: "", workingHours: "" });
  const [mapQuery, setMapQuery] = useState("");
  const [linkedSet, setLinkedSet] = useState<Set<string>>(new Set());

  const openCreate = () => { setEditing(null); setForm({ name: "", role: "", region: "", email: "", phone: "", whatsapp: "", workingHours: "" }); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, role: p.role, region: p.region, email: p.email, phone: p.phone, whatsapp: p.whatsapp, workingHours: p.workingHours }); setOpen(true); };
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("Name required"); return; }
    try {
      if (editing) {
        await put(`/admin/pocs/${editing.id}`, form);
        toast.success(`Updated ${form.name}`);
      } else {
        await post("/admin/pocs", form);
        toast.success(`Created POC ${form.name}`);
      }
      setOpen(false);
    } catch (err) {
      toast.error("Save failed");
    }
  };
  const del = async (p: any) => {
    try {
      await del(`/admin/pocs/${p.id}`);
      toast.success(`Deleted ${p.name}`);
      if (detail?.id === p.id) setDetail(null);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openDetail = (p: any) => { setDetail(p); setLinkedSet(new Set(p.linkedAffiliates ?? [])); setMapQuery(""); };
  const toggleLink = async (name: string) => {
    const s = new Set(linkedSet);
    if (s.has(name)) {
      s.delete(name);
      toast.success(`Unmapped ${name}`);
    } else {
      s.add(name);
      toast.success(`Mapped ${name} to ${detail.name}`);
    }
    setLinkedSet(s);
    try {
      await backend.updatePocAmbassadors(detail.id, [...s]);
      setDetail((prev: any) => ({ ...prev, linkedAffiliates: [...s] }));
    } catch (err) {
      toast.error("Failed to update mapping");
    }
  };

  if (supportLoading) return <AdminSupportSkeleton />;

  if (detail) {
    const candidates = leaderboard.filter(a => a.name.toLowerCase().includes(mapQuery.toLowerCase())).filter(a => !isV2 || !linkedSet.has(a.name));
    return (
      <div className="space-y-5">
        <button onClick={()=>setDetail(null)} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4" /> Back to all POCs</button>
        <div className="gajab-card p-6 flex items-center gap-4 flex-wrap">
          <img src={detail.avatar} alt="" className="w-20 h-20 rounded-2xl object-cover" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl">{detail.name}</h1>
            <p className="text-[#5A6378]">{detail.role} • {detail.region}</p>
            <div className="mt-2 flex gap-3 flex-wrap text-sm">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-[#F26B1F]" /> {detail.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-[#F26B1F]" /> {detail.phone}</span>
              <span className="flex items-center gap-1"><MessageCircle className="w-4 h-4 text-[#25D366]" /> WhatsApp</span>
            </div>
            <p className="text-xs text-[#5A6378] mt-1">{detail.workingHours}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="gajab-card p-5">
            <h3 className="font-display text-lg mb-3">Tagged affiliates ({linkedSet.size})</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...linkedSet].length === 0 && <p className="text-sm text-[#5A6378]">No affiliates tagged yet.</p>}
              {[...linkedSet].map(name => {
                const a = leaderboard.find(x => x.name === name);
                return (
                  <div key={name} className="flex items-center justify-between gap-2 p-2 rounded-lg border border-[#EFEAE0]" data-testid={`tagged-${name}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {a && <img src={a.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />}
                      <div><p className="font-bold text-sm">{name}</p>{a && <p className="text-xs text-[#5A6378]">{a.college}</p>}</div>
                    </div>
                    <button onClick={()=>toggleLink(name)} className="text-xs font-bold text-[#991B1B] hover:bg-[#FEE2E2] px-2 py-1 rounded-lg flex items-center gap-1"><UserMinus className="w-3 h-3" /> Unmap</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gajab-card p-5">
            <h3 className="font-display text-lg mb-3">Map new affiliate</h3>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" />
              <input value={mapQuery} onChange={e=>setMapQuery(e.target.value)} placeholder="Search ambassador..." className="input-gajab pl-10" data-testid="map-search" />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {candidates.map(a => {
                const linked = linkedSet.has(a.name);
                return (
                  <div key={a.rank} className="flex items-center justify-between gap-2 p-2 rounded-lg border border-[#EFEAE0]">
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={a.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div><p className="font-bold text-sm">{a.name}</p><p className="text-xs text-[#5A6378]">{a.college}</p></div>
                    </div>
                    <button onClick={()=>toggleLink(a.name)} className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${linked ? "text-[#991B1B] hover:bg-[#FEE2E2]" : "text-[#065F46] hover:bg-[#D1FAE5]"}`} data-testid={`toggle-${a.name}`}>
                      {linked ? (<><UserMinus className="w-3 h-3" /> Unmap</>) : (<><UserPlus className="w-3 h-3" /> Map</>)}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="gajab-sticker-yellow">Support · POCs</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Points of Contact</h1>
          <p className="text-[#5A6378] mt-1">{pocs.length} POCs across regions. Click a card to manage tagged affiliates.</p>
        </div>
        <button onClick={openCreate} className="btn-primary" data-testid="new-poc-btn"><Plus className="w-4 h-4" /> New POC</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {pocs.map(p => (
          <div key={p.id} className="gajab-card p-5 cursor-pointer" onClick={()=>openDetail(p)} data-testid={`poc-${p.id}`}>
            <div className="flex items-start gap-3">
              <img src={p.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg leading-tight">{p.name}</h3>
                <p className="text-xs text-[#F26B1F] font-bold uppercase tracking-wider mt-0.5">{p.role}</p>
                <p className="text-xs text-[#5A6378] mt-1">{p.region}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={e=>{e.stopPropagation(); openEdit(p);}} className="p-1.5 hover:bg-[#FFF7EE] rounded-lg"><Edit className="w-3.5 h-3.5 text-[#5A6378]" /></button>
                <button onClick={e=>{e.stopPropagation(); del(p);}} className="p-1.5 hover:bg-[#FEE2E2] rounded-lg"><Trash2 className="w-3.5 h-3.5 text-[#991B1B]" /></button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EFEAE0] grid grid-cols-2 gap-2 text-xs">
              <p className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 text-[#F26B1F] flex-shrink-0" />{p.email}</p>
              <p className="flex items-center gap-1.5 truncate"><Phone className="w-3 h-3 text-[#F26B1F] flex-shrink-0" />{p.phone}</p>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 gajab-sticker-orange text-[10px]]">{(p.linkedAffiliates ?? []).length} affiliates tagged</div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4">
          <form onSubmit={save} className="gajab-card p-6 bg-white w-full max-w-lg space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">{editing ? "Edit" : "New"} POC</h3><button type="button" onClick={()=>setOpen(false)}><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Name</span><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="input-gajab mt-1" data-testid="poc-name" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Role</span><input value={form.role} onChange={e=>setForm({...form, role:e.target.value})} className="input-gajab mt-1" placeholder="Zone Lead" data-testid="poc-role" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Region</span><input value={form.region} onChange={e=>setForm({...form, region:e.target.value})} className="input-gajab mt-1" placeholder="North India" /></label>
              <label className="block col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Email</span><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="input-gajab mt-1" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Phone</span><input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} className="input-gajab mt-1" /></label>
              <label className="block"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">WhatsApp</span><input value={form.whatsapp} onChange={e=>setForm({...form, whatsapp:e.target.value})} className="input-gajab mt-1" /></label>
              <label className="block col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Working hours</span><input value={form.workingHours} onChange={e=>setForm({...form, workingHours:e.target.value})} className="input-gajab mt-1" placeholder="Mon–Sat, 10 AM – 7 PM" /></label>
            </div>
            <button className="btn-primary w-full" data-testid="poc-submit">{editing ? "Update POC" : "Create POC"}</button>
          </form>
        </div>
      )}
    </div>
  );
}
