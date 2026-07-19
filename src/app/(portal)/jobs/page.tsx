import { PageHeader } from "@/components/PageHeader";
import { JobsTable } from "@/components/JobsTable";
import { workOrders } from "@/lib/mock-data";

export default function JobsPage() {
  const sorted = [...workOrders].sort((a, b) =>
    a.raisedAt < b.raisedAt ? 1 : -1,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        description="Search, filter and track reactive and planned work orders across the portfolio."
      />
      <JobsTable jobs={sorted} />
    </div>
  );
}
