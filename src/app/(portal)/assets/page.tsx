import { PageHeader } from "@/components/PageHeader";
import { AssetsTable } from "@/components/AssetsTable";
import { assets, properties } from "@/lib/mock-data";

export default function AssetsPage() {
  const propertyNameById = Object.fromEntries(
    properties.map((p) => [p.id, p.name]),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Portfolio-wide, portal-owned asset register — searchable and filterable by system, location and status."
      />
      <AssetsTable assets={assets} propertyNameById={propertyNameById} />
    </div>
  );
}
