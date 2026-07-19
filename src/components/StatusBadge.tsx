import type { ComplianceRisk, WorkOrderPriority, WorkOrderStatus } from "@/lib/types";
import type { PPMTask } from "@/lib/types";

type Tone = "neutral" | "info" | "progress" | "warn" | "success";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-black/[.04] text-body border-border-strong",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  progress: "bg-amber-50 text-amber-800 border-amber-200",
  warn: "bg-red-50 text-red-700 border-red-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const statusTone: Record<WorkOrderStatus, Tone> = {
  New: "info",
  Triaged: "info",
  Assigned: "progress",
  Accepted: "progress",
  Scheduled: "progress",
  "In progress": "progress",
  "Awaiting parts": "warn",
  "Quote required": "warn",
  "Temporarily resolved": "progress",
  Completed: "success",
  "Customer review": "success",
  Closed: "neutral",
  "Cancelled / duplicate": "neutral",
};

const priorityTone: Record<WorkOrderPriority, Tone> = {
  LOW: "neutral",
  NORMAL: "info",
  URGENT: "progress",
  CRITICAL: "warn",
};

const complianceRiskTone: Record<ComplianceRisk, Tone> = {
  "on-track": "success",
  "due-soon": "progress",
  overdue: "warn",
};

const complianceRiskLabel: Record<ComplianceRisk, string> = {
  "on-track": "On track",
  "due-soon": "Due soon",
  overdue: "Overdue",
};

const ppmStatusTone: Record<PPMTask["status"], Tone> = {
  scheduled: "info",
  "due-soon": "progress",
  overdue: "warn",
  completed: "success",
  exception: "warn",
};

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}

export function WorkOrderStatusBadge({ status }: { status: WorkOrderStatus }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: WorkOrderPriority }) {
  return (
    <Badge tone={priorityTone[priority]}>
      {priority.charAt(0) + priority.slice(1).toLowerCase()}
    </Badge>
  );
}

export function ComplianceRiskBadge({ risk }: { risk: ComplianceRisk }) {
  return <Badge tone={complianceRiskTone[risk]}>{complianceRiskLabel[risk]}</Badge>;
}

export function PPMStatusBadge({ status }: { status: PPMTask["status"] }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ");
  return <Badge tone={ppmStatusTone[status]}>{label}</Badge>;
}
