"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Drop-in replacement for react-router-dom's NavLink. Supports both the
// function form `className={({ isActive }) => ...}` and the string form.
export default function NavLink({ href, children, className, end = false, ...props }) {
  const pathname = usePathname();
  let isActive;
  if (end) {
    isActive = pathname === href;
  } else {
    isActive = pathname === href || pathname.startsWith(href + "/") || (href !== "/dashboard" && pathname.startsWith(href));
  }
  const resolved = typeof className === "function" ? className({ isActive }) : className;
  return (
    <Link href={href} className={cn(resolved)} {...props}>
      {children}
    </Link>
  );
}
