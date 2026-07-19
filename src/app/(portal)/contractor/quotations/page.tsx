import { PageHeader } from "@/components/PageHeader";
import { ContractorQuotations } from "@/components/ContractorQuotations";
import { EmptyState } from "@/components/EmptyState";
import { ReceiptText } from "lucide-react";
import { getQuotationsForContractor } from "@/lib/mock-data";

const CONTRACTOR_NAME = "Metro Plumbing Services";

export default function ContractorQuotationsPage() {
  const quotations = getQuotationsForContractor(CONTRACTOR_NAME);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Quotation requests, versioned submissions and approval status (section 5.9)."
      />
      {quotations.length === 0 ? (
        <EmptyState icon={ReceiptText} title="No quotation requests" />
      ) : (
        <ContractorQuotations quotations={quotations} />
      )}
    </div>
  );
}
