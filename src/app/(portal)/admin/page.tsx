import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { UsersTable } from "@/components/UsersTable";
import { FeatureFlagsList } from "@/components/FeatureFlagsList";
import { ExportButton } from "@/components/ExportButton";
import { ASSET_FAULT_MENU } from "@/lib/types";
import { auditEvents, currentOrganisation } from "@/lib/mock-data";
import { ShieldCheck } from "lucide-react";

const MOCK_USERS = [
  { name: "Amara Osei", email: "amara.osei@kx-estates.co.uk", role: "Customer Portfolio Administrator", status: "Active" as const },
  { name: "Femi Adeyemi", email: "femi.adeyemi@kx-estates.co.uk", role: "Customer Site Manager", status: "Active" as const },
  { name: "Ravi Chandra", email: "ravi.chandra@kx-estates.co.uk", role: "Customer Site Manager", status: "Active" as const },
  { name: "S&A Helpdesk", email: "helpdesk@sahomeandproperty.co.uk", role: "S&A Operations / Helpdesk", status: "Active" as const },
  { name: "Metro Plumbing Services", email: "jobs@metroplumbing.co.uk", role: "Contractor Company Administrator", status: "Invited" as const },
];

const FEATURE_MODULES = [
  { name: "3D / digital twin viewer", plan: "Enterprise add-on", enabled: true },
  { name: "Contractor workspace", plan: "Standard", enabled: true },
  { name: "PPM & compliance", plan: "Standard", enabled: true },
  { name: "BMS / IoT telemetry (read-only)", plan: "Enterprise add-on", enabled: true },
  { name: "Advanced reporting & export", plan: "Standard", enabled: true },
];

const ENDPOINTS: [string, string][] = [
  ["POST", "/api/v1/auth/invitations"],
  ["GET", "/api/v1/organisations/{organisationId}/properties"],
  ["POST", "/api/v1/properties"],
  ["GET", "/api/v1/properties/{propertyId}"],
  ["GET", "/api/v1/properties/{propertyId}/assets"],
  ["POST", "/api/v1/assets"],
  ["POST", "/api/v1/assets/{assetId}/anchors"],
  ["POST", "/api/v1/work-orders"],
  ["PATCH", "/api/v1/work-orders/{workOrderId}/status"],
  ["POST", "/api/v1/work-orders/{workOrderId}/attachments"],
  ["POST", "/api/v1/work-orders/{workOrderId}/visits"],
  ["GET", "/api/v1/properties/{propertyId}/documents"],
  ["POST", "/api/v1/documents/presign-upload"],
  ["GET", "/api/v1/properties/{propertyId}/scans"],
  ["POST", "/api/v1/integrations/bms/events"],
  ["GET", "/api/v1/assets/{assetId}/telemetry?from=&to="],
  ["GET", "/api/v1/reports/sla"],
];

const DOMAIN_EVENTS: [string, string][] = [
  ["work_order.created", "Helpdesk queue, notifications, analytics, integration sync."],
  ["work_order.status_changed", "Customer updates, SLA engine, audit record."],
  ["visit.completed", "Report generator, customer review, asset history."],
  ["document.expiring", "Compliance dashboard and reminder service."],
  ["ppm.overdue", "Escalation rules and management reporting."],
  ["bms.alarm_received", "Alarm dashboard, correlation and optional work-order creation."],
  ["scan.published", "Viewer cache invalidation and anchor review workflow."],
];

const SECURITY_BASELINE = [
  "UK GDPR privacy by design, data minimisation and defined retention periods.",
  "TLS in transit and managed encryption at rest for databases and files.",
  "MFA, strong password policy, account lockout, secure recovery and optional SSO.",
  "Server-side tenant isolation and authorisation tests for every protected endpoint.",
  "Secrets stored in a managed secrets vault; never committed to source control.",
  "OWASP-aligned secure development, dependency scanning, code review and penetration testing before production.",
  "Malware scanning and file-type validation for uploads.",
  "Immutable or protected audit logs for security-sensitive actions.",
];

