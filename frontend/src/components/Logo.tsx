import React from "react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_ambassador-network-2/artifacts/7hdthybf_logo-DjhEOS6p.png";

export default function Logo({ size = "md", showTag = true, variant = "dark" }) {
  const sizes = {
    sm: { logo: "h-8", text: "text-lg", tag: "text-[9px]" },
    md: { logo: "h-10", text: "text-xl", tag: "text-[10px]" },
    lg: { logo: "h-14", text: "text-3xl", tag: "text-xs" },
    xl: { logo: "h-20", text: "text-5xl", tag: "text-sm" },
  };
  const s = sizes[size];
  const textColor = variant === "light" ? "text-white" : "text-[#1B2D54]";
  const accent = variant === "light" ? "text-[#FFC93C]" : "text-[#F26B1F]";
  return (
    <div className="inline-flex items-center gap-2.5" data-testid="gajab-logo">
      <img src={LOGO_URL} alt="Gajab Ambassadors" className={`${s.logo} w-auto object-contain`} />
      <div className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight ${textColor} ${s.text}`}>
          Gajab<span className={accent}>.</span>
        </span>
        {showTag && (
          <span className={`uppercase font-bold tracking-[0.18em] ${variant === "light" ? "text-white/70" : "text-[#1B2D54]/60"} ${s.tag} mt-0.5`}>
            Ambassadors
          </span>
        )}
      </div>
    </div>
  );
}
