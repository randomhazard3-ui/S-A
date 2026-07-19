import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Boxes,
  Building2,
  FileText,
  MapPin,
  ScanEye,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { EmptyState } from "@/components/EmptyState";
import { RaiseJobButton } from "@/components/RaiseJobButton";
import { FloorPlanViewer } from "@/components/FloorPlanViewer";
import {
  ComplianceRiskBadge,
  PPMStatusBadge,
  PriorityBadge,
  WorkOrderStatusBadge,
} from "@/components/StatusBadge";
import {
  auditEvents,
  getAlarmsForProperty,
  getAssetsForProperty,
  getDocumentsForProperty,
  getLocationsForProperty,
  getPPMTasksForProperty,
  getPropertyById,
  getWorkOrdersForProperty,
  properties,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return properties.map((p) => ({ propertyId: p.id }));
}

export default async function PropertyProfilePage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const property = getPropertyById(propertyId);
  if (!property) notFound();

  const propertyAssets = getAssetsForProperty(propertyId);
  const propertyLocations = getLocationsForProperty(propertyId);
  const propertyJobs = getWorkOrdersForProperty(propertyId);
  const propertyDocuments = getDocumentsForProperty(propertyId);
  const propertyPPM = getPPMTasksForProperty(propertyId);
  const isolationRecords = propertyDocuments.filter(
    (d) => d.category === "Isolation record",
  );
  const propertyAudit = auditEvents.filter((event) =>
    propertyJobs.some((job) => event.entity.includes(job.reference)),
  );

  const contacts = [
    { role: "Client contact", name: property.responsibleManager, detail: "Portfolio Administrator" },
    { role: "Site emergency", name: "S&A 24/7 Helpdesk", detail: "0800 555 0134" },
    { role: "Security", name: "On-site reception", detail: "Weekdays 07:00–19:00" },
    { role: "Escalation", name: "Femi Adeyemi", detail: "Operations Manager" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={property.name}
        description={`${property.addressLine1}, ${property.town} ${property.postcode}`}
        actions={<RaiseJobButton propertyId={property.id} />}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{property.openJobs}</p>
          <p className="mt-1 text-xs text-muted">Open jobs</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">
            {property.compliancePercent}%
          </p>
          <p className="mt-1 text-xs text-muted">Compliance</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{propertyAssets.length}</p>
          <p className="mt-1 text-xs text-muted">Registered assets</p>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="text-2xl font-semibold text-ink">{property.documentsDue}</p>
          <p className="mt-1 text-xs text-muted">Documents due</p>
        </div>
      </div>

      <Card>
        <Tabs
          tabs={[
            {
              id: "overview",
              label: "Overview",
              content: (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <div>
                        <p className="text-ink">{property.addressLine1}</p>
                        <p className="text-muted">
                          {property.town} {property.postcode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                      <div>
                        <p className="text-ink">{property.propertyType}</p>
                        <p className="text-muted">Region: {property.region}</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <ComplianceRiskBadge risk={property.complianceRisk} />
                    </div>
                  </div>
                  <div className="rounded-md border border-dashed border-border-strong p-4 text-sm text-muted">
                    Access instructions, operating hours, site image and
                    emergency contact panel — content to be populated during
                    property onboarding.
                  </div>
                </div>
              ),
            },
            {
              id: "locations",
              label: "Locations",
              content:
                propertyLocations.length === 0 ? (
                  <EmptyState
                    icon={MapPin}
                    title="No locations recorded yet"
                    description="Floor, room and zone hierarchy will appear here once the site is surveyed."
                  />
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {propertyLocations
                      .filter((l) => l.parentId === null)
                      .map((floor) => (
                        <li key={floor.id}>
                          <p className="font-medium text-ink">{floor.name}</p>
                          <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-3">
                            {propertyLocations
                              .filter((l) => l.parentId === floor.id)
                              .map((child) => (
                                <li key={child.id} className="text-muted">
                                  {child.name}{" "}
                                  <span className="text-[11px] uppercase tracking-wide">
                                    ({child.kind})
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}
                  </ul>
                ),
            },
            {
              id: "assets",
              label: "Assets",
              content:
                propertyAssets.length === 0 ? (
                  <EmptyState
                    icon={Boxes}
                    title="No assets registered"
                    description="Add assets to enable structured job raising for this property."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="pb-2 font-medium">Asset</th>
                          <th className="pb-2 font-medium">Location</th>
                          <th className="pb-2 font-medium">System</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyAssets.map((asset) => (
                          <tr key={asset.id} className="border-b border-border last:border-0">
                            <td className="py-2.5">
                              <Link
                                href={`/assets/${asset.id}`}
                                className="font-medium text-ink hover:text-brand-800"
                              >
                                {asset.assetType} {asset.tagCode}
                              </Link>
                            </td>
                            <td className="py-2.5 text-body">{asset.locationLabel}</td>
                            <td className="py-2.5 text-body">{asset.system}</td>
                            <td className="py-2.5 text-muted capitalize">
                              {asset.status.replace("-", " ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            },
            {
              id: "jobs",
              label: "Jobs",
              content:
                propertyJobs.length === 0 ? (
                  <EmptyState
                    icon={Wrench}
                    title="No jobs raised for this property"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="pb-2 font-medium">Reference</th>
                          <th className="pb-2 font-medium">Fault</th>
                          <th className="pb-2 font-medium">Priority</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyJobs.map((job) => (
                          <tr key={job.id} className="border-b border-border last:border-0">
                            <td className="py-2.5">
                              <Link
                                href={`/jobs/${job.id}`}
                                className="font-medium text-ink hover:text-brand-800"
                              >
                                {job.reference}
                              </Link>
                            </td>
                            <td className="py-2.5 text-body">{job.faultLabel}</td>
                            <td className="py-2.5">
                              <PriorityBadge priority={job.priority} />
                            </td>
                            <td className="py-2.5">
                              <WorkOrderStatusBadge status={job.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            },
            {
              id: "documents",
              label: "Documents",
              content:
                propertyDocuments.length === 0 ? (
                  <EmptyState icon={FileText} title="No documents uploaded" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="pb-2 font-medium">Title</th>
                          <th className="pb-2 font-medium">Category</th>
                          <th className="pb-2 font-medium">Revision</th>
                          <th className="pb-2 font-medium">Visibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyDocuments.map((doc) => (
                          <tr key={doc.id} className="border-b border-border last:border-0">
                            <td className="py-2.5 font-medium text-ink">{doc.title}</td>
                            <td className="py-2.5 text-body">{doc.category}</td>
                            <td className="py-2.5 text-muted">
                              v{doc.version} · {doc.revisionDate}
                            </td>
                            <td className="py-2.5 text-muted capitalize">{doc.visibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            },
            {
              id: "isolations",
              label: "Isolations",
              content: (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-800">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      Isolation information is safety-critical. Every record
                      must show owner, source, date verified and next review
                      date — the interface must visibly warn when unverified
                      or overdue for review.
                    </span>
                  </div>
                  {isolationRecords.length === 0 ? (
                    <EmptyState
                      icon={ShieldAlert}
                      title="No isolation records on file"
                    />
                  ) : (
                    <ul className="space-y-2">
                      {isolationRecords.map((doc) => (
                        <li
                          key={doc.id}
                          className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5 text-sm"
                        >
                          <div>
                            <p className="font-medium text-ink">{doc.title}</p>
                            <p className="text-xs text-muted">
                              Verified {doc.revisionDate}
                              {doc.reviewDate ? ` · Review due ${doc.reviewDate}` : ""}
                            </p>
                          </div>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                              doc.status === "unverified"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {doc.status === "unverified" ? "Unverified" : "Verified"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ),
            },
            {
              id: "3d",
              label: "3D / Floor Plan",
              content: propertyAssets.some((a) => a.anchor) ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted">
                    Draft placeholder — production build embeds the real
                    scan/floor-plan provider. Hotspot positions come from the
                    portal-owned asset anchor, not the viewer (section 9,
                    architectural principle).
                  </p>
                  <FloorPlanViewer
                    assets={propertyAssets}
                    scan={property.scan}
                    alarmAssetIds={getAlarmsForProperty(propertyId)
                      .filter((a) => a.status === "active")
                      .map((a) => a.assetId)}
                  />
                </div>
              ) : (
                <EmptyState
                  icon={ScanEye}
                  title="No 3D scan or floor plan on file"
                  description="Assets need scan anchors before a viewer can be embedded here."
                />
              ),
            },
            {
              id: "ppm",
              label: "PPM / Compliance",
              content:
                propertyPPM.length === 0 ? (
                  <EmptyState icon={ScanEye} title="No planned maintenance scheduled" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="pb-2 font-medium">Task</th>
                          <th className="pb-2 font-medium">Frequency</th>
                          <th className="pb-2 font-medium">Due</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propertyPPM.map((task) => (
                          <tr key={task.id} className="border-b border-border last:border-0">
                            <td className="py-2.5">
                              <p className="font-medium text-ink">{task.taskName}</p>
                              <p className="text-xs text-muted">{task.assetLabel}</p>
                            </td>
                            <td className="py-2.5 text-body">{task.frequency}</td>
                            <td className="py-2.5 text-muted">{task.dueDate}</td>
                            <td className="py-2.5">
                              <PPMStatusBadge status={task.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            },
            {
              id: "contacts",
              label: "Contacts",
              content: (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {contacts.map((contact) => (
                    <li
                      key={contact.role}
                      className="rounded-md border border-border px-3.5 py-3"
                    >
                      <p className="text-xs uppercase tracking-wide text-muted">
                        {contact.role}
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted">{contact.detail}</p>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "audit",
              label: "Audit",
              content:
                propertyAudit.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No audit activity linked to this property yet"
                  />
                ) : (
                  <ul className="space-y-3">
                    {propertyAudit.map((event) => (
                      <li key={event.id} className="text-sm">
                        <p className="text-ink">
                          <span className="font-medium">{event.actor}</span>{" "}
                          {event.action} {event.entity}
                          {event.oldValue && event.newValue && (
                            <span className="text-muted">
                              {" "}
                              ({event.oldValue} → {event.newValue})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted">
                          {new Date(event.timestamp).toLocaleString("en-GB")}
                        </p>
                      </li>
                    ))}
                  </ul>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
