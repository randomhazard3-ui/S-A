import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, Clock, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { PriorityBadge } from "@/components/StatusBadge";
import { JobStatusPanel } from "@/components/JobStatusPanel";
import { getWorkOrderById, workOrders } from "@/lib/mock-data";

export function generateStaticParams() {
  return workOrders.map((w) => ({ jobId: w.id }));
}

function slaDeadline(raisedAt: string, hours: number) {
  const deadline = new Date(new Date(raisedAt).getTime() + hours * 60 * 60 * 1000);
  return deadline.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = getWorkOrderById(jobId);
  if (!job) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={job.reference}
        description={job.faultLabel}
        actions={<PriorityBadge priority={job.priority} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Details">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Property</dt>
                <dd className="mt-0.5">
                  <Link
                    href={`/properties/${job.propertyId}`}
                    className="font-medium text-ink hover:text-brand-800"
                  >
                    {job.propertyName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Location</dt>
                <dd className="mt-0.5 flex items-center gap-1 font-medium text-ink">
                  <MapPin className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  {job.locationLabel}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Asset</dt>
                <dd className="mt-0.5">
                  {job.assetId ? (
                    <Link
                      href={`/assets/${job.assetId}`}
                      className="font-medium text-ink hover:text-brand-800"
                    >
                      {job.assetLabel}
                    </Link>
                  ) : (
                    <span className="text-muted">No asset linked</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Trade</dt>
                <dd className="mt-0.5 font-medium text-ink">{job.trade}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-muted">Description</dt>
                <dd className="mt-0.5 text-body">{job.description}</dd>
              </div>
            </dl>
          </Card>

          <Card title="Timeline">
            <ol className="space-y-4 border-l border-border pl-4">
              {job.events.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-brand-700" />
                  <p className="text-sm text-ink">
                    <span className="font-medium">{event.actor}</span>{" "}
                    {event.description}
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
            </ol>
          </Card>

          <Card title="Evidence">
            <div className="flex items-center gap-2 rounded-md border border-dashed border-border-strong px-3.5 py-3 text-sm text-muted">
              <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
              No evidence uploaded yet. Engineers attach photos, readings and
              completion notes on attendance.
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <JobStatusPanel initialStatus={job.status} />
          </Card>

          <Card title="SLA">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
              <span className="text-body">
                Target {job.slaTargetHours}h ·{" "}
                {slaDeadline(job.raisedAt, job.slaTargetHours)}
              </span>
            </div>
          </Card>

          <Card title="Assignment">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Raised by</dt>
                <dd className="font-medium text-ink">{job.raisedBy}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Assigned to</dt>
                <dd className="font-medium text-ink">
                  {job.assignedTo ?? "Unassigned"}
                </dd>
              </div>
              {job.scheduledFor && (
                <div>
                  <dt className="text-xs text-muted">Scheduled</dt>
                  <dd className="font-medium text-ink">
                    {new Date(job.scheduledFor).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
