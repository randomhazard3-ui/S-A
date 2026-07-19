"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, FileText, Radio, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import {
  notificationPreferences as initialPreferences,
  notifications as initialNotifications,
} from "@/lib/mock-data";
import type { NotificationChannel, NotificationItem } from "@/lib/types";

const TYPE_ICON: Record<NotificationItem["type"], typeof Bell> = {
  "work_order.created": Wrench,
  "work_order.status_changed": Wrench,
  "visit.completed": Wrench,
  "document.expiring": FileText,
  "ppm.overdue": ShieldCheck,
  "bms.alarm_received": Radio,
};

export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(initialPreferences);

  function toggleChannel(eventType: NotificationItem["type"], channel: NotificationChannel) {
    setPreferences((prev) =>
      prev.map((p) => (p.eventType === eventType ? { ...p, [channel]: !p[channel] } : p)),
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="Complete communication timeline plus channel preferences per event type (section 5.11). Sensitive technical detail never appears in an unencrypted email — every notification links back to the authenticated portal."
        actions={
          <button
            type="button"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
            className="rounded-md border border-border-strong px-3.5 py-2 text-sm font-medium text-body hover:bg-black/[.03]"
          >
            Mark all read
          </button>
        }
      />

      <Card title="Recent notifications">
        <ul className="divide-y divide-border">
          {items.map((notification) => {
            const Icon = TYPE_ICON[notification.type];
            return (
              <li key={notification.id}>
                <Link
                  href={notification.href ?? "#"}
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                    )
                  }
                  className="flex items-start gap-3 py-3.5 hover:bg-black/[.02]"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
                      )}
                    </div>
                    <p className="text-sm text-muted">{notification.body}</p>
                    <p className="mt-1 text-xs text-muted">
                      {new Date(notification.timestamp).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card
        title="Notification preferences"
        action={<span className="text-xs text-muted">Email · SMS · Teams</span>}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="pb-2 font-medium">Event</th>
                <th className="pb-2 pl-4 font-medium text-center">Email</th>
                <th className="pb-2 pl-4 font-medium text-center">SMS</th>
                <th className="pb-2 pl-4 font-medium text-center">Teams</th>
              </tr>
            </thead>
            <tbody>
              {preferences.map((pref) => (
                <tr key={pref.eventType} className="border-b border-border last:border-0">
                  <td className="py-2.5 text-body">{pref.label}</td>
                  {(["email", "sms", "teams"] as NotificationChannel[]).map((channel) => (
                    <td key={channel} className="py-2.5 pl-4 text-center">
                      <input
                        type="checkbox"
                        checked={pref[channel]}
                        onChange={() => toggleChannel(pref.eventType, channel)}
                        aria-label={`${pref.label} via ${channel}`}
                        className="h-4 w-4 accent-brand-700"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted">
          Suppression rules prevent excessive messages — SMS and Teams are
          reserved for higher-urgency events by default, per section 5.11.
        </p>
      </Card>
    </div>
  );
}
