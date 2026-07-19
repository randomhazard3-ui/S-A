"use client";

import Link from "next/link";
import { useState } from "react";
import type { Asset, ScanInfo } from "@/lib/types";

const STATUS_FILL: Record<Asset["status"], string> = {
  "in-service": "#2f7159",
  faulty: "#dc2626",
  decommissioned: "#9ca3af",
};

export function FloorPlanViewer({
  assets,
  scan,
  mode = "view",
  selectedAssetId,
  onSelect,
  alarmAssetIds = [],
}: {
  assets: Asset[];
  scan?: ScanInfo;
  mode?: "view" | "select";
  selectedAssetId?: string;
  onSelect?: (assetId: string) => void;
  alarmAssetIds?: string[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const anchored = assets.filter((a) => a.anchor);
  const activeId = hovered ?? selectedAssetId ?? null;
  const activeAsset = anchored.find((a) => a.id === activeId) ?? null;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border border-border bg-[#eef2f0]">
        <svg viewBox="0 0 100 100" className="h-80 w-full" role="img" aria-label="Property floor plan">
          <path
            d="M 8 92 L 8 25 L 50 6 L 92 25 L 92 92 Z"
            fill="#e4ece8"
            stroke="#c7cfcb"
            strokeWidth="0.6"
          />
          <path
            d="M 8 60 L 92 60 M 50 6 L 50 92"
            stroke="#c7cfcb"
            strokeWidth="0.4"
            strokeDasharray="1.5 1.5"
          />
          {anchored.map((asset) => {
            const isActive = activeId === asset.id;
            const hasAlarm = alarmAssetIds.includes(asset.id);
            return (
              <g
                key={asset.id}
                transform={`translate(${asset.anchor!.x}, ${asset.anchor!.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(asset.id)}
                onMouseLeave={() => setHovered((h) => (h === asset.id ? null : h))}
                onClick={() => onSelect?.(asset.id)}
              >
                {hasAlarm && (
                  <circle r={isActive ? 4.5 : 4} fill="none" stroke="#dc2626" strokeWidth="0.6">
                    <animate attributeName="r" values="3;5.5;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={isActive ? 3 : 2.3}
                  fill={STATUS_FILL[asset.status]}
                  stroke="#ffffff"
                  strokeWidth="0.6"
                />
              </g>
            );
          })}
        </svg>

        {activeAsset && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-sm">
            <p className="font-semibold text-ink">
              {activeAsset.assetType} {activeAsset.tagCode}
            </p>
            <p className="text-muted">{activeAsset.locationLabel}</p>
          </div>
        )}
      </div>

      {mode === "view" ? (
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {anchored.map((asset) => (
            <li key={asset.id}>
              <Link
                href={`/assets/${asset.id}`}
                onMouseEnter={() => setHovered(asset.id)}
                onMouseLeave={() => setHovered((h) => (h === asset.id ? null : h))}
                className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-body hover:border-brand-700"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_FILL[asset.status] }}
                  aria-hidden="true"
                />
                {asset.assetType} {asset.tagCode}
                {alarmAssetIds.includes(asset.id) && (
                  <span className="ml-auto rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-700">
                    Alarm
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {anchored.map((asset) => (
            <li key={asset.id}>
              <button
                type="button"
                onClick={() => onSelect?.(asset.id)}
                onMouseEnter={() => setHovered(asset.id)}
                onMouseLeave={() => setHovered((h) => (h === asset.id ? null : h))}
                className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors ${
                  selectedAssetId === asset.id
                    ? "border-brand-700 bg-brand-50 text-brand-900"
                    : "border-border text-body hover:border-brand-700"
                }`}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_FILL[asset.status] }}
                  aria-hidden="true"
                />
                {asset.assetType} {asset.tagCode}
              </button>
            </li>
          ))}
        </ul>
      )}

      {scan && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 rounded-md border border-border bg-bg px-3.5 py-3 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted">Provider</dt>
            <dd className="font-medium text-ink">{scan.provider}</dd>
          </div>
          <div>
            <dt className="text-muted">Captured</dt>
            <dd className="font-medium text-ink">{scan.capturedAt}</dd>
          </div>
          <div>
            <dt className="text-muted">Status</dt>
            <dd className="font-medium capitalize text-ink">{scan.status}</dd>
          </div>
          <div>
            <dt className="text-muted">Source</dt>
            <dd className="font-medium text-ink">{scan.sourceFiles}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
