"use client";

import { useState } from "react";
import { WORK_ORDER_STATUSES, type WorkOrderStatus } from "@/lib/types";
import { WorkOrderStatusBadge } from "@/components/StatusBadge";

export function JobStatusPanel({ initialStatus }: { initialStatus: WorkOrderStatus }) {
  const [status, setStatus] = useState<WorkOrderStatus>(initialStatus);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-muted">Status</p>
        <WorkOrderStatusBadge status={status} />
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as WorkOrderStatus)}
        className="w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
      >
        {WORK_ORDER_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <p className="text-xs text-muted">
        Draft demo only — updates locally, not persisted.
      </p>
    </div>
  );
}
