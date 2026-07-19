import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { contractorCompanies } from "@/lib/mock-data";

const CONTRACTOR_NAME = "Metro Plumbing Services";

export default function ContractorCompanyPage() {
  const company = contractorCompanies.find((c) => c.name === CONTRACTOR_NAME)!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company profile"
        description="Approved trades, service areas, insurance and competence documents (section 5.9)."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Company">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Name</dt>
              <dd className="font-medium text-ink">{company.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Approval status</dt>
              <dd>
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                    company.approved
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {company.approved ? "Approved" : "Pending approval"}
                </span>
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-muted">Trades</dt>
              <dd className="font-medium text-ink">{company.trades.join(", ")}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-muted">Service areas</dt>
              <dd className="font-medium text-ink">{company.serviceAreas.join(", ")}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Compliance">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs text-muted">Insurance expiry</dt>
              <dd className="font-medium text-ink">{company.insuranceExpiry}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Competence documents</dt>
              <dd className="font-medium text-ink">{company.competenceDocuments} on file</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted">
            Insurance certificates and trade competence documents are
            uploaded and reviewed before jobs can be assigned — an expired
            document suspends new job assignment automatically in the
            production build.
          </p>
        </Card>
      </div>
    </div>
  );
}
