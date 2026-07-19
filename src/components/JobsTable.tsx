"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { WorkOrder, WorkOrderStatus } from "@/lib/types";
import { WORK_ORDER_STATUSES } from "@/lib/types";
import { PriorityBadge, WorkOrderStatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { Wrench } from "lucide-react";

export function JobsTable({ jobs }: { jobs: WorkOrder[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<WorkOrderStatus | "all">("all");

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus = status === "all" || job.status === status;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        job.reference.toLowerCase().includes(q) ||
        job.propertyName.toLowerCase().includes(q) ||
        job.faultLabel.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [jobs, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, property or fault…"
            className="w-full rounded-md border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as WorkOrderStatus | "all")}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
        >
          <option value="all">All statuses</option>
          {WORK_ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Wrench} title="No jobs match your filters" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Reference</th>
                <th className="px-4 py-2.5 font-medium">Property</th>
                <th className="px-4 py-2.5 font-medium">Fault</th>
                <th className="px-4 py-2.5 font-medium">Trade</th>
                <th className="px-4 py-2.5 font-medium">Priority</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="font-medium text-ink hover:text-brand-800"
                    >
                      {job.reference}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-body">{job.propertyName}</td>
                  <td className="px-4 py-3 text-body">{job.faultLabel}</td>
                  <td className="px-4 py-3 text-muted">{job.trade}</td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={job.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <WorkOrderStatusBadge status={job.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
