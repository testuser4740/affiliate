"use client";
import React, { useState, useEffect } from "react";
import { Mail, ArrowLeft, Search } from "lucide-react";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";

const DEMO_AMB_ID = "amb_005";

export default function Inbox() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const inboxMessages = useBackend(() => backend.ambassadorInbox(ambId), [], [ambId], ["inbox", "ambassador_created", "pocs", "announcements", "tasks"]);
  const filtered = inboxMessages.filter(m => (m.from + m.subject + (m.preview || m.body || "")).toLowerCase().includes(q.toLowerCase()));

  // Mark message as read when opened
  useEffect(() => {
    if (sel && !sel.read) {
      backend.markRead(ambId, sel.id);
    }
  }, [sel, ambId]);

  if (sel) {
    return (
      <div className="space-y-5">
        <button onClick={()=>setSel(null)} className="btn-ghost text-sm"><ArrowLeft className="w-4 h-4" /> Back to inbox</button>
        <div className="gajab-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="gajab-sticker-orange">{sel.priority}</span>
            <span className="text-xs text-[#5A6378]">{sel.receivedOn}</span>
          </div>
          <h1 className="font-display text-2xl mt-3">{sel.subject}</h1>
          <p className="text-sm text-[#5A6378] mt-1">From: <b className="text-[#1B2D54]">{sel.from}</b></p>
          <pre className="mt-5 whitespace-pre-wrap font-sans text-[#1B2D54] leading-relaxed">{sel.body}</pre>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Inbox</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Messages from admin</h1>
        <p className="text-[#5A6378] mt-1">{inboxMessages.filter(m=>!m.read).length} unread of {inboxMessages.length}</p>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6378]" /><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search messages..." className="input-gajab pl-10" data-testid="inbox-search" /></div>
      <div className="space-y-2">
        {filtered.map(m => (
          <button key={m.id} onClick={()=>setSel(m)} className={`w-full text-left gajab-card p-4 flex items-start gap-3 ${!m.read ? "bg-[#FFF7EE]" : ""}`} data-testid={`msg-${m.id}`}>
            <Mail className={`w-5 h-5 mt-1 flex-shrink-0 ${!m.read ? "text-[#F26B1F]" : "text-[#5A6378]"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2"><p className={`font-bold ${!m.read ? "text-[#1B2D54]" : "text-[#5A6378]"}`}>{m.subject}</p><span className="text-xs text-[#5A6378]">{m.receivedOn.split(" ")[0]}</span></div>
              <p className="text-xs text-[#5A6378] mt-0.5">From: {m.from}</p>
              <p className="text-sm text-[#5A6378] mt-1 line-clamp-2">{m.preview}</p>
            </div>
            {!m.read && <span className="w-2 h-2 rounded-full bg-[#F26B1F] flex-shrink-0 mt-2" />}
          </button>
        ))}
      </div>
    </div>
  );
}
