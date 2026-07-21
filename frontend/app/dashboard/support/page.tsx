"use client";
import React from "react";
import { Mail, Phone, MessageCircle, Clock } from "lucide-react";
import { useVersion } from "@/hooks/useVersion";
import { useBackend } from "@/lib/useBackend";
import { backend } from "@/lib/apiHooks";
import { useAuth } from "@/lib/auth";
import { get } from "@/lib/api";

const DEMO_AMB_ID = "amb_005";

export default function Support() {
  const { isV2 } = useVersion();
  const { user } = useAuth();
  const ambId = user?.ambassadorId ?? DEMO_AMB_ID;
  const pocs = useBackend(() => get("/admin/pocs").then(r => (r as any).data), [], [], ["pocs"]);
  const ambassador = useBackend(() => backend.ambassadorHome(ambId).then(r => r.ambassador), null, [ambId], ["leaderboard", "orders", "commission"]);
  const myPocs = pocs.filter(p => p.linkedAffiliates.includes(ambassador?.name ?? ""));
  const others = pocs.filter(p => !p.linkedAffiliates.includes(ambassador?.name ?? ""));
  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Support</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Your Gajab POCs</h1>
        <p className="text-[#5A6378] mt-1">Reach out anytime — your dedicated team is here to help.</p>
      </div>
      {myPocs.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#F26B1F] mb-2">⭐ Your dedicated POC</p>
          <div className="grid sm:grid-cols-2 gap-4">{myPocs.map(p => <PocCard key={p.id} p={p} primary />)}</div>
        </div>
      )}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#5A6378] mb-2">{isV2 ? "Contact your Gajab team" : "Other regional & speciality POCs"}</p>
        <div className="grid sm:grid-cols-2 gap-4">{(isV2 ? [] : others).map(p => <PocCard key={p.id} p={p} />)}</div>
        {isV2 && myPocs.length === 0 && <p className="text-sm text-[#5A6378]">No POC assigned yet. Please contact <a href="mailto:support@gajab.com" className="text-[#F26B1F] font-bold underline">support@gajab.com</a> for help.</p>}
      </div>
    </div>
  );
}

const PocCard = ({ p, primary = false }: any) => (
  <div className={`gajab-card p-5 ${primary ? "bg-[#FFF7EE]" : ""}`} data-testid={`amb-poc-${p.id}`}>
    <div className="flex items-start gap-3">
      <img src={p.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover" />
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg leading-tight">{p.name}</h3>
        <p className="text-xs text-[#F26B1F] font-bold uppercase tracking-wider mt-0.5">{p.role}</p>
        <p className="text-xs text-[#5A6378] mt-1">{p.region}</p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-1 gap-2">
      <a href={`mailto:${p.email}`} className="flex items-center gap-2 text-sm p-2 rounded-lg border border-[#EFEAE0] hover:bg-[#FFF7EE]"><Mail className="w-4 h-4 text-[#F26B1F]" />{p.email}</a>
      <a href={`tel:${p.phone}`} className="flex items-center gap-2 text-sm p-2 rounded-lg border border-[#EFEAE0] hover:bg-[#FFF7EE]"><Phone className="w-4 h-4 text-[#F26B1F]" />{p.phone}</a>
      <a href={`https://wa.me/${p.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm p-2 rounded-lg border border-[#EFEAE0] hover:bg-[#D1FAE5]"><MessageCircle className="w-4 h-4 text-[#25D366]" />WhatsApp {p.whatsapp}</a>
    </div>
    <p className="text-[11px] text-[#5A6378] mt-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {p.workingHours}</p>
  </div>
);
