import Link from "next/link";
import { AlertTriangle, Radio } from "lucide-react";
import { Sparkline } from "@/components/Sparkline";
import type { Alarm, TelemetryPoint } from "@/lib/types";

const FRESHNESS_LABEL: Record<TelemetryPoint["freshness"], string> = {
  live: "Live",
  delayed: "Delayed",
  stale: "Stale",
};

const FRESHNESS_TONE: Record<TelemetryPoint["freshness"], string> = {
  live: "text-emerald-700 bg-emerald-50 border-emerald-200",
  delayed: "text-amber-800 bg-amber-50 border-amber-200",
  stale: "text-red-700 bg-red-50 border-red-200",
};

export function BmsAssetPanel({
  telemetry,
  alarms,
  propertyId,
}: {
  telemetry: TelemetryPoint[];
  alarms: Alarm[];
  propertyId: string;
}) {
  if (telemetry.length === 0 && alarms.length === 0) return null;

  const activeAlarms = alarms.filter((a) => a.status === "active");

  return (
    <div className="space-y-3">
      {activeAlarms.map((alarm) => (
        <div
          key={alarm.id}
          className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            <div>
              <p className="font-medium text-red-900">{alarm.message}</p>
              <p className="text-xs text-red-700">
                {alarm.source} · raised {new Date(alarm.raisedAt).toLocaleString("en-GB")}
              </p>
            </div>
          </div>
          <Link
            href={`/properties/${propertyId}/raise-job`}
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-red-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-800"
          >
            Convert to work order
          </Link>
        </div>
      ))}

      {telemetry.length > 0 && (
        <ul className="divide-y divide-border rounded-md border border-border">
          {telemetry.map((point) => {
            const latest = point.readings[point.readings.length - 1];
            return (
              <li key={point.id} className="flex items-center justify-between gap-4 px-3.5 py-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <Radio className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                    {point.label}
                  </p>
                  <p className="text-xs text-muted">
                    {point.source} ·{" "}
                    <span
                      className={`inline-flex rounded-full border px-1.5 py-0.5 text-[10px] font-medium ${FRESHNESS_TONE[point.freshness]}`}
                    >
                      {FRESHNESS_LABEL[point.freshness]}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Sparkline values={point.readings.map((r) => r.v)} />
                  <p className="w-16 shrink-0 text-right text-sm font-semibold text-ink">
                    {latest.v}
                    <span className="ml-0.5 text-xs font-normal text-muted">{point.unit}</span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
