import Link from "next/link";
import { AlertTriangle, Radio, ShieldAlert, Wifi } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { Sparkline } from "@/components/Sparkline";
import { alarms, telemetryPoints } from "@/lib/mock-data";
import type { AlarmSeverity } from "@/lib/types";

const SEVERITY_TONE: Record<AlarmSeverity, string> = {
  critical: "border-red-200 bg-red-50 text-red-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export default function BmsPage() {
  const activeAlarms = alarms.filter((a) => a.status === "active");
  const criticalAlarms = alarms.filter((a) => a.severity === "critical");
  const liveCount = telemetryPoints.filter((t) => t.freshness === "live").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="BMS / Telemetry"
        description="Read-only building management data — status, alarms and trends. The browser never connects directly to a BMS or control network (section 10)."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active alarms" value={activeAlarms.length} icon={AlertTriangle} tone={activeAlarms.length > 0 ? "warn" : "neutral"} />
        <StatCard label="Critical (all-time)" value={criticalAlarms.length} icon={ShieldAlert} />
        <StatCard label="Live telemetry points" value={liveCount} icon={Wifi} />
        <StatCard label="Connected points" value={telemetryPoints.length} icon={Radio} />
      </div>

      <Card title="Alarms">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-2 pr-4 font-medium">Asset</th>
                <th className="pb-2 pr-4 font-medium">Property</th>
                <th className="pb-2 pr-4 font-medium">Message</th>
                <th className="pb-2 pr-4 font-medium">Source</th>
                <th className="pb-2 pr-4 font-medium">Raised</th>
                <th className="pb-2 pr-4 font-medium">Severity</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => (
                <tr key={alarm.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 pr-4">
                    <Link
                      href={`/assets/${alarm.assetId}`}
                      className="font-medium text-ink hover:text-brand-800"
                    >
                      {alarm.assetLabel}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Link
                      href={`/properties/${alarm.propertyId}`}
                      className="text-body hover:text-brand-800"
                    >
                      {alarm.propertyName}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-4 text-body">{alarm.message}</td>
                  <td className="py-2.5 pr-4 text-muted">{alarm.source}</td>
                  <td className="py-2.5 pr-4 text-muted">
                    {new Date(alarm.raisedAt).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2.5 pr-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${SEVERITY_TONE[alarm.severity]}`}
                    >
                      {alarm.severity}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted capitalize">
                    {alarm.status === "converted" ? (
                      <span className="text-brand-800">Converted to work order</span>
                    ) : (
                      alarm.status
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Telemetry trends">
        <ul className="divide-y divide-border">
          {telemetryPoints.map((point) => {
            const latest = point.readings[point.readings.length - 1];
            return (
              <li key={point.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <Link
                    href={`/assets/${point.assetId}`}
                    className="text-sm font-medium text-ink hover:text-brand-800"
                  >
                    {point.label}
                  </Link>
                  <p className="text-xs text-muted">
                    {point.source} · updated{" "}
                    {new Date(point.lastUpdated).toLocaleString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
      </Card>

      <Card title="Integration pattern">
        <p className="text-sm text-muted">
          A site BMS or approved cloud BMS exposes data through a vendor API,
          BACnet gateway, Niagara supervisor, MQTT broker or other approved
          connector. A secured edge or cloud integration service normalises
          selected points and sends only required data to the portal
          integration API — telemetry is mapped to portal-owned asset IDs via
          a controlled mapping table and stored separately from core
          transactional data (section 10.2).
        </p>
      </Card>
    </div>
  );
}
