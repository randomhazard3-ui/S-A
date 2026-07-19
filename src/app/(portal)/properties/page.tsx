import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ComplianceRiskBadge } from "@/components/StatusBadge";
import { properties } from "@/lib/mock-data";

export default function PropertiesPage() {
  const regions = Array.from(new Set(properties.map((p) => p.region))).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Properties"
        description="Authorised properties and quick access to each digital property profile."
      />

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-brand-800 px-3 py-1.5 font-medium text-white">
          All regions
        </span>
        {regions.map((region) => (
          <span
            key={region}
            className="rounded-full border border-border-strong px-3 py-1.5 font-medium text-body"
          >
            {region}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Link
            key={property.id}
            href={`/properties/${property.id}`}
            className="group flex flex-col rounded-lg border border-border bg-surface p-4 transition-colors hover:border-brand-700"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-ink">{property.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {property.town}, {property.postcode}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-border-strong px-2 py-0.5 text-[11px] font-medium text-body">
                {property.propertyType}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-md bg-bg px-2 py-2">
                <p className="text-base font-semibold text-ink">
                  {property.openJobs}
                </p>
                <p className="text-muted">Open jobs</p>
              </div>
              <div className="rounded-md bg-bg px-2 py-2">
                <p className="text-base font-semibold text-ink">
                  {property.compliancePercent}%
                </p>
                <p className="text-muted">Compliance</p>
              </div>
              <div className="rounded-md bg-bg px-2 py-2">
                <p className="text-base font-semibold text-ink">
                  {property.documentsDue}
                </p>
                <p className="text-muted">Docs due</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <ComplianceRiskBadge risk={property.complianceRisk} />
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-800 opacity-0 transition-opacity group-hover:opacity-100">
                View profile
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
