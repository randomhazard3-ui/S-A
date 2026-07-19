import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { WorkOrderStatusBadge } from "@/components/StatusBadge";
import { RaiseJobButton } from "@/components/RaiseJobButton";
import { BmsAssetPanel } from "@/components/BmsAssetPanel";
import {
  alarms,
  assets,
  getAssetById,
  getPropertyById,
  getTelemetryForAsset,
  getWorkOrdersForProperty,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return assets.map((a) => ({ assetId: a.id }));
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink">{value ?? "—"}</dd>
    </div>
  );
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;
  const asset = getAssetById(assetId);
  if (!asset) notFound();

  const property = getPropertyById(asset.propertyId);
  const assetJobs = getWorkOrdersForProperty(asset.propertyId).filter(
    (job) => job.assetId === asset.id,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${asset.assetType} ${asset.tagCode}`}
        description={
          property ? (
            <>
              <Link href={`/properties/${property.id}`} className="hover:text-brand-800">
                {property.name}
              </Link>{" "}
              · {asset.locationLabel}
            </>
          ) : (
            asset.locationLabel
          )
        }
        actions={property && <RaiseJobButton propertyId={property.id} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Identity">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Asset ID" value={asset.id} />
            <Field label="Tag / QR code" value={asset.tagCode} />
            <Field label="Asset type" value={asset.assetType} />
            <Field label="System" value={asset.system} />
          </dl>
        </Card>

        <Card title="Location">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Property" value={property?.name} />
            <Field label="Location" value={asset.locationLabel} />
          </dl>
        </Card>

        <Card title="Technical">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Manufacturer" value={asset.manufacturer} />
            <Field label="Model" value={asset.model} />
            <Field label="Serial number" value={asset.serial} />
          </dl>
        </Card>

        <Card title="Lifecycle">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Install date" value={asset.installDate} />
            <Field
              label="Expected life"
              value={asset.expectedLifeYears ? `${asset.expectedLifeYears} years` : undefined}
            />
            <Field label="Condition" value={<span className="capitalize">{asset.condition}</span>} />
            <Field
              label="Criticality"
              value={<span className="capitalize">{asset.criticality.replace("-", " ")}</span>}
            />
          </dl>
        </Card>

        <Card title="Maintenance">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Contractor" value={asset.maintenanceContractor} />
            <Field label="Next service due" value={asset.nextServiceDue} />
            <Field label="Status" value={<span className="capitalize">{asset.status.replace("-", " ")}</span>} />
          </dl>
        </Card>

        <Card title="Records">
          <p className="text-sm text-muted">
            Photos, manuals, commissioning data and readings are linked from
            the property&apos;s document library (section 5.7).
          </p>
        </Card>
      </div>

      {(getTelemetryForAsset(asset.id).length > 0 ||
        alarms.some((a) => a.assetId === asset.id)) && (
        <Card title="BMS / live status">
          <BmsAssetPanel
            telemetry={getTelemetryForAsset(asset.id)}
            alarms={alarms.filter((a) => a.assetId === asset.id)}
            propertyId={asset.propertyId}
          />
        </Card>
      )}

      <Card title="Job history">
        {assetJobs.length === 0 ? (
          <p className="text-sm text-muted">No jobs recorded against this asset.</p>
        ) : (
          <ul className="space-y-2">
            {assetJobs.map((job) => (
              <li
                key={job.id}
                className="flex items-center justify-between rounded-md border border-border px-3.5 py-2.5"
              >
                <div>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="text-sm font-medium text-ink hover:text-brand-800"
                  >
                    {job.reference} — {job.faultLabel}
                  </Link>
                  <p className="text-xs text-muted">
                    Raised {new Date(job.raisedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <WorkOrderStatusBadge status={job.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
