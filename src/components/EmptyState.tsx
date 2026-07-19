import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
      <Icon className="h-6 w-6 text-muted" aria-hidden="true" />
      <p className="text-sm font-medium text-body">{title}</p>
      {description && <p className="text-xs text-muted max-w-sm">{description}</p>}
    </div>
  );
}
