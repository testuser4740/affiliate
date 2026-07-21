"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const KEY = "gajab_version";
const DEFAULT = "v2";
const VersionContext = createContext({ v: DEFAULT, isV2: true, toggle: () => {} });

export function VersionProvider({ children }) {
  // Always start on V2 (the new default). We don't persist across reloads because
  // the requirement is: V2 is default everywhere; V1 is only a temporary preview.
  const [v, setV] = useState(() => {
    if (typeof localStorage !== "undefined") localStorage.setItem(KEY, DEFAULT);
    return DEFAULT;
  });
  useEffect(() => { if (typeof localStorage !== "undefined") localStorage.setItem(KEY, v); }, [v]);
  const value = { v, isV2: v === "v2", toggle: () => setV(x => (x === "v1" ? "v2" : "v1")) };
  return (
    <VersionContext.Provider value={value}>
      <RouteResetToV2 setV={setV} />
      {children}
    </VersionContext.Provider>
  );
}

// On every route change, snap back to V2. This lets users click V1 to preview the
// old design on the current page only — the moment they navigate anywhere else,
// they're back on V2.
function RouteResetToV2({ setV }) {
  const pathname = usePathname();
  useEffect(() => { setV(DEFAULT); }, [pathname, setV]);
  return null;
}

export function useVersion() {
  return useContext(VersionContext);
}

export function VersionToggle({ className = "" }) {
  const { v, toggle } = useVersion();
  return (
    <button onClick={toggle} data-testid="version-toggle" title="Switch demo version" className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#F26B1F] bg-white text-[10px] font-extrabold uppercase tracking-wider ${className}`}>
      <span className={`px-2 py-0.5 rounded-full transition-all ${v==="v1"?"bg-[#F26B1F] text-white":"text-[#5A6378]"}`}>V1</span>
      <span className={`px-2 py-0.5 rounded-full transition-all ${v==="v2"?"bg-[#F26B1F] text-white":"text-[#5A6378]"}`}>V2</span>
    </button>
  );
}
