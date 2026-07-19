"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Boxes } from "lucide-react";
import type { Asset } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";

const CRITICALITY_LABEL: Record<Asset["criticality"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  "life-safety": "Life safety",
};

const CRITICALITY_TONE: Record<Asset["criticality"], string> = {
  low: "text-muted",
  medium: "text-status-info",
  high: "text-status-progress",
  "life-safety": "text-status-warn font-semibold",
};

export function AssetsTable({
  assets,
  propertyNameById,
}: {
  assets: Asset[];
  propertyNameById: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [system, setSystem] = useState<string>("all");

  const systems = useMemo(
    () => Array.from(new Set(assets.map((a) => a.system))).sort(),
    [assets],
  );

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSystem = system === "all" || asset.system === system;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        asset.tagCode.toLowerCase().includes(q) ||
        asset.assetType.toLowerCase().includes(q) ||
        (propertyNameById[asset.propertyId] ?? "").toLowerCase().includes(q);
      return matchesSystem && matchesQuery;
    });
  }, [assets, query, system, propertyNameById]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tag, type or property…"
            className="w-full rounded-md border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>
        <select
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
        >
          <option value="all">All systems</option>
          {systems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Boxes} title="No assets match your filters" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Asset</th>
                <th className="px-4 py-2.5 font-medium">Property</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">System</th>
                <th className="px-4 py-2.5 font-medium">Criticality</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/assets/${asset.id}`}
                      className="font-medium text-ink hover:text-brand-800"
                    >
                      {asset.assetType} {asset.tagCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/properties/${asset.propertyId}`}
                      className="text-body hover:text-brand-800"
                    >
                      {propertyNameById[asset.propertyId] ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{asset.locationLabel}</td>
                  <td className="px-4 py-3 text-body">{asset.system}</td>
                  <td className={`px-4 py-3 ${CRITICALITY_TONE[asset.criticality]}`}>
                    {CRITICALITY_LABEL[asset.criticality]}
                  </td>
                  <td className="px-4 py-3 text-muted capitalize">
                    {asset.status.replace("-", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
