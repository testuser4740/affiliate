"use client";
import React from "react";
import { Bell, Clock } from "lucide-react";
import { backend } from "@/lib/apiHooks";
import { useBackend } from "@/lib/useBackend";
import { useAuth } from "@/lib/auth";

const DEMO_AMB_ID = "amb_005";

const priorityClr = { High: "bg-[#FEE2E2] text-[#991B1B]", Medium: "bg-[#FEF3C7] text-[#92400E]", Low: "bg-[#E0E7FF] text-[#3730A3]" };

export default function Announcements() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const announcements = useBackend(() => backend.ambassadorAnnouncements(ambId), [], [ambId], ["announcements"]);
  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Announcements</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Latest from Gajab HQ</h1>
        <p className="text-[#5A6378] mt-1">Campaigns, bonuses, payout updates, and more.</p>
      </div>
      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="gajab-card p-5" data-testid={`amb-ann-${a.id}`}>
            <div className="flex items-center gap-2 flex-wrap"><Bell className="w-4 h-4 text-[#F26B1F]" /><span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6378]">{a.id}</span><span className={`gajab-sticker ${priorityClr[a.priority]} border border-current/30`}>{a.priority}</span></div>
            <h3 className="font-display text-lg mt-1.5">{a.title}</h3>
            <p className="text-sm text-[#5A6378] mt-1">{a.body}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#5A6378] mt-3 inline-flex items-center gap-1.5"><Clock className="w-3 h-3" strokeWidth={2} /> {a.sentOn}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
