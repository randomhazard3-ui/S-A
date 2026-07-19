"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  Boxes,
  ShieldCheck,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/jobs", label: "Jobs", icon: Wrench },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/compliance", label: "Compliance / PPM", icon: ShieldCheck },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin", label: "Administration", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:shrink-0 border-r border-border bg-brand-950 text-white">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand-900 font-bold text-sm">
          S&A
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Property Intelligence</p>
          <p className="text-[11px] text-white/60">Portal</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10 text-[11px] text-white/50">
        Draft build — mock data only
      </div>
    </aside>
  );
}
