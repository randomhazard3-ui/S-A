"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, UserCog } from "lucide-react";
import { VIEW_ROLE_LABEL, useViewRole, type ViewRole } from "@/lib/role-context";

const ORDER: ViewRole[] = [
  "CUSTOMER_PORTFOLIO_ADMIN",
  "SA_ENGINEER",
  "CONTRACTOR_ADMIN",
  "READ_ONLY_AUDITOR",
];

export function RoleSwitcher() {
  const { role, setRole } = useViewRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-body hover:bg-black/[.03]"
        title="This draft lets you preview the portal as any role — production access is enforced server-side per section 2.2"
      >
        <UserCog className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        <span className="hidden lg:inline">View as</span>
        <ChevronDown className="h-3 w-3 text-muted" aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-72 rounded-md border border-border bg-surface py-1.5 shadow-lg">
          <p className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-muted">
            Preview as role
          </p>
          {ORDER.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                r === role ? "bg-brand-50 text-brand-800 font-medium" : "text-body hover:bg-black/[.03]"
              }`}
            >
              {VIEW_ROLE_LABEL[r]}
            </button>
          ))}
          <p className="mt-1 border-t border-border px-3 pt-2 text-[11px] text-muted">
            Demonstrates the RBAC-driven navigation from section 2 — real
            enforcement happens server-side, per query (2.2).
          </p>
        </div>
      )}
    </div>
  );
}
