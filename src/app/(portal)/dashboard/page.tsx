import Link from "next/link";
import {
  Building2,
  Wrench,
  AlertTriangle,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { ComplianceRiskBadge, WorkOrderStatusBadge } from "@/components/StatusBadge";
import { properties, workOrders, auditEvents } from "@/lib/mock-data";

export default function DashboardPage() {
  const openJobs = properties.reduce((sum, p) => sum + p.openJobs, 0);
  const slaRiskCount = properties.filter((p) => p.slaRisk).length;
  const documentsDue = properties.reduce((sum, p) => sum + p.documentsDue, 0);

  const recentWorkOrders = [...workOrders]
    .sort((a, b) => (a.raisedAt < b.raisedAt ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Portfolio dashboard"
        description="Status, urgent jobs, SLA risks, compliance due dates and recent activity across your portfolio."
        actions={
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Raise a job
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Properties"
          value={properties.length}
          icon={Building2}
          href="/properties"
        />
        <StatCard label="Open jobs" value={openJobs} icon={Wrench} href="/jobs" />
        <StatCard
          label="SLA risks"
          value={slaRiskCount}
          icon={AlertTriangle}
          tone={slaRiskCount > 0 ? "warn" : "neutral"}
          href="/jobs"
        />
        <StatCard
          label="Documents due"
          value={documentsDue}
          icon={FileText}
          href="/documents"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          title="Properties"
          className="lg:col-span-2"
          action={
            <Link
              href="/properties"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-800 hover:underline"
            >
              View all
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted">
                  <th className="pb-2 font-medium">Site</th>
                  <th className="pb-2 font-medium">Open jobs</th>
                  <th className="pb-2 font-medium">Compliance</th>
                  <th className="pb-2 font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody>
                {properties.slice(0, 6).map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="py-2.5">
                      <Link
                        href={`/properties/${property.id}`}
                        className="font-medium text-ink hover:text-brand-800"
                      >
                        {property.name}
                      </Link>
                      <p className="text-xs text-muted">{property.postcode}</p>
                    </td>
                    <td className="py-2.5 text-body">{property.openJobs}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-body">
                          {property.compliancePercent}%
                        </span>
                        <ComplianceRiskBadge risk={property.complianceRisk} />
                      </div>
                    </td>
                    <td className="py-2.5 text-muted">{property.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Recent activity">
          <ul className="space-y-3.5">
            {auditEvents.slice(0, 5).map((event) => (
              <li key={event.id} className="text-sm">
                <p className="text-ink">
                  <span className="font-medium">{event.actor}</span>{" "}
                  {event.action} {event.entity}
                </p>
                <p className="text-xs text-muted">
                  {new Date(event.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title="Recent jobs"
        action={
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-800 hover:underline"
          >
            View all jobs
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-2 font-medium">Reference</th>
                <th className="pb-2 font-medium">Property</th>
                <th className="pb-2 font-medium">Fault</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentWorkOrders.map((wo) => (
                <tr key={wo.id} className="border-b border-border last:border-0">
                  <td className="py-2.5">
                    <Link
                      href={`/jobs/${wo.id}`}
                      className="font-medium text-ink hover:text-brand-800"
                    >
                      {wo.reference}
                    </Link>
                  </td>
                  <td className="py-2.5 text-body">{wo.propertyName}</td>
                  <td className="py-2.5 text-body">{wo.faultLabel}</td>
                  <td className="py-2.5">
                    <WorkOrderStatusBadge status={wo.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
