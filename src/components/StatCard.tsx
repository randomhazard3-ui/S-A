import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  href,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "neutral" | "warn";
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${
          tone === "warn" ? "bg-red-50 text-status-warn" : "bg-brand-50 text-brand-700"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-semibold leading-none text-ink">{value}</p>
        <p className="mt-1.5 text-xs text-muted">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
