import Link from "next/link";
import { AlertTriangle, CalendarClock, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { PPMStatusBadge } from "@/components/StatusBadge";
import { ppmTasks, properties } from "@/lib/mock-data";
import type { PPMTask } from "@/lib/types";

function Group({
  title,
  tasks,
  propertyNameById,
}: {
  title: string;
  tasks: PPMTask[];
  propertyNameById: Record<string, string>;
}) {
  if (tasks.length === 0) return null;
  return (
    <Card title={title}>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex flex-col gap-2 rounded-md border border-border px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-ink">{task.taskName}</p>
              <p className="text-xs text-muted">
                <Link
                  href={`/properties/${task.propertyId}`}
                  className="hover:text-brand-800"
                >
                  {propertyNameById[task.propertyId]}
                </Link>{" "}
                · {task.assetLabel} · {task.contractor}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>{task.frequency}</span>
              <span>Due {task.dueDate}</span>
              <PPMStatusBadge status={task.status} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function CompliancePage() {
  const propertyNameById = Object.fromEntries(properties.map((p) => [p.id, p.name]));

  const overdue = ppmTasks.filter((t) => t.status === "overdue" || t.status === "exception");
  const dueSoon = ppmTasks.filter((t) => t.status === "due-soon");
  const scheduled = ppmTasks.filter((t) => t.status === "scheduled");
  const completed = ppmTasks.filter((t) => t.status === "completed");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Compliance / PPM"
        description="Planned maintenance schedule, statutory records and exceptions across the portfolio."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Overdue / exceptions" value={overdue.length} icon={AlertTriangle} tone={overdue.length > 0 ? "warn" : "neutral"} />
        <StatCard label="Due soon" value={dueSoon.length} icon={CalendarClock} />
        <StatCard label="Scheduled" value={scheduled.length} icon={ShieldCheck} />
        <StatCard label="Completed this period" value={completed.length} icon={CheckCircle2} />
      </div>

      <div className="space-y-6">
        <Group title="Overdue and exceptions" tasks={overdue} propertyNameById={propertyNameById} />
        <Group title="Due soon" tasks={dueSoon} propertyNameById={propertyNameById} />
        <Group title="Scheduled" tasks={scheduled} propertyNameById={propertyNameById} />
      </div>
    </div>
  );
}
