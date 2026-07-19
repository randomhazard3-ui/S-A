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
  Radio,
  ClipboardList,
  Award,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import { useViewRole, type ViewRole } from "@/lib/role-context";

const CUSTOMER_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/jobs", label: "Jobs", icon: Wrench },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/compliance", label: "Compliance / PPM", icon: ShieldCheck },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/bms", label: "BMS / Telemetry", icon: Radio },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin", label: "Administration", icon: Settings },
];

const ENGINEER_NAV = CUSTOMER_NAV.filter((item) => item.href !== "/admin");

const AUDITOR_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/compliance", label: "Compliance / PPM", icon: ShieldCheck },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const CONTRACTOR_NAV = [
  { href: "/contractor", label: "Job queue", icon: ClipboardList },
  { href: "/contractor/company", label: "Company profile", icon: Award },
  { href: "/contractor/quotations", label: "Quotations", icon: ReceiptText },
  { href: "/contractor/performance", label: "Performance", icon: TrendingUp },
];

export function navItemsForRole(role: ViewRole) {
  switch (role) {
    case "SA_ENGINEER":
      return ENGINEER_NAV;
    case "READ_ONLY_AUDITOR":
      return AUDITOR_NAV;
    case "CONTRACTOR_ADMIN":
      return CONTRACTOR_NAV;
    default:
      return CUSTOMER_NAV;
  }
}

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useViewRole();
  const items = navItemsForRole(role);

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
        {items.map((item) => {
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
