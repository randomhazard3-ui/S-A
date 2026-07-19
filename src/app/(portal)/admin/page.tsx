import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { ASSET_FAULT_MENU } from "@/lib/types";

const MOCK_USERS = [
  { name: "Amara Osei", email: "amara.osei@kx-estates.co.uk", role: "Customer Portfolio Administrator", status: "Active" },
  { name: "Femi Adeyemi", email: "femi.adeyemi@kx-estates.co.uk", role: "Customer Site Manager", status: "Active" },
  { name: "Ravi Chandra", email: "ravi.chandra@kx-estates.co.uk", role: "Customer Site Manager", status: "Active" },
  { name: "S&A Helpdesk", email: "helpdesk@sahomeandproperty.co.uk", role: "S&A Operations / Helpdesk", status: "Active" },
  { name: "Metro Plumbing Services", email: "jobs@metroplumbing.co.uk", role: "Contractor Company Administrator", status: "Invited" },
];

const FEATURE_MODULES = [
  { name: "3D / digital twin viewer", plan: "Enterprise add-on", enabled: false },
  { name: "Contractor workspace", plan: "Standard", enabled: true },
  { name: "PPM & compliance", plan: "Standard", enabled: true },
  { name: "BMS / IoT telemetry (read-only)", plan: "Enterprise add-on", enabled: false },
  { name: "Advanced reporting & export", plan: "Standard", enabled: true },
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
              content: (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted">
                        <th className="pb-2 font-medium">Name</th>
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Role</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_USERS.map((user) => (
                        <tr key={user.email} className="border-b border-border last:border-0">
                          <td className="py-2.5 font-medium text-ink">{user.name}</td>
                          <td className="py-2.5 text-muted">{user.email}</td>
                          <td className="py-2.5 text-body">{user.role}</td>
                          <td className="py-2.5">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                                user.status === "Active"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 text-xs text-muted">
                    Invitation-based onboarding only — role, organisation
                    membership and property scope are assigned per user
                    (section 2.2).
                  </p>
                </div>
              ),
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
              content: (
                <ul className="divide-y divide-border">
                  {FEATURE_MODULES.map((mod) => (
                    <li key={mod.name} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-ink">{mod.name}</p>
                        <p className="text-xs text-muted">{mod.plan}</p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          mod.enabled
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-border-strong bg-black/[.04] text-body"
                        }`}
                      >
                        {mod.enabled ? "Enabled" : "Not enabled"}
                      </span>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              id: "settings",
              label: "Tenant settings",
              content: (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div>
                    <p className="text-xs text-muted">Organisation</p>
                    <p className="font-medium text-ink">King&apos;s Cross Estates Ltd</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Billing plan</p>
                    <p className="font-medium text-ink">Standard</p>
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
