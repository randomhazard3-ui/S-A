"use client";

import Link from "next/link";
import { Plus, UserPlus, Wrench } from "lucide-react";
import { ExportButton } from "@/components/ExportButton";
import { useViewRole } from "@/lib/role-context";

export function DashboardQuickActions({ exportRows }: { exportRows: Record<string, unknown>[] }) {
  const { role } = useViewRole();
  const canManage = role === "CUSTOMER_PORTFOLIO_ADMIN" || role === "SA_ENGINEER";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canManage && (
        <>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            <Wrench className="h-4 w-4" aria-hidden="true" />
            Raise a job
          </Link>
          <Link
            href="/properties/new"
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3.5 py-2 text-sm font-medium text-body hover:bg-black/[.03]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add property
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3.5 py-2 text-sm font-medium text-body hover:bg-black/[.03]"
          >
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            Invite user
          </Link>
        </>
      )}
      <ExportButton filename="portfolio-summary.csv" label="Export report" rows={exportRows} />
    </div>
  );
}
