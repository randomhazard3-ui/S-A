"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import type { PortalDocument } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { ExportButton } from "@/components/ExportButton";

const STATUS_TONE: Record<PortalDocument["status"], string> = {
  current: "border-emerald-200 bg-emerald-50 text-emerald-700",
  superseded: "border-border-strong bg-black/[.04] text-body",
  unverified: "border-red-200 bg-red-50 text-red-700",
};

export function DocumentsTable({
  documents,
  propertyNameById,
}: {
  documents: PortalDocument[];
  propertyNameById: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(documents.map((d) => d.category))).sort(),
    [documents],
  );

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = category === "all" || doc.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        doc.title.toLowerCase().includes(q) ||
        (propertyNameById[doc.propertyId] ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [documents, query, category, propertyNameById]);

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
            placeholder="Search documents or properties…"
            className="w-full rounded-md border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ExportButton
          filename="documents.csv"
          rows={filtered.map((d) => ({
            title: d.title,
            property: propertyNameById[d.propertyId] ?? "",
            category: d.category,
            version: d.version,
            revisionDate: d.revisionDate,
            reviewDate: d.reviewDate ?? "",
            visibility: d.visibility,
            status: d.status,
            fileType: d.fileType,
          }))}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No documents match your filters" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg text-left text-xs text-muted">
                <th className="px-4 py-2.5 font-medium">Title</th>
                <th className="px-4 py-2.5 font-medium">Property</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Revision</th>
                <th className="px-4 py-2.5 font-medium">Visibility</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{doc.title}</p>
                    <p className="text-xs text-muted">{doc.fileType}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/properties/${doc.propertyId}`}
                      className="text-body hover:text-brand-800"
                    >
                      {propertyNameById[doc.propertyId] ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-body">{doc.category}</td>
                  <td className="px-4 py-3 text-muted">
                    v{doc.version} · {doc.revisionDate}
                  </td>
                  <td className="px-4 py-3 text-muted capitalize">{doc.visibility}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_TONE[doc.status]}`}
                    >
                      {doc.status}
                    </span>
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
