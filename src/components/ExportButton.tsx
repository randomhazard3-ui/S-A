"use client";

import { Download } from "lucide-react";
import { downloadCsv } from "@/lib/csv";

export function ExportButton({
  filename,
  rows,
  label = "Export CSV",
}: {
  filename: string;
  rows: Record<string, unknown>[];
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={rows.length === 0}
      onClick={() => downloadCsv(filename, rows)}
      className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-body hover:bg-black/[.03] disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
