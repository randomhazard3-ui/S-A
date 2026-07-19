"use client";

import Link from "next/link";
import { useState } from "react";
import { Clock } from "lucide-react";
import { PriorityBadge, WorkOrderStatusBadge } from "@/components/StatusBadge";
import type { WorkOrder } from "@/lib/types";

export function ContractorJobQueue({ jobs }: { jobs: WorkOrder[] }) {
  const [decisions, setDecisions] = useState<Record<string, "accepted" | "declined">>({});

  return (
    <ul className="space-y-3">
      {jobs.map((job) => {
        const decision = decisions[job.id];
        const needsDecision = job.status === "Assigned" && !decision;
        return (
          <li key={job.id} className="rounded-lg border border-border bg-surface p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="font-medium text-ink hover:text-brand-800"
                >
                  {job.reference} — {job.faultLabel}
                </Link>
                <p className="mt-0.5 text-sm text-body">
                  {job.propertyName} · {job.locationLabel}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  SLA target {job.slaTargetHours}h
                </p>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={job.priority} />
                <WorkOrderStatusBadge status={job.status} />
              </div>
            </div>

            {needsDecision ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => setDecisions((d) => ({ ...d, [job.id]: "accepted" }))}
                  className="rounded-md bg-brand-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
                >
                  Accept job
                </button>
                <button
                  type="button"
                  onClick={() => setDecisions((d) => ({ ...d, [job.id]: "declined" }))}
                  className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-body hover:bg-black/[.03]"
                >
                  Decline
                </button>
                <label className="ml-auto flex items-center gap-1.5 text-xs text-muted">
                  Propose appointment
                  <input
                    type="datetime-local"
                    className="rounded-md border border-border-strong px-2 py-1 text-xs text-ink"
                  />
                </label>
              </div>
            ) : decision ? (
              <p
                className={`mt-3 border-t border-border pt-3 text-xs font-medium ${
                  decision === "accepted" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {decision === "accepted" ? "Accepted — propose an appointment window." : "Declined — returned to the S&A helpdesk queue."}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
