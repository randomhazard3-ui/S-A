import { Download } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { ppmTasks, workOrders } from "@/lib/mock-data";
import { WORK_ORDER_STATUSES } from "@/lib/types";

function countBy<T extends string>(items: T[]): [string, number][] {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-body">{label}</span>
        <span className="font-medium text-ink">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-bg">
        <div
          className="h-2 rounded-full bg-brand-700"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const closedStatuses = new Set(["Closed", "Completed", "Customer review"]);
  const openCount = workOrders.filter((w) => !closedStatuses.has(w.status)).length;
  const closedCount = workOrders.length - openCount;

  const byTrade = countBy(workOrders.map((w) => w.trade));
  const byProperty = countBy(workOrders.map((w) => w.propertyName));
  const byFault = countBy(workOrders.map((w) => w.faultLabel));
  const maxTrade = Math.max(...byTrade.map(([, v]) => v), 1);
  const maxProperty = Math.max(...byProperty.map(([, v]) => v), 1);

  const ppmCompleted = ppmTasks.filter((t) => t.status === "completed").length;
  const ppmCompletionRate = Math.round((ppmCompleted / ppmTasks.length) * 100) || 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="Operational, compliance and contractor performance reporting across the portfolio."
        actions={
          <button
            type="button"
            disabled
            title="Export requires backend wiring — not available in this draft"
            className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3.5 py-2 text-sm font-medium text-muted opacity-70"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV / PDF
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{openCount}</p>
          <p className="mt-1 text-xs text-muted">Open jobs (backlog)</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{closedCount}</p>
          <p className="mt-1 text-xs text-muted">Closed this period</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">92%</p>
          <p className="mt-1 text-xs text-muted">SLA compliance</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{ppmCompletionRate}%</p>
          <p className="mt-1 text-xs text-muted">PPM completion rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Jobs by trade">
          <div className="space-y-3">
            {byTrade.map(([trade, count]) => (
              <Bar key={trade} label={trade} value={count} max={maxTrade} />
            ))}
          </div>
        </Card>

        <Card title="Jobs by property">
          <div className="space-y-3">
            {byProperty.map(([property, count]) => (
              <Bar key={property} label={property} value={count} max={maxProperty} />
            ))}
          </div>
        </Card>

        <Card title="Status breakdown">
          <ul className="space-y-1.5 text-sm">
            {WORK_ORDER_STATUSES.map((status) => {
              const count = workOrders.filter((w) => w.status === status).length;
              if (count === 0) return null;
              return (
                <li key={status} className="flex items-center justify-between">
                  <span className="text-body">{status}</span>
                  <span className="font-medium text-ink">{count}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="Repeat fault types">
          <ul className="space-y-1.5 text-sm">
            {byFault.map(([fault, count]) => (
              <li key={fault} className="flex items-center justify-between">
                <span className="text-body">{fault}</span>
                <span className="font-medium text-ink">{count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Recurring fault codes at the same asset flag for root-cause review
            once sufficient job history accumulates.
          </p>
        </Card>
      </div>

      <Card title="Note on this draft">
        <p className="text-sm text-muted">
          Figures above are illustrative, computed from the mock dataset. The
          production build derives these from real work-order and PPM data,
          with export to CSV/XLSX/PDF subject to role permissions (section
          5.12), plus portfolio benchmarking once reliable data volume
          exists.
        </p>
      </Card>
    </div>
  );
}
