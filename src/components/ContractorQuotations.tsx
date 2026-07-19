"use client";

import Link from "next/link";
import { useState } from "react";
import type { Quotation } from "@/lib/types";

const STATUS_TONE: Record<Quotation["status"], string> = {
  requested: "border-blue-200 bg-blue-50 text-blue-700",
  submitted: "border-amber-200 bg-amber-50 text-amber-800",
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-red-200 bg-red-50 text-red-700",
};

export function ContractorQuotations({ quotations }: { quotations: Quotation[] }) {
  const [items, setItems] = useState(quotations);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function submitQuote(id: string) {
    const amount = Number(drafts[id]);
    if (!amount || amount <= 0) return;
    setItems((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, amount, status: "submitted", submittedAt: new Date().toISOString() }
          : q,
      ),
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((quote) => (
        <li key={quote.id} className="rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                href={`/jobs/${quote.workOrderId}`}
                className="font-medium text-ink hover:text-brand-800"
              >
                {quote.workOrderReference}
              </Link>
              <p className="text-sm text-muted">{quote.notes}</p>
              <p className="mt-1 text-xs text-muted">Version {quote.version}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_TONE[quote.status]}`}
              >
                {quote.status}
              </span>
              {quote.amount > 0 && (
                <span className="text-sm font-semibold text-ink">
                  £{quote.amount.toLocaleString("en-GB")}
                </span>
              )}
            </div>
          </div>

          {quote.status === "requested" && (
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <span className="text-xs text-muted">£</span>
              <input
                type="number"
                min={1}
                placeholder="Amount"
                value={drafts[quote.id] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [quote.id]: e.target.value }))}
                className="w-28 rounded-md border border-border-strong px-2 py-1.5 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
              />
              <button
                type="button"
                onClick={() => submitQuote(quote.id)}
                className="rounded-md bg-brand-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
              >
                Submit quotation
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
