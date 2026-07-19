"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { notifications as initialNotifications } from "@/lib/mock-data";

function timeAgo(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const hours = Math.round(diffMs / (60 * 60 * 1000));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);
  const unreadCount = items.filter((n) => !n.read).length;

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border text-body hover:bg-black/[.03]"
      >
        <Bell className="h-4 w-4" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-warn text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-40 mt-2 w-80 rounded-md border border-border bg-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <p className="text-sm font-semibold text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-xs font-medium text-brand-800 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.slice(0, 6).map((notification) => (
              <li key={notification.id} className="border-b border-border last:border-0">
                <Link
                  href={notification.href ?? "/notifications"}
                  onClick={() =>
                    setItems((prev) =>
                      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
                    )
                  }
                  className="flex gap-2 px-4 py-3 hover:bg-black/[.02]"
                >
                  <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      notification.read ? "bg-transparent" : "bg-brand-700"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{notification.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{notification.body}</p>
                    <p className="mt-1 text-[11px] text-muted">
                      {timeAgo(notification.timestamp)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-center text-xs font-medium text-brand-800 hover:underline"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
