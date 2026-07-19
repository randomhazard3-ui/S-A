"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { currentOrganisation } from "@/lib/mock-data";
import { MobileNav } from "@/components/MobileNav";
import { NotificationBell } from "@/components/NotificationBell";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { VIEW_ROLE_LABEL, useViewRole } from "@/lib/role-context";

export function Topbar() {
  const { role } = useViewRole();
  const [name, title] = VIEW_ROLE_LABEL[role].split(" — ");
  const canRaiseJob = role !== "READ_ONLY_AUDITOR" && role !== "CONTRACTOR_ADMIN";
  const orgLabel =
    role === "CONTRACTOR_ADMIN" ? "Metro Plumbing Services" : currentOrganisation.name;
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink truncate">{orgLabel}</p>
          <p className="text-xs text-muted">
            {role === "CONTRACTOR_ADMIN" ? "Contractor workspace" : "Multi-site portfolio"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {canRaiseJob && (
          <Link
            href="/properties"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Raise a job
          </Link>
        )}
        <RoleSwitcher />
        <NotificationBell />
        <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-medium text-ink">{name}</p>
            <p className="text-[11px] text-muted">{title}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
