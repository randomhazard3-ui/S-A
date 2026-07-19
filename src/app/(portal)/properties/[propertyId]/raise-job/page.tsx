import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { RaiseJobForm } from "@/components/RaiseJobForm";
import { EmptyState } from "@/components/EmptyState";
import { Boxes } from "lucide-react";
import { getAssetsForProperty, getPropertyById, properties } from "@/lib/mock-data";

export function generateStaticParams() {
  return properties.map((p) => ({ propertyId: p.id }));
}

export default async function RaiseJobPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const property = getPropertyById(propertyId);
  if (!property) notFound();

  const propertyAssets = getAssetsForProperty(propertyId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Raise a maintenance job"
        description={`${property.name} — select the asset, choose the fault and submit. Target: a complete, correctly located request in under 60 seconds.`}
      />
      {propertyAssets.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No assets registered for this property yet"
          description="Add assets to the register to enable structured job raising."
        />
      ) : (
        <RaiseJobForm
          propertyName={property.name}
          assets={propertyAssets}
          scan={property.scan}
        />
      )}
    </div>
  );
}
