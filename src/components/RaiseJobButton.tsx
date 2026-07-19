"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useViewRole } from "@/lib/role-context";

export function RaiseJobButton({
  propertyId,
  variant = "solid",
}: {
  propertyId: string;
  variant?: "solid" | "compact";
}) {
  const { role } = useViewRole();
  if (role === "READ_ONLY_AUDITOR" || role === "CONTRACTOR_ADMIN") return null;

  return (
    <Link
      href={`/properties/${propertyId}/raise-job`}
      className={
        variant === "solid"
          ? "inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          : "inline-flex items-center gap-1.5 rounded-md border border-brand-700 px-3 py-1.5 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-50"
      }
    >
      <Plus className="h-4 w-4" aria-hidden="true" />
      Raise a job
    </Link>
  );
}
