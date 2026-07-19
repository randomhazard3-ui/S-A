import { PageHeader } from "@/components/PageHeader";
import { ContractorJobQueue } from "@/components/ContractorJobQueue";
import { EmptyState } from "@/components/EmptyState";
import { ClipboardList } from "lucide-react";
import { getWorkOrdersForContractor } from "@/lib/mock-data";

const CONTRACTOR_NAME = "Metro Plumbing Services";

export default function ContractorQueuePage() {
  const jobs = getWorkOrdersForContractor(CONTRACTOR_NAME);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job queue"
        description={`Jobs assigned to ${CONTRACTOR_NAME} — accept or decline, propose an appointment window, and track SLA countdowns.`}
      />
      {jobs.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No jobs currently assigned" />
      ) : (
        <ContractorJobQueue jobs={jobs} />
      )}
    </div>
  );
}
