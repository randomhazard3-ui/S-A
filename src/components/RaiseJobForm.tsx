"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Camera, MapPin } from "lucide-react";
import type { Asset, WorkOrderPriority } from "@/lib/types";
import { ASSET_FAULT_MENU } from "@/lib/types";

const PRIORITIES: WorkOrderPriority[] = ["LOW", "NORMAL", "URGENT", "CRITICAL"];

export function RaiseJobForm({
  propertyName,
  assets,
}: {
  propertyName: string;
  assets: Asset[];
}) {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(
    assets[0]?.id ?? null,
  );
  const [faultCode, setFaultCode] = useState<string>("");
  const [priority, setPriority] = useState<WorkOrderPriority>("NORMAL");
  const [description, setDescription] = useState("");
  const [submittedReference, setSubmittedReference] = useState<string | null>(null);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? null;
  const faultOptions = useMemo(
    () => (selectedAsset ? ASSET_FAULT_MENU[selectedAsset.assetType] ?? [] : []),
    [selectedAsset],
  );

  function selectAsset(assetId: string) {
    setSelectedAssetId(assetId);
    setFaultCode("");
  }

  function handleFaultChange(code: string) {
    setFaultCode(code);
    const option = faultOptions.find((f) => f.code === code);
    if (option) setPriority(option.suggestedPriority);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedReference(`SA-${Math.floor(1000 + Math.random() * 9000)}`);
  }

  if (submittedReference && selectedAsset) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
        <p className="text-base font-semibold text-emerald-900">
          Work order {submittedReference} created
        </p>
        <p className="max-w-sm text-sm text-emerald-800">
          {propertyName} · {selectedAsset.locationLabel} ·{" "}
          {faultOptions.find((f) => f.code === faultCode)?.label ?? "Fault"}
        </p>
        <p className="text-xs text-emerald-700">
          The maintenance team now has the property, room, asset ID, history
          and linked technical records for this job.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-bg p-4">
        <p className="mb-3 text-sm font-semibold text-ink">
          Interactive 3D / floor-plan viewer
        </p>
        <div className="flex flex-col gap-2 rounded-md border border-dashed border-border-strong bg-surface p-4">
          <p className="text-xs text-muted">
            Draft placeholder — production build embeds the property&apos;s 3D
            scan or floor plan with clickable asset hotspots (section 9).
            Select an asset below to simulate clicking a hotspot.
          </p>
          <ul className="mt-2 space-y-1.5">
            {assets.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  onClick={() => selectAsset(asset.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    asset.id === selectedAssetId
                      ? "border-brand-700 bg-brand-50 text-brand-900"
                      : "border-border text-body hover:border-border-strong"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                    {asset.assetType} {asset.tagCode}
                  </span>
                  <span className="text-xs text-muted">{asset.locationLabel}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-md border border-border bg-bg px-3.5 py-3">
          <p className="text-xs uppercase tracking-wide text-muted">
            Selected asset
          </p>
          <p className="text-sm font-semibold text-ink">
            {selectedAsset
              ? `${selectedAsset.assetType} ${selectedAsset.tagCode}`
              : "No asset selected"}
          </p>
          {selectedAsset && (
            <p className="text-xs text-muted">{selectedAsset.locationLabel}</p>
          )}
        </div>

        <div>
          <label htmlFor="fault" className="block text-sm font-medium text-ink">
            Issue type
          </label>
          <select
            id="fault"
            required
            value={faultCode}
            onChange={(e) => handleFaultChange(e.target.value)}
            disabled={!selectedAsset}
            className="mt-1.5 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20 disabled:opacity-50"
          >
            <option value="" disabled>
              Select the fault…
            </option>
            {faultOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-ink">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
            className="mt-1.5 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0) + p.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted">
            Suggested from the selected fault; can be overridden by authorised users.
          </p>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-ink">
            Location
          </label>
          <input
            id="location"
            readOnly
            value={selectedAsset?.locationLabel ?? ""}
            className="mt-1.5 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-muted"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes — what did you observe, when did it start?"
            className="mt-1.5 w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-md border border-dashed border-border-strong px-3 py-2 text-sm text-muted"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Add photo or video
        </button>

        <button
          type="submit"
          disabled={!selectedAsset || !faultCode}
          className="w-full rounded-md bg-brand-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          Submit job
        </button>
      </form>
    </div>
  );
}
