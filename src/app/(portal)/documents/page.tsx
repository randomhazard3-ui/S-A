import { PageHeader } from "@/components/PageHeader";
import { DocumentsTable } from "@/components/DocumentsTable";
import { documents, properties } from "@/lib/mock-data";

export default function DocumentsPage() {
  const propertyNameById = Object.fromEntries(properties.map((p) => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Controlled drawings, reports, certificates and schematics with version and visibility control."
      />
      <DocumentsTable documents={documents} propertyNameById={propertyNameById} />
    </div>
  );
}
