"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    // Draft scaffold only — no authentication backend wired up yet.
    // See section 5.1 of the developer specification for the real flow
    // (email/password + mandatory verification, MFA, invitation-based onboarding).
    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-900 text-sm font-bold text-white">
            S&A
          </div>
          <h1 className="mt-4 text-lg font-semibold text-ink">
            Sign in to the portal
          </h1>
          <p className="mt-1 text-sm text-muted">
            S&A Property Intelligence Portal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-border bg-surface p-6 space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-ink"
            >
              Work email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.co.uk"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-ink"
              >
                Password
              </label>
              <span className="text-xs text-muted">Forgot password?</span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••"
              className="mt-1.5 w-full rounded-md border border-border-strong px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center rounded-md bg-brand-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex items-start gap-2 rounded-md bg-brand-50 px-3 py-2.5 text-xs text-brand-800">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              Multi-factor authentication will be required for this
              organisation once identity is configured (section 5.1).
            </span>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Invitation-only access.{" "}
          <Link href="/" className="font-medium text-brand-800">
            Back to overview
          </Link>
        </p>
      </div>
    </div>
  );
}
