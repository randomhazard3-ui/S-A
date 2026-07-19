# S&A Property Intelligence Portal — Draft Build

This is a **frontend draft** of the S&A Property Intelligence Portal, built
from `S&A Property Intelligence Portal — Developer Product Requirements &
Technical Specification` (v1.0, 19 July 2026). It implements every
functional module in the spec end to end with realistic mock data, so the
team has a complete, clickable system to react to before formal discovery —
it is still not a production platform: there is no real backend, database,
authentication, or third-party integration behind it (see "What's mocked"
below).

Stack: **Next.js (App Router) + TypeScript + Tailwind CSS**, matching the
spec's recommended front-end approach (section 8.1). All data is in-memory
mock data in `src/lib/mock-data.ts`.

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The root page is a lightweight gateway (see
section 3.1 — marketing stays separate from the operational app); `/login`
is a mock sign-in that drops you into `/dashboard`.

## Try the role switcher

The topbar has a **"View as"** control that swaps the whole app between the
four RBAC personas from section 2: Customer Portfolio Administrator, S&A
Engineer, Contractor Admin and Read-only Auditor. Navigation, the raise-job
action and the contractor workspace all respond to it. This is a client-side
preview only — real per-request authorisation is a server-side concern
(section 2.2), not something a static frontend can enforce.

## What's implemented

| Route | Spec reference | Notes |
|---|---|---|
| `/dashboard` | 5.2, Figure 3 | Stat cards, properties table, recent activity, role-sensitive quick actions (Raise job / Add property / Invite user / Export) |
| `/properties`, `/properties/[id]` | 5.3 | Property profile with all 10 tabs: Overview, Locations, Assets, Jobs, Documents, Isolations, 3D/Floor Plan, PPM/Compliance, Contacts, Audit |
| `/properties/new` | 5.2 | Add-property onboarding form |
| `/properties/[id]/raise-job` | 5.5, Figure 4 | Select-asset → choose-fault → submit flow, asset selection via the interactive floor-plan viewer |
| `/jobs`, `/jobs/[id]` | 5.6 | Full 13-state work-order lifecycle, SLA target, timeline, evidence panel, CSV export |
| `/assets`, `/assets/[id]` | 5.4, 5.9 | Portal-owned asset register; asset detail shows live BMS telemetry/alarms where connected |
| `/compliance` | 5.10 | PPM tasks grouped by overdue/due-soon/scheduled |
| `/documents` | 5.7 | Category, version/revision, visibility classification, CSV export |
| `/bms` | 9, 10 | Portfolio-wide read-only BMS/IoT: alarms, telemetry trend sparklines, integration pattern reference |
| `/notifications` | 5.11 | Notification timeline + per-event channel preferences (email/SMS/Teams) |
| `/contractor`, `/company`, `/quotations`, `/performance` | 5.9 | Contractor workspace: job accept/decline, company profile & compliance docs, versioned quotations, performance stats |
| `/reports` | 5.12 | Aggregates computed from the mock dataset, CSV export |
| `/admin` | 5.13, 2, 11, 12 | Users & roles (with invite flow), taxonomies, feature flags, Integrations & API reference, Security baseline, Billing, portfolio Audit log, tenant settings |

The interactive floor-plan/3D viewer (`FloorPlanViewer`) is reused on both
the property profile's "3D / Floor Plan" tab and the raise-job screen; asset
hotspot positions come from a portal-owned `anchor` field per section 9's
architectural principle — the viewer never owns asset data, only a visual
position. Scan provider/version metadata (`ScanInfo`) follows section 9.4.

Design tokens (brand color, status colors, type scale) live in
`src/app/globals.css`. Shared UI is in `src/components/`; domain types
mirror the core entity model in section 7, plus section 9/10/5.9/5.11
additions, in `src/lib/types.ts`.

## What's mocked vs. real

Genuinely functional, client-side, against the mock dataset:
- Role-based navigation switching (topbar "View as").
- Job raising, contractor accept/decline, quotation submission, user
  invitation, property creation — all update local component state.
- CSV export (Jobs, Assets, Documents, Reports, Audit log, Portfolio
  summary) via `src/lib/csv.ts` — a real file download, not a stub.
- Notification read/unread state and channel preference toggles.

Necessarily illustrative, because there is no backend:
- **3D/digital-twin viewer** (section 9): the floor-plan component is a
  hand-built SVG standing in for a real Matterport/Polycam/Three.js embed —
  the data model and hotspot/anchor pattern are real, the rendering isn't.
- **BMS/IoT telemetry** (section 10): sparkline trends and alarms are
  synthetic; the integration pattern described (edge/cloud normalisation
  layer, portal never talks to the BMS directly) is documented but not built.
- **Auth, RBAC enforcement, multi-tenant isolation** (sections 2, 12): the
  role switcher previews UI differences only; nothing is actually gated
  server-side because there is no server.
- **APIs, webhooks, notifications delivery** (section 11, 5.11): the
  endpoint catalogue and domain events are presented as a reference in
  Admin → Integrations & API; nothing calls a real API.
- **Billing/subscription** (5.13): plan/seats/invoice figures are static.

## Suggested next steps

1. Discovery workshops to validate the flows against real users — this
   draft is deliberately opinionated about layout and copy so there's
   something concrete to react to.
2. Turn this into a tested component library / interactive prototype (the
   spec explicitly calls for this before production development).
3. Stand up the real backend (section 8) and swap `src/lib/mock-data.ts`
   for real API calls behind the same component boundaries — most pages
   already separate data-fetching from presentation cleanly enough to do
   this incrementally, route by route.
4. Replace the placeholder floor-plan viewer with a real 3D provider SDK
   once one is selected at discovery (section 9.2).
