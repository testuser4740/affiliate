"use client";
import React, { useState } from "react";
import { Search, Users, ShoppingBag, TrendingUp, Upload, Download, Plus, MessageSquare, X, ExternalLink, ArrowLeft, Trophy, ListChecks, IndianRupee, Award, Gift, FileText } from "lucide-react";
import { toast } from "sonner";
import { states, cities } from "@/data/options";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";

const Kpi = ({ icon: Icon, label, value, bg }) => (
  <div className={`gajab-card p-5 ${bg}`}><Icon className="w-6 h-6 mb-2" strokeWidth={2.5} /><p className="text-xs uppercase font-extrabold tracking-wider opacity-70">{label}</p><p className="font-display text-3xl mt-1">{value}</p></div>
);

const tierFor = (rev) => rev >= 400000 ? "Platinum" : rev >= 150000 ? "Gold" : rev >= 50000 ? "Silver" : "Bronze";

export default function Directory() {
  const [q, setQ] = useState("");
  const [stateF, setStateF] = useState("All States");
  const [cityF, setCityF] = useState("All Cities");
  const [levelF, setLevelF] = useState("All");
  const [open, setOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(null);
  const [detail, setDetail] = useState(null);
  const [msg, setMsg] = useState("");
  const [subject, setSubject] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", college: "", year: "", city: "", state: "", instagram: "", followers: "", whyJoin: "" });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const leaderboard = useBackend(() => backend.listAmbassadors().then(r => r.data), [], [refreshKey], ["leaderboard", "orders", "commission"]);
  const adminKpis = useBackend(() => backend.analyticsKpis().then(r => r), {}, [], ["analytics"]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await backend.downloadAmbassadorList();
      toast.success("Ambassador list downloaded");
    } catch {
      toast.error("Failed to download ambassador list");
    } finally {
      setDownloading(false);
    }
  };

  const filtered = leaderboard
    .filter(a => stateF === "All States" || a.state === stateF)
    .filter(a => cityF === "All Cities" || a.city === cityF)
    .filter(a => levelF === "All" || tierFor(a.revenue) === levelF)
    .filter(a => (a.name + a.college + a.city + a.state).toLowerCase().includes(q.toLowerCase()));

  const save = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setLoading(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        commissionPct: 8,
        tier: "Bronze",
      };
      await backend.createAmbassador(payload);
      toast.success(`${form.name} added to directory`, { duration: 4000 });
      setForm({ name: "", phone: "", email: "", college: "", year: "", city: "", state: "", instagram: "", followers: "", whyJoin: "" });
      setOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      toast.error("Failed to add to directory");
    } finally {
      setLoading(false);
    }
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !msg.trim()) { toast.error("Subject and message are required"); return; }
    try {
      await backend.sendMessage(msgOpen.id, { from: "admin", subject: subject.trim(), body: msg.trim() });
      toast.success(`Message sent to ${msgOpen.name}`);
      setMsgOpen(null);
      setMsg("");
      setSubject("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  // ==================== DETAILED PROFILE VIEW ====================
  if (detail) {
    const tier = tierFor(detail.revenue);
    // Derive lightweight stats
    const commRate = tier === "Platinum" ? 15 : tier === "Gold" ? 12 : tier === "Silver" ? 10 : 8;
    const commissionEarned = Math.round(detail.revenue * commRate / 100);
    const mockTasks = [
      { id: "T-01", title: "Post Insta Story about Diwali sale", status: "Approved" },
      { id: "T-02", title: "Share Ambassador link on LinkedIn", status: "Approved" },
      { id: "T-03", title: "Organize campus product demo", status: "Under Review" },
      { id: "T-04", title: "Refer 5 new users this week", status: "Pending" },
    ];
    const mockOrders = [
      { id: "GJ-8891", product: "Sneha Beauty Kit", value: 1899, comm: Math.round(1899 * commRate / 100), status: "Delivered" },
      { id: "GJ-8890", product: "Wireless Earbuds", value: 1499, comm: Math.round(1499 * commRate / 100), status: "Delivered" },
      { id: "GJ-8889", product: "Notebook Bundle", value: 599, comm: Math.round(599 * commRate / 100), status: "Delivered" },
      { id: "GJ-8888", product: "Hair Care Combo", value: 899, comm: Math.round(899 * commRate / 100), status: "Cancelled" },
    ];
    return (
      <div className="space-y-5">
        <button onClick={() => setDetail(null)} className="btn-ghost text-sm" data-testid="dir-back-btn"><ArrowLeft className="w-4 h-4" /> Back to directory</button>

        {/* Header card */}
        <div className="gajab-card p-6 flex items-center gap-4 flex-wrap">
          <img src={detail.avatar} alt="" className="w-24 h-24 rounded-2xl object-cover" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="gajab-sticker-yellow">#{detail.rank}</span>
              <span className="gajab-sticker bg-[#FFF1C2] text-[#92400E] border border-[#FFC93C]/60">{tier} Tier</span>
              <span className="gajab-sticker-orange">{commRate}% commission</span>
            </div>
            <h1 className="font-display text-3xl mt-2">{detail.name}</h1>
            <p className="text-[#5A6378]">{detail.college} · {detail.city}, {detail.state}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setMsgOpen(detail)} className="btn-ghost text-sm" data-testid="dir-detail-msg"><MessageSquare className="w-4 h-4" /> Message</button>
            <a href={`https://gajab.com/r/${detail.name.split(" ")[0].toUpperCase()}`} target="_blank" rel="noreferrer" className="btn-primary text-sm"><ExternalLink className="w-4 h-4" /> Affiliate link</a>
          </div>
        </div>

        {/* Stat KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="dir-detail-kpis">
          <div className="gajab-card p-4 bg-white"><div className="w-10 h-10 rounded-full grid place-items-center bg-[#FFE9D9]"><ShoppingBag className="w-5 h-5 text-[#C9450C]" strokeWidth={2.5} /></div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mt-3">Orders</p><p className="font-display text-3xl">{detail.orders}</p></div>
          <div className="gajab-card p-4 bg-white"><div className="w-10 h-10 rounded-full grid place-items-center bg-[#D1FAE5]"><TrendingUp className="w-5 h-5 text-[#065F46]" strokeWidth={2.5} /></div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mt-3">Revenue Generated</p><p className="font-display text-3xl">₹{(detail.revenue / 1000).toFixed(0)}K</p></div>
          <div className="gajab-card p-4 bg-white"><div className="w-10 h-10 rounded-full grid place-items-center bg-[#E8E4FB]"><IndianRupee className="w-5 h-5 text-[#5B21B6]" strokeWidth={2.5} /></div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mt-3">Commission</p><p className="font-display text-3xl">₹{(commissionEarned / 1000).toFixed(1)}K</p></div>
          <div className="gajab-card p-4 bg-white"><div className="w-10 h-10 rounded-full grid place-items-center bg-[#FFF1C2]"><Trophy className="w-5 h-5 text-[#92400E]" strokeWidth={2.5} /></div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378] mt-3">Leaderboard rank</p><p className="font-display text-3xl">#{detail.rank}</p></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Tasks */}
          <div className="gajab-card p-5">
            <h3 className="font-display text-lg mb-3 flex items-center gap-2"><ListChecks className="w-5 h-5 text-[#F26B1F]" /> Recent tasks</h3>
            <div className="space-y-2">
              {mockTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-[#EFEAE0]">
                  <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{t.id}</p><p className="font-bold text-sm">{t.title}</p></div>
                  <span className={`gajab-sticker border text-[10px] ${t.status === "Approved" ? "bg-[#D1FAE5] text-[#065F46] border-[#065F46]/40" : t.status === "Under Review" ? "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40" : "bg-[#FEF3C7] text-[#92400E] border-[#92400E]/40"}`}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Orders */}
          <div className="gajab-card p-5">
            <h3 className="font-display text-lg mb-3 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#F26B1F]" /> Recent orders</h3>
            <div className="space-y-2">
              {mockOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl border border-[#EFEAE0]">
                  <div><p className="text-[10px] font-mono text-[#5A6378]">{o.id}</p><p className="font-bold text-sm">{o.product}</p></div>
                  <div className="text-right">
                    <p className="font-display text-sm">₹{o.value.toLocaleString()}</p>
                    <p className="text-[10px] text-[#F26B1F] font-bold">+ ₹{o.comm}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements & rewards */}
        <div className="gajab-card p-5">
          <h3 className="font-display text-lg mb-3 flex items-center gap-2"><Award className="w-5 h-5 text-[#F26B1F]" /> Achievements</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-[#EFEAE0]"><p className="font-bold text-sm flex items-center gap-1.5"><Gift className="w-4 h-4 text-[#F26B1F]" strokeWidth={2} /> Welcome Kit</p><p className="text-xs text-[#5A6378]">Received Feb 2026</p></div>
            <div className="p-3 rounded-xl border border-[#EFEAE0]"><p className="font-bold text-sm flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#F26B1F]" strokeWidth={2} /> {tier} Certificate</p><p className="text-xs text-[#5A6378]">Unlocked at {commRate}% tier</p></div>
            <div className="p-3 rounded-xl border border-[#EFEAE0]"><p className="font-bold text-sm flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#F26B1F]" strokeWidth={2} /> Top 10 rank</p><p className="text-xs text-[#5A6378]">Current position #{detail.rank}</p></div>
          </div>
        </div>
      </div>
    );
  }
  // ================================================================

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <span className="gajab-sticker-yellow">Ambassador Directory</span>
          <h1 className="font-display text-3xl sm:text-4xl mt-2">Active ambassadors</h1>
          <p className="text-[#5A6378] mt-1">{filtered.length} of {leaderboard.length} ambassadors</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => toast.success("CSV template downloaded")} className="btn-ghost text-sm" data-testid="bulk-import-btn"><Upload className="w-4 h-4" /> Bulk Import</button>
          <button onClick={handleDownload} disabled={downloading} className="btn-ghost text-sm" data-testid="export-btn"><Download className="w-4 h-4" /> {downloading ? "Downloading..." : "Download Ambassador List"}</button>
          <button onClick={() => setOpen(true)} className="btn-primary text-sm" data-testid="add-affiliate-btn"><Plus className="w-4 h-4" /> Add Affiliate</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={Users} label="Total Ambassadors" value={leaderboard.length} bg="bg-white" />
        <Kpi icon={Users} label="Active this month" value={adminKpis.activeThisMonth ?? 0} bg="bg-[#FFF1C2]" />
        <Kpi icon={ShoppingBag} label="Total orders" value={(adminKpis.totalOrders ?? 0).toLocaleString()} bg="bg-[#D1FAE5]" />
        <Kpi icon={TrendingUp} label="Total GMV" value={`₹${((adminKpis.totalGMV ?? 0) / 100000).toFixed(1)}L`} bg="bg-[#FFE9D9]" />
      </div>

      <div className="gajab-card p-4 grid lg:grid-cols-5 gap-3">
        <div className="relative lg:col-span-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, college, city..." className="input-gajab pl-10" data-testid="directory-search" /></div>
        <select value={stateF} onChange={e => setStateF(e.target.value)} className="input-gajab" data-testid="dir-filter-state">{states.map(s => <option key={s}>{s}</option>)}</select>
        <select value={cityF} onChange={e => setCityF(e.target.value)} className="input-gajab" data-testid="dir-filter-city">{cities.map(c => <option key={c}>{c}</option>)}</select>
        <select value={levelF} onChange={e => setLevelF(e.target.value)} className="input-gajab" data-testid="dir-filter-level"><option>All</option><option>Bronze</option><option>Silver</option><option>Gold</option><option>Platinum</option></select>
      </div>

      <div className="gajab-card p-0 overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FFF7EE] border-b border-[#EFEAE0]"><tr className="text-left text-[10px] font-extrabold uppercase tracking-wider text-[#5A6378]">
              <th className="p-3">#</th><th className="p-3">Ambassador</th><th className="p-3">College</th><th className="p-3">City</th><th className="p-3">State</th><th className="p-3">Level</th><th className="p-3">Affiliate URL</th><th className="p-3 text-right">Orders</th><th className="p-3 text-right">Revenue</th><th className="p-3">Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(r => {
                const tier = tierFor(r.revenue);
                return (
                  <tr key={r.rank} onClick={() => setDetail(r)} className="border-b border-[#F0EBE2] hover:bg-[#FFF7EE] cursor-pointer" data-testid={`directory-row-${r.rank}`}>
                    <td className="p-3 font-display">#{r.rank}</td>
                    <td className="p-3"><div className="flex items-center gap-2"><img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" /><p className="font-bold">{r.name}</p></div></td>
                    <td className="p-3">{r.college}</td>
                    <td className="p-3">{r.city}</td>
                    <td className="p-3 text-xs">{r.state}</td>
                    <td className="p-3"><span className="gajab-sticker bg-[#FFF1C2] text-[#92400E] border border-[#FFC93C]/60">{tier}</span></td>
                    <td className="p-3 max-w-[180px]"><a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); toast.success("Affiliate link opened"); }} className="flex items-center gap-1 text-xs text-[#F26B1F] truncate hover:underline"><ExternalLink className="w-3 h-3 flex-shrink-0" />gajab.com/r/{r.name.split(" ")[0].toUpperCase()}</a></td>
                    <td className="p-3 text-right font-bold">{r.orders}</td>
                    <td className="p-3 text-right font-display">₹{(r.revenue / 1000).toFixed(0)}K</td>
                    <td className="p-3" onClick={e => e.stopPropagation()}><button onClick={() => setMsgOpen(r)} className="text-xs font-bold text-[#F26B1F] hover:bg-[#FFE9D9] px-2 py-1 rounded-lg flex items-center gap-1" data-testid={`msg-${r.rank}`}><MessageSquare className="w-3 h-3" /> Message</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden space-y-2 p-3">
          {filtered.map(r => {
            const tier = tierFor(r.revenue);
            return (
              <div key={r.rank} onClick={() => setDetail(r)} className="p-3 rounded-xl border border-[#EFEAE0] bg-white cursor-pointer hover:border-[#F26B1F]/40 transition-colors" data-testid={`directory-row-mobile-${r.rank}`}>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm">#{r.rank}</span>
                      <p className="font-bold truncate">{r.name}</p>
                    </div>
                    <p className="text-xs text-[#5A6378] truncate">{r.college} · {r.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm">₹{(r.revenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-[#5A6378]">{r.orders} orders</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-[#EFEAE0]">
                  <span className="gajab-sticker bg-[#FFF1C2] text-[#92400E] border border-[#FFC93C]/60 text-[9px]">{tier}</span>
                  <button onClick={e => { e.stopPropagation(); setMsgOpen(r) }} className="text-xs font-bold text-[#F26B1F] px-2 py-1 rounded-lg" data-testid={`msg-${r.rank}`}><MessageSquare className="w-3 h-3 inline mr-1" />Message</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4">
          <form onSubmit={(e) => e.preventDefault()} className="gajab-card p-6 bg-white w-full max-w-xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between"><h3 className="font-display text-2xl">Add Affiliate</h3><button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button></div>
            <p className="text-xs text-[#5A6378]">Creates a new directory entry. Name and role are required.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Full Name <span className="text-red-500">*</span>
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Phone <span className="text-red-500">*</span>
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Email <span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  className="input-gajab mt-1"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  College
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Year
                </span>

                <select
                  className="input-gajab mt-1"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Masters">Masters</option>
                </select>
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  City
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  State
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Instagram ID
                </span>
                <input
                  className="input-gajab mt-1"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  placeholder="@username"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Followers
                </span>
                <input
                  type="number"
                  className="input-gajab mt-1"
                  value={form.followers}
                  onChange={(e) => setForm({ ...form, followers: e.target.value })}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">
                  Why do you want to join?
                </span>
                <textarea
                  rows={4}
                  className="input-gajab mt-1"
                  value={form.whyJoin}
                  onChange={(e) => setForm({ ...form, whyJoin: e.target.value })}
                />
              </label>
            </div>
            <button type="button" className="btn-primary w-full" disabled={loading} onClick={save} data-testid="add-affiliate-submit">
              {loading ? "Adding..." : "Add to Directory"}
            </button>
          </form>
        </div>
      )}

      {msgOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1B2D54]/40 p-4">
          <form onSubmit={sendMsg} className="gajab-card p-6 bg-white w-full max-w-md space-y-3">
            <div className="flex items-center justify-between"><h3 className="font-display text-xl">Message {msgOpen.name}</h3><button type="button" onClick={() => setMsgOpen(null)}><X className="w-5 h-5" /></button></div>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="input-gajab" data-testid="quick-msg-subject" />
            <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={5} placeholder="Quick message to ambassador..." className="input-gajab py-3 h-auto resize-none" data-testid="quick-msg-input" />
            <button className="btn-primary w-full" data-testid="quick-msg-send">Send via WhatsApp + Inbox</button>
          </form>
        </div>
      )}
    </div>
  );
}
