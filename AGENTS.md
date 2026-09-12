# PCIU Frontend

Public website, admin dashboard, and teacher self-service portal for Port City International University (PCIU), rebuilt from an older Vite + Supabase project (`PCIUWeb`, a sibling directory) as a Next.js 16 site. **There is no Supabase and no database client in this repo** — but there IS a live backend: a separate-origin REST API (`NEXT_PUBLIC_BACKEND_BASE_URL`, see `config/env.config.ts`) that the admin dashboard's connected entities and the `/faculty-portal/*` self-service pages both read and write through. Auth is cookie-based (`better-auth.session_token`, mirrored onto this app's own domain by `app/(auth)/actions.ts` — see "Auth & route protection" below), not a third-party auth SDK. Public-site content still lives in JSON files under `content/`.

## Stack

- **Next.js 16.3.0**, App Router, React 19.2.8, TypeScript, Turbopack
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.*` file. Theme tokens live in `app/globals.css` (`:root`, `.dark`, `@theme inline`)
- **shadcn "base-nova" style on `@base-ui/react`** — **not Radix**. Every `components/ui/*` primitive wraps a `@base-ui/react/*` module. When you need a primitive that doesn't exist yet, check `node_modules/@base-ui/react/` first — most things (dialog, alert-dialog, select, tabs, accordion, collapsible, tooltip, switch, checkbox, radio-group, toast, number-field, field, form) are already installed and just need a styled wrapper
- **react-hook-form + zod v4 + @hookform/resolvers** — used in the admin forms only (see below). RHF owns validation state there; base-ui's own `Form`/`Field.Root` validation is deliberately *not* used in the same form to avoid two systems double-reporting errors
- **TanStack Query v5** for client-side cache/mutation state on the admin dashboard and the faculty portal — mounted by `components/providers/QueryProvider.tsx`, which those two route groups' layouts wrap themselves in (the public site stays static and never mounts it)
- No CMS, no third-party auth SDK — auth is a session cookie mirrored server-side (see below)

### ⚠️ Next.js 16 breaking changes (read before assuming Next 15/14 behavior)

This project's own `node_modules/next/dist/docs/` is the ground truth — check it before writing App Router code that looks unfamiliar. Confirmed differences that have bitten this codebase already:

- `images.qualities` is **required** in `next.config.ts` (currently `[75]`) — omitting it fails the build
- `priority` on `next/image` is deprecated → use `preload`, or `loading="eager"` + `fetchPriority="high"` when multiple images on one page could be the LCP candidate (e.g. a carousel)
- `images.domains` is deprecated → use `remotePatterns`
- Dynamic route `params` and `searchParams` are **Promises** — `await` them in Server Components
- An empty (0-byte) `page.tsx` hard-fails the build with "not a module" — never leave a route file empty between edits

## Structure

```
app/
  layout.tsx                 Root layout: Inter + Poppins fonts, metadata
  globals.css                 All design tokens, gradients, keyframes, @utility rules
  (landing)/                  Route group: public site, wraps children in Navbar + Footer
    layout.tsx
    page.tsx                  Homepage — composes _ui/ sections
    _ui/                      Homepage-only sections (HeroSection, NoticeMarquee, ...)
    <route>/                  One folder per public page (about-the-university, admission, ...)
      page.tsx
      _ui/                    Route-local client components (colocated, not shared)
  (auth)/                     Route group: signin (real, wired to loginAction), signup/forgot/reset password — visual only
    actions.ts                "use server": loginAction, logoutAction, getSession
  (admin)/                    Route group: admin dashboard, gated by requireRole("admin"), wraps children in AdminShell
    layout.tsx
    entity-actions.ts         "use server": listEntityAction/createEntityAction/... — see Admin dashboard below
    admin/
      page.tsx                 Dashboard overview
      pages/ faculty/ settings/ _ui/...
      <group>/<entity>/new/    49 generated "Add" form routes — see Admin dashboard below
  (faculty)/                  Route group: teacher self-service portal, gated by requireRole("teacher") — see Faculty portal below
    layout.tsx
    profile-actions.ts         "use server": getMyProfileAction, listSectionAction, ...
    profile-mapping.ts         Portal UI shape ↔ API shape bridge
    faculty-portal/            page.tsx + profile/education/publications/experience/awards/memberships
components/
  ui/                         shadcn-on-base-ui primitives (button, card, input, select, dialog analog "Modal", ...)
  shared/                     Cross-route components used by the public site (Navbar, footer, Breadcrumb, PageBanner, DataTable, Modal, Aleart, EmptyState, ...)
  admin/                      Admin-only shell (AdminShell, AdminSidebar, AdminHeader, nav-groups.ts) and the form/ engine
    form/                     EntityForm, FormField, FieldArray, EntityFormClient, form-types.ts
  faculty/                    Faculty portal + admin per-teacher preview workspace components — see Faculty portal below
    section-list/              SectionListView (shared table/modal/dialog), LiveSectionList, DemoSectionList
  providers/                  QueryProvider (mounted by the admin and faculty layouts only)
content/                      One JSON file per public page/section — static data source for pages with no live entity
types/                        One .ts file per content domain, matching each content/ JSON file's shape
services/                     API transport shared by the admin dashboard: http.ts (api/ApiError/envelope), endpoints.ts
                               (ENTITY_ENDPOINTS registry), entity.ts (CRUD + snake/camel mapping), case.ts,
                               form-data.ts, field-aliases.ts, teacher-profile.ts (the faculty portal's own transport)
features/
  entity/                     TanStack Query hooks for the admin dashboard (keys/queries/mutations/relation-options)
  teacher-profile/            TanStack Query hooks for the faculty portal, same shape as features/entity/
lib/
  icons.ts                    String-key → lucide-react component registry, for icon names stored in JSON
  utils.ts                    cn() helper
  cookie.ts                   Session cookie read/write/clear
  server-fetch.ts             serverFetch (authenticated) / publicFetch (unauthenticated) — see Auth below
  auth-guards.ts              requireRole("admin" | "teacher") — the authoritative route gate
  admin/entities/             One schema file per DB table from the reference DBML — see Admin dashboard below
config/
  env.config.ts                Reads NEXT_PUBLIC_BACKEND_BASE_URL and any other env vars
public/images/                All static image assets (local files + a few portcity.edu.bd remote patterns)
```

## Conventions

- **Page pattern**: every route is a thin server `page.tsx` (exports `metadata`, composes section components) plus a colocated `_ui/` folder for that route's own client components. Don't put route-specific components in `components/shared/` — promote to `shared/` only when a second route actually needs it.
- **Content is JSON, not hardcoded JSX**. Public pages import from `content/<page>/*.json`, cast to a type from `types/<page>.ts`, e.g. `import raw from "@/content/library/page.json"; const data = raw as LibraryPageContent;`. `resolveJsonModule` is enabled in `tsconfig.json`.
- **Icons in JSON go through `lib/icons.ts`**, never a direct component reference (JSON can't serialize a component). JSON stores a string key (`"icon": "graduation-cap"`), the registry resolves it: `const Icon = iconMap[item.icon]`. `IconName` is a strict union via `as const satisfies Record<string, LucideIcon>`, so a typo in JSON fails typecheck. **Verify a lucide icon name actually exists in this installed version before using it** — several expected names are missing in the pinned `lucide-react` (no `Home` → use `House`; no `Filter` → use `ListFilter`; no `FileSignature` → use `Scale` or `FileText`; no `HelpCircle` → use `MessageCircleQuestionMark`). Check with a quick grep on `node_modules/lucide-react/dist/lucide-react.d.ts` rather than assuming.
- **Server vs Client components**: default to server; add `"use client"` only where actual state/interactivity lives (search/filter, tabs with client state, `useSearchParams`-driven UI). `?section=` deep-linked pages (`/academics`, `/admission`, `/research`) read `searchParams` server-side and pass the active section down — no client JS needed just to switch sections.
- **The base-ui `Button` is not the Radix pattern.** No `asChild`. Use `render={<Link href="..." />}` instead, and pass `nativeButton={false}` when the rendered element is an anchor, not a native button. Children go on `<Button>`, never inside the `render` element — that's the most common way to silently drop children.
- **Brand-specific button styling is a `variant`, not a `className` override.** `components/ui/button.tsx` has PCIU-specific cva variants (`highlight`, `accent`, `outlineAccent`, `outlineSecondary`, `outlineMuted`, `ghostAccent`) and a `cta` size (`h-11`, for marketing CTAs — the stock `lg` is only `h-9`). Reach for these before writing ad-hoc `className="bg-accent ..."`.
- **Design tokens must be added to `@theme inline` to become Tailwind utility classes.** A CSS variable defined only in `:root`/`.dark` produces no `bg-*`/`text-*` class — this has silently broken things twice already (gradients, then the admin sidebar tokens). If you add a new `--foo` token, add `--color-foo: var(--foo);` to the `@theme inline` block in the same change.

## Admin dashboard (`app/(admin)/admin/`)

Forms validate fully with zod, then save through the live API for any entity registered in `services/endpoints.ts` (`isConnected(slug)`) — see `app/(admin)/entity-actions.ts`, `services/entity.ts`, and `features/entity/`. Every entity schema in `lib/admin/entities/` renders its full form regardless, but one with a schema and no `ENTITY_ENDPOINTS` entry fails on save with an explicit "not connected to the backend yet" error toast (`components/ui/toast.tsx`, base-ui `Toast` + `useToastManager`) rather than persisting or faking success — `guard(slug)` in `entity-actions.ts` is what produces that message. Don't add Supabase or any other database client; the API is a separate origin reached through `services/http.ts`.

- **Shell**: `AdminShell` (client, owns `collapsed`/`mobileOpen` state) renders `AdminSidebar` + `AdminHeader` + page content. `AdminSidebar` is a charcoal `--sidebar` themed rail (independent token family from the public site's `--primary`, defined in `globals.css`) with 4 top-level items (Dashboard, Faculty Directory, Pages, Settings) plus 9 collapsible entity groups.
- **The sidebar groups are generated, not hand-maintained.** `components/admin/nav-groups.ts` builds `NAV_GROUPS` directly from `lib/admin/entities/index.ts`'s `ENTITY_REGISTRY` and `ENTITY_GROUP_ORDER`. Adding a new entity to the registry automatically adds its sidebar link — don't hand-edit nav items to add a route.
- **`AdminHeader`'s page title also derives from the entity registry** for `/admin/<group>/<slug>/new` routes (regex-matched, looked up in `ENTITY_REGISTRY`). Only the 4 top-level pages need a manual entry in `PAGE_TITLES`.
- **The 49 entity schemas** in `lib/admin/entities/` map every table in the project's reference DBML schema (departments, teachers, scheduling, content, research, the PCJ journal, admission, IQAC, system settings). Each is a small `EntitySchema` object: field descriptors + a zod schema + default values — see `components/admin/form/form-types.ts` for the shape. **This is the pattern to follow for any new entity**: add one file to `lib/admin/entities/`, register it in `index.ts`'s `ENTITY_REGISTRY`, scaffold `app/(admin)/admin/<group>/<slug>/new/page.tsx` (10 lines — see any existing one for the exact shape), and both the sidebar and header title update automatically.
- **Server/client boundary**: entity `page.tsx` files are server components and must pass only the slug **string** to `EntityFormClient` (a client component) — never the `EntitySchema` object itself. A zod schema and a `LucideIcon` component can't cross from a server component into a client one as props; this broke the build once already. `EntityFormClient` looks the schema up client-side via `getEntitySchema(slug)`.
- **`FormField`** (`components/admin/form/FormField.tsx`) is the single field renderer — it switches on the descriptor's `type` and wires base-ui's controlled components (`Select`, `Switch`, `Checkbox`, `RadioGroup`) through RHF's `Controller`, since they aren't native `<input>` elements `register()` can bind to directly. Native-input types (`text`, `email`, `number`, `date`, `textarea`, ...) use plain `register()`.
- **`json`-typed DB columns become `json-list` fields** — repeatable string rows via RHF's `useFieldArray`, rendered by `FieldArray.tsx`. Use this for any array-of-strings column (`teaching_areas`, `quick_link`, `objectives`, `tags`, `multiple_image`).
- **`relation` fields (FK columns) render as a `select`.** `features/entity/relation-options.ts`'s `useRelationOptions` fetches live rows from `relationTo` when that slug is connected, and falls back to the schema's hand-authored placeholder `options` otherwise — keep those placeholders clearly labelled rather than empty, so the form still reads as complete for an entity whose FK target isn't wired up yet.
- **Reusable components predate the entity-form engine and follow their own pattern** — `components/shared/DataTable.tsx`, `Modal.tsx`, `Aleart.tsx` (`Alert` + `AlertDialog`, note the filename typo is intentional/existing, don't "fix" it without checking every import), `EmptyState.tsx`. These are all base-ui under the hood (ported from an original Radix + framer-motion design) and are used together in `PagesTable.tsx` — read that file as the reference for wiring a table + edit modal + delete confirmation together outside the entity-form flow.

## Auth & route protection

Session auth is a cookie (`better-auth.session_token`) the API sets; `app/(auth)/actions.ts`'s `loginAction` mirrors it onto this app's own domain via `lib/cookie.ts` so `lib/server-fetch.ts`'s `serverFetch` can replay it server-side on every authenticated call. The API is a separate origin, so a browser `fetch` can never carry that cookie — **every authenticated request goes through a Server Action**, never a client-side fetch.

Two layers enforce access, deliberately split by cost:

- **`proxy.ts`** (Next 16's renamed middleware) is an optimistic, cookie-*presence* check only, on `/admin/:path*` and `/faculty-portal/:path*`. It runs on every matched request and makes no API call, so it can't tell an admin from a teacher.
- **`lib/auth-guards.ts`'s `requireRole("admin" | "teacher")`** is the authoritative check, called from `app/(admin)/layout.tsx` and `app/(faculty)/layout.tsx`. It calls `getSession()` (`GET /auth/me`), redirects to `/signin` if there's no session, and redirects a mismatched role to `homeFor(role)` — a TEACHER hitting `/admin` lands on `/faculty-portal` and vice versa, silently.

A layout redirect doesn't protect a Server Action, though — actions are independently addressable POST endpoints. `app/(faculty)/profile-actions.ts` re-checks the session role inside every action before touching the API, not just at the page level.

## Faculty portal (`/faculty-portal/*`)

Live against `/teachers/profile/*` — a **session-scoped** API (the server derives the teacher from the auth cookie, so there's no teacher id in any of these paths) covering the signed-in teacher's own profile plus education/experience/awards/memberships/publications sub-resources.

Deliberately **not** built on the admin entity pipeline (`services/endpoints.ts` + `services/entity.ts` + `entity-actions.ts`): that machinery is keyed by `EntitySchema` and models `/{resource}/{id}` paths, neither of which these session-scoped resources have. Instead: `services/teacher-profile.ts` (transport + date/order-field conversion), `app/(faculty)/profile-mapping.ts` (the portal's UI shape ↔ API shape bridge), `app/(faculty)/profile-actions.ts` (Server Actions, same `ActionResult<T>` convention as `entity-actions.ts`), and `features/teacher-profile/` (TanStack Query hooks, same shape as `features/entity/`).

`components/faculty/FacultySectionList.tsx` is a thin dispatcher over a `source` prop: `"live"` (the portal, via `features/teacher-profile/`) or `"demo"` (the admin's per-teacher preview workspace at `/admin/faculty/[id]/*`, via `FacultyProfileProvider`'s in-memory state). Both render the same `components/faculty/section-list/SectionListView.tsx`. The admin workspace stays on demo data on purpose — the teacher endpoints are scoped to "the signed-in teacher," not addressable by an admin for an arbitrary teacher id, so there's no live endpoint to wire that workspace to.

## Verification

Before considering any change done:

```
npx tsc --noEmit
npm run lint
npm run build
```

The build output lists every route with its render mode — confirm new public-site routes are `○ (Static)` (or `● SSG` for `generateStaticParams` routes) unless they genuinely need to read `searchParams`/`cookies` (which makes them `ƒ Dynamic`, expected for `/academics`, `/admission`, `/research`). Every route under `/admin/*` and `/faculty-portal/*` is also `ƒ Dynamic` — both layouts call `requireRole()`, which reads the session cookie — with one exception: `/admin/faculty/[id]/*` stays `● SSG` (`generateStaticParams` + `dynamicParams = false` against static JSON, mounted inside the already-dynamic admin layout). An unexpectedly dynamic *public* route usually means client state leaked into a server component's render path.

For anything interactive, start the dev server and check the actual page — a clean build proves the code compiles, not that the feature works. Watch the browser console for hydration warnings, a common source of which in this codebase has been client-side `Date`/`toLocaleDateString()` formatting; prefer pre-formatted date strings in `content/*.json` over runtime formatting.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
