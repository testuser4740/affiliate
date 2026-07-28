"use client";
import React from "react";
import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { tiers } from "@/data/options";
import { useAuth } from "@/lib/auth";
import { useBackend } from "@/lib/useBackend";
import { backend } from "@/lib/apiHooks";
import { Skeleton } from "@/components/ui/skeleton";

const Field = ({ label, value, type = "text" }) => (
  <label className="block">
    <span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">{label}</span>
    <input type={type} defaultValue={value} className="input-gajab mt-1" />
  </label>
);

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-64 sm:w-80" />
      </div>
      <div className="gajab-card p-6 flex items-center gap-4 flex-wrap">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        <Skeleton className="hidden sm:block w-20 h-20 rounded-2xl" />
      </div>
      <div className="gajab-card p-6 space-y-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-lg" /></div>
          <div className="space-y-1"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-lg" /></div>
          <div className="space-y-1"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-lg" /></div>
          <div className="space-y-1"><Skeleton className="h-3 w-20" /><Skeleton className="h-10 w-full rounded-lg" /></div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const ambId = user?.ambassadorId;
  const ambassador = useBackend(() => backend.ambassadorHome(ambId).then(r => r.ambassador), null, [ambId], ["leaderboard", "orders", "commission"], ambId);
  const profileLoading = ambassador === null;
  const tier = tiers.find(t => t.name === (ambassador?.tier?.name ?? "Bronze")) || tiers[0];

  if (profileLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-5">
      <div>
        <span className="gajab-sticker-yellow">Your Profile</span>
        <h1 className="font-display text-3xl sm:text-4xl mt-2">Personal details</h1>
      </div>
      <div className="gajab-card p-6 flex items-center gap-4 flex-wrap">
        <img src={ambassador?.avatar ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"} alt="" className="w-20 h-20 rounded-full object-cover ring-2 ring-[#F26B1F]/30" />
        <div className="flex-1 min-w-0">
          <p className="font-display text-2xl">{ambassador?.name ?? "Ambassador"}</p>
          <p className="text-[#5A6378]">{ambassador?.college ?? ""} • {ambassador?.city ?? ""}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`gajab-sticker ${tier.bg} border`} style={{ color: tier.color, borderColor: `${tier.color}40` }} data-testid="profile-tier-badge">
              {tier.icon} {tier.name} Tier
            </span>
            <span className="gajab-sticker-orange">Rank #{ambassador?.rank ?? 0}</span>
            <span className="gajab-sticker bg-[#FFF1C2] text-[#92400E] border border-[#FFC93C]/60">{tier.commission} commission</span>
          </div>
        </div>
        <div className={`hidden sm:grid w-20 h-20 rounded-2xl ${tier.bg} place-items-center text-5xl`}>
          {tier.icon}
        </div>
      </div>

      <div className="gajab-card p-6">
        <h3 className="font-display text-lg mb-3">Personal info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name" value={ambassador?.name ?? ""} />
          <Field label="Phone" value={ambassador?.phone ?? ""} />
          <Field label="Email" value={ambassador?.email ?? ""} type="email" />
          <Field label="City" value={ambassador?.city ?? ""} />
        </div>
      </div>

      <div className="gajab-card p-6" data-testid="profile-address-section">
        <h3 className="font-display text-lg mb-3 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#F26B1F]" /> Address</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2"><span className="text-xs font-bold uppercase tracking-wider text-[#5A6378]">Street / House / Landmark</span><input defaultValue="204, Rose Apartments, Model Town" className="input-gajab mt-1" data-testid="addr-street" /></label>
          <Field label="City" value={ambassador?.city ?? ""} />
          <Field label="State" value={ambassador?.state ?? "Delhi"} />
          <Field label="Pincode" value="110009" />
          <Field label="Country" value="India" />
        </div>
      </div>

      <button onClick={()=>toast.success("Profile changes saved")} className="btn-primary" data-testid="save-profile-btn">Save changes</button>
    </div>
  );
}
