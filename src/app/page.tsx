import Link from "next/link";
import {
  Building2,
  ClipboardCheck,
  ScanEye,
  Wrench,
  ArrowRight,
} from "lucide-react";

const PILLARS = [
  {
    icon: Building2,
    title: "One property record",
    description:
      "Every property becomes a structured digital profile: locations, assets, documents, drawings and compliance history in one place.",
  },
  {
    icon: ScanEye,
    title: "Select, click, report",
    description:
      "Select the property, click the asset, choose the fault. The portal supplies location, history and technical context automatically.",
  },
  {
    icon: Wrench,
    title: "Structured work orders",
    description:
      "Jobs carry SLA targets, the correct trade, linked technical documents and a full attendance-to-completion audit trail.",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance you can see",
    description:
      "Planned maintenance, statutory records and exceptions surface on one dashboard — before they become overdue.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-900 text-sm font-bold text-white">
              S&A
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">
                S&A Home and Property Services
              </p>
              <p className="text-[11px] text-muted">Property Intelligence Portal</p>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Client login
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800">
              Concept draft — internal preview
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              One operational record for every property, asset and maintenance job.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-body">
              A secure portal that gives owners, occupiers, facilities teams and
              contractors one shared source of truth — property intelligence,
              compliance records and digital twin context in a single, simple
              workflow.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Sign in to the portal
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-black/[.03]"
              >
                Preview the dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-brand-50/60">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-lg border border-border bg-surface p-5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-800 text-white">
                  <pillar.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-sm font-semibold text-ink">
                  {pillar.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted">
          Confidential — S&A Home and Property Services. Draft product scaffold,
          not for production use.
        </div>
      </footer>
    </div>
  );
}
