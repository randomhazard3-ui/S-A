"use client";

import { useState } from "react";

interface FeatureModule {
  name: string;
  plan: string;
  enabled: boolean;
}

export function FeatureFlagsList({ modules }: { modules: FeatureModule[] }) {
  const [items, setItems] = useState(modules);

  return (
    <ul className="divide-y divide-border">
      {items.map((mod) => (
        <li key={mod.name} className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-ink">{mod.name}</p>
            <p className="text-xs text-muted">{mod.plan}</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setItems((prev) =>
                prev.map((m) => (m.name === mod.name ? { ...m, enabled: !m.enabled } : m)),
              )
            }
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${
              mod.enabled
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-border-strong bg-black/[.04] text-body"
            }`}
          >
            {mod.enabled ? "Enabled" : "Not enabled"}
          </button>
        </li>
      ))}
    </ul>
  );
}
