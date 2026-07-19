import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { currentOrganisation, currentUser } from "@/lib/mock-data";
import { MobileNav } from "@/components/MobileNav";

export function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <MobileNav />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink truncate">
            {currentOrganisation.name}
          </p>
          <p className="text-xs text-muted">Multi-site portfolio</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link
          href="/properties"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Raise a job
        </Link>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-body hover:bg-black/[.03]"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-warn text-[10px] font-semibold text-white">
            3
          </span>
        </button>
        <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800">
            {currentUser.initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-medium text-ink">{currentUser.name}</p>
            <p className="text-[11px] text-muted">Portfolio Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