export default function AdminPage() {
  const faultTypeCount = Object.values(ASSET_FAULT_MENU).reduce(
    (sum, options) => sum + options.length,
    0,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Users, roles, taxonomies, templates, integrations and tenant settings — no-code configuration, per section 5.13."
      />

      <Card>
        <Tabs
          tabs={[
            {
              id: "users",
              label: "Users & roles",
              content: <UsersTable initialUsers={MOCK_USERS} />,
            },
            {
              id: "taxonomies",
              label: "Taxonomies",
              content: (
                <div className="space-y-4">
                  <p className="text-sm text-muted">
                    {Object.keys(ASSET_FAULT_MENU).length} asset types configured
                    with {faultTypeCount} fault codes. Asset types, fault
                    taxonomies, priorities, SLAs, job statuses and document
                    categories are configurable rather than hard-coded.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted">
                          <th className="pb-2 font-medium">Asset type</th>
                          <th className="pb-2 font-medium">Fault codes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(ASSET_FAULT_MENU).map(([type, options]) => (
                          <tr key={type} className="border-b border-border last:border-0">
                            <td className="py-2.5 font-medium text-ink">{type}</td>
                            <td className="py-2.5 text-body">
                              {options.map((o) => o.label).join(", ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            },
            {
              id: "features",
              label: "Feature flags",
              content: <FeatureFlagsList modules={FEATURE_MODULES} />,
            },
            {
              id: "integrations",
              label: "Integrations & API",
              content: (
                <div className="space-y-6">
                  <p className="text-sm text-muted">
                    Versioned REST API, documented via OpenAPI, with
                    idempotency keys for job creation and webhook signatures
                    for inbound/outbound events (section 11.1).
                  </p>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Endpoint catalogue
                    </p>
                    <div className="overflow-x-auto rounded-md border border-border">
                      <table className="w-full font-mono text-xs">
                        <tbody>
                          {ENDPOINTS.map(([method, path]) => (
                            <tr key={path} className="border-b border-border last:border-0">
                              <td className="w-16 px-3 py-1.5 font-semibold text-brand-800">
                                {method}
                              </td>
                              <td className="px-3 py-1.5 text-body">{path}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Key domain events (webhooks)
                    </p>
                    <div className="overflow-x-auto rounded-md border border-border">
                      <table className="w-full text-xs">
                        <tbody>
                          {DOMAIN_EVENTS.map(([event, consumers]) => (
                            <tr key={event} className="border-b border-border last:border-0">
                              <td className="w-56 px-3 py-1.5 font-mono font-semibold text-ink">
                                {event}
                              </td>
                              <td className="px-3 py-1.5 text-body">{consumers}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    3D providers (Matterport SDK/API, Polycam capture/export,
                    NavVis IVION, custom Three.js) and BMS connectors
                    (BACnet/IP, MQTT, Niagara, vendor APIs) integrate through
                    this same layer — never directly from the browser
                    (sections 9.2, 10.2).
                  </p>
                </div>
              ),
            },
            {
              id: "security",
              label: "Security",
              content: (
                <div className="space-y-6">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Security baseline (section 12.1)
                    </p>
                    <ul className="space-y-1.5">
                      {SECURITY_BASELINE.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-body">
                          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">MFA enforcement</p>
                      <p className="text-sm font-medium text-ink">
                        Required for S&A staff · optional for this organisation
                      </p>
                    </div>
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Session policy</p>
                      <p className="text-sm font-medium text-ink">
                        8 hour session, device logout on password change
                      </p>
                    </div>
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Data residency</p>
                      <p className="text-sm font-medium text-ink">UK/EU (to be confirmed at discovery)</p>
                    </div>
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Retention policy</p>
                      <p className="text-sm font-medium text-ink">Defined per document/data category</p>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: "billing",
              label: "Billing",
              content: (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Plan</p>
                      <p className="text-sm font-medium text-ink">{currentOrganisation.billingPlan}</p>
                    </div>
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Seats</p>
                      <p className="text-sm font-medium text-ink">5 active / 10 included</p>
                    </div>
                    <div className="rounded-md border border-border px-3.5 py-3">
                      <p className="text-xs text-muted">Next invoice</p>
                      <p className="text-sm font-medium text-ink">1 August 2026 — manual contract billing</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted">
                    Billing/subscription integration can be added after
                    commercial model validation; manual contract billing is
                    acceptable in MVP (section 5.13).
                  </p>
                </div>
              ),
            },
            {
              id: "audit",
              label: "Audit log",
              content: (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">
                      Every material change creates an audit event containing
                      actor, timestamp, old value, new value and source
                      (section 2.2).
                    </p>
                    <ExportButton
                      filename="audit-log.csv"
                      rows={auditEvents.map((e) => ({
                        timestamp: e.timestamp,
                        actor: e.actor,
                        action: e.action,
                        entity: e.entity,
                        oldValue: e.oldValue ?? "",
                        newValue: e.newValue ?? "",
                      }))}
                    />
                  </div>
                  <ul className="divide-y divide-border">
                    {auditEvents.map((event) => (
                      <li key={event.id} className="py-2.5 text-sm">
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
                </div>
              ),
            },
            {
              id: "settings",
              label: "Tenant settings",
              content: (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs text-muted">Organisation</p>
                    <p className="font-medium text-ink">{currentOrganisation.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Billing plan</p>
                    <p className="font-medium text-ink">{currentOrganisation.billingPlan}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Branding</p>
                    <p className="font-medium text-ink">S&A default theme</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Session policy</p>
                    <p className="font-medium text-ink">8 hour session, MFA optional</p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
