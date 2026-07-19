"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";

const PROPERTY_TYPES = ["Office", "Retail", "Industrial", "Residential", "Mixed use"];

export default function AddPropertyPage() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [name, setName] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(name);
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <PageHeader title="Add property" />
        <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-14 text-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
          <p className="text-base font-semibold text-emerald-900">
            {submitted} added to onboarding
          </p>
          <p className="max-w-sm text-sm text-emerald-800">
            The property is created with status &quot;Onboarding&quot; — locations,
            assets, documents and users can now be added before it goes live.
          </p>
          <Link
            href="/properties"
            className="mt-1 rounded-md bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Back to properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add property"
        description="Create the top-level property record. Locations, assets and documents are added from the property profile once it exists."
      />
      <Card>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Property name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Office - Canary Wharf"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-ink">
              Address
            </label>
            <input
              id="address"
              required
              placeholder="Street address"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-ink">
              Town / city
            </label>
            <input
              id="town"
              required
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-ink">
              Postcode
            </label>
            <input
              id="postcode"
              required
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-ink">
              Property type
            </label>
            <select
              id="type"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-ink">
              Responsible manager
            </label>
            <input
              id="manager"
              placeholder="Assign later if unknown"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-brand-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Create property
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
