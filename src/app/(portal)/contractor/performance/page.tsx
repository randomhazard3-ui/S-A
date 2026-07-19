import { CheckCircle2, Clock, FileWarning, Repeat, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/Card";
import { contractorCompanies, getWorkOrdersForContractor } from "@/lib/mock-data";

const CONTRACTOR_NAME = "Metro Plumbing Services";

export default function ContractorPerformancePage() {
  const company = contractorCompanies.find((c) => c.name === CONTRACTOR_NAME)!;
  const jobs = getWorkOrdersForContractor(CONTRACTOR_NAME);
  const closedJobs = jobs.filter((j) => j.status === "Closed" || j.status === "Completed");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Performance"
        description="Response, completion, first-time fix, recalls, quality and overdue documents (section 5.9)."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Response rate" value={`${company.responseRate}%`} icon={Clock} />
        <StatCard label="First-time fix" value={`${company.firstTimeFixRate}%`} icon={CheckCircle2} />
        <StatCard label="Jobs completed" value={closedJobs.length} icon={Star} />
        <StatCard label="Recalls (90d)" value={0} icon={Repeat} />
      </div>

      <Card title="Documents on file">
        <div className="flex items-center gap-2 text-sm">
          <FileWarning className="h-4 w-4 text-muted" aria-hidden="true" />
          <span className="text-body">
            {company.competenceDocuments} competence documents current ·
            insurance valid to {company.insuranceExpiry}
          </span>
        </div>
        <p className="mt-3 text-xs text-muted">
          Overdue insurance or competence documents automatically suspend new
          job assignment in the production build and surface here for
          renewal.
        </p>
      </Card>
    </div>
  );
}
