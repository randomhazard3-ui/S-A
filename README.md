# S&A Property Intelligence Portal — Draft Scaffold

This is a **draft, frontend-only scaffold** for the S&A Property Intelligence
Portal, built from `S&A Property Intelligence Portal — Developer Product
Requirements & Technical Specification` (v1.0, 19 July 2026). It exists to
give the team something clickable to react to before formal discovery —
it is explicitly **not** the end-state platform the spec describes, in
keeping with that document's own instruction: *"It is not permission to
code the entire end-state platform immediately."*

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS**, matching the
spec's recommended front-end approach (section 8.1). All data is in-memory
mock data in `src/lib/mock-data.ts` — there is no backend, database, auth,
or API behind this yet.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The root page is a lightweight gateway (see
section 3.1 — marketing stays separate from the operational app); `/login`
is a non-functional mock sign-in that drops you straight into `/dashboard`.

## What's implemented

Navigation and page structure follow section 3.2 and the wireframes in
section 6:

| Route | Spec reference | Notes |
|---|---|---|
| `/dashboard` | 5.2, Figure 3 | Stat cards, properties table, recent activity/jobs |
| `/properties`, `/properties/[id]` | 5.3 | Property profile with all 10 tabs: Overview, Locations, Assets, Jobs, Documents, Isolations, 3D/Floor Plan, PPM/Compliance, Contacts, Audit |
| `/properties/[id]/raise-job` | 5.5, Figure 4 | Select-asset → choose-fault → submit flow, with fault menus driven by asset type |
| `/jobs`, `/jobs/[id]` | 5.6 | Full 13-state work-order lifecycle, SLA target, timeline, evidence panel |
| `/assets`, `/assets/[id]` | 5.4 | Portal-owned asset register with Identity/Location/Technical/Lifecycle/Maintenance/Records field groups |
| `/compliance` | 5.10 | PPM tasks grouped by overdue/due-soon/scheduled |
| `/documents` | 5.7 | Category, version/revision, visibility classification |
| `/reports` | 5.12 | Illustrative aggregates computed from the mock dataset |
| `/admin` | 5.13, 2.1–2.2 | Users & roles, fault taxonomy, feature flags, tenant settings |

Design tokens (brand color, status colors, type scale) live in
`src/app/globals.css`. Shared UI is in `src/components/`; domain types
mirror the core entity model in section 7 and live in `src/lib/types.ts`.

## What's deliberately out of scope here

Per section 1.4 and the document's own caution against building the whole
platform up front, this draft does **not** include:

- A real backend, database, or API (section 11) — everything is static mock data.
- Authentication, RBAC enforcement, or multi-tenant data isolation (section 2, 12).
- A real 3D/digital-twin viewer integration (section 9) — the raise-job and
  property-profile screens show a labelled placeholder for where a
  Matterport/Polycam/Three.js embed would go.
- BMS/IoT integration (section 10).
- Notifications, billing/subscription, or export (5.11, 5.13, 5.12).

These are exactly the areas the spec says should go through discovery,
technical design and itemised quotation before being built.

## Suggested next steps

1. Discovery workshops to validate the flows against real users.
2. Turn this into a tested component library / interactive prototype (the
   spec explicitly calls for this before production development).
3. Stand up the real backend (section 8) and swap `src/lib/mock-data.ts`
   for real API calls behind the same component boundaries.
