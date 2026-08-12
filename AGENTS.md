# PCIU Frontend

Public website and design-only admin dashboard for Port City International University (PCIU), rebuilt from an older Vite + Supabase project (`PCIUWeb`, a sibling directory) as a static-first Next.js 16 site with **no backend** — no Supabase, no database, no auth provider. Content lives in JSON files; the admin dashboard is a schema-driven UI shell with no persistence.

## Stack

- **Next.js 16.3.0**, App Router, React 19.2.8, TypeScript, Turbopack
- **Tailwind CSS v4** — CSS-first config, no `tailwind.config.*` file. Theme tokens live in `app/globals.css` (`:root`, `.dark`, `@theme inline`)
- **shadcn "base-nova" style on `@base-ui/react`** — **not Radix**. Every `components/ui/*` primitive wraps a `@base-ui/react/*` module. When you need a primitive that doesn't exist yet, check `node_modules/@base-ui/react/` first — most things (dialog, alert-dialog, select, tabs, accordion, collapsible, tooltip, switch, checkbox, radio-group, toast, number-field, field, form) are already installed and just need a styled wrapper
- **react-hook-form + zod v4 + @hookform/resolvers** — used in the admin forms only (see below). RHF owns validation state there; base-ui's own `Form`/`Field.Root` validation is deliberately *not* used in the same form to avoid two systems double-reporting errors
- No data-fetching library, no state manager, no CMS, no auth library

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
  (auth)/                     Route group: signin, signup, forgot/reset password — visual only, no real auth
  (admin)/                    Route group: admin dashboard, wraps children in AdminShell
    layout.tsx
    admin/
      page.tsx                 Dashboard overview
      pages/ faculty/ settings/ _ui/...
      <group>/<entity>/new/    49 generated "Add" form routes — see Admin dashboard below
components/
  ui/                         shadcn-on-base-ui primitives (button, card, input, select, dialog analog "Modal", ...)
  shared/                     Cross-route components used by the public site (Navbar, footer, Breadcrumb, PageBanner, DataTable, Modal, Aleart, EmptyState, ...)
  admin/                      Admin-only shell (AdminShell, AdminSidebar, AdminHeader, nav-groups.ts) and the form/ engine
    form/                     EntityForm, FormField, FieldArray, EntityFormClient, form-types.ts
content/                      One JSON file per page/section — the site's actual data source, no database
types/                        One .ts file per content domain, matching each content/ JSON file's shape
lib/
  icons.ts                    String-key → lucide-react component registry, for icon names stored in JSON
  utils.ts                    cn() helper
  admin/entities/             One schema file per DB table from the reference DBML — see Admin dashboard below
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

Design-only — **nothing persists**. Forms validate fully with zod, simulate a brief save, show a success toast (`components/ui/toast.tsx`, base-ui `Toast` + `useToastManager`), and reset. There is no backend to connect one to; don't add Supabase or any other database client without being asked.

- **Shell**: `AdminShell` (client, owns `collapsed`/`mobileOpen` state) renders `AdminSidebar` + `AdminHeader` + page content. `AdminSidebar` is a charcoal `--sidebar` themed rail (independent token family from the public site's `--primary`, defined in `globals.css`) with 4 top-level items (Dashboard, Faculty Directory, Pages, Settings) plus 9 collapsible entity groups.
- **The sidebar groups are generated, not hand-maintained.** `components/admin/nav-groups.ts` builds `NAV_GROUPS` directly from `lib/admin/entities/index.ts`'s `ENTITY_REGISTRY` and `ENTITY_GROUP_ORDER`. Adding a new entity to the registry automatically adds its sidebar link — don't hand-edit nav items to add a route.
- **`AdminHeader`'s page title also derives from the entity registry** for `/admin/<group>/<slug>/new` routes (regex-matched, looked up in `ENTITY_REGISTRY`). Only the 4 top-level pages need a manual entry in `PAGE_TITLES`.
- **The 49 entity schemas** in `lib/admin/entities/` map every table in the project's reference DBML schema (departments, teachers, scheduling, content, research, the PCJ journal, admission, IQAC, system settings). Each is a small `EntitySchema` object: field descriptors + a zod schema + default values — see `components/admin/form/form-types.ts` for the shape. **This is the pattern to follow for any new entity**: add one file to `lib/admin/entities/`, register it in `index.ts`'s `ENTITY_REGISTRY`, scaffold `app/(admin)/admin/<group>/<slug>/new/page.tsx` (10 lines — see any existing one for the exact shape), and both the sidebar and header title update automatically.
- **Server/client boundary**: entity `page.tsx` files are server components and must pass only the slug **string** to `EntityFormClient` (a client component) — never the `EntitySchema` object itself. A zod schema and a `LucideIcon` component can't cross from a server component into a client one as props; this broke the build once already. `EntityFormClient` looks the schema up client-side via `getEntitySchema(slug)`.
- **`FormField`** (`components/admin/form/FormField.tsx`) is the single field renderer — it switches on the descriptor's `type` and wires base-ui's controlled components (`Select`, `Switch`, `Checkbox`, `RadioGroup`) through RHF's `Controller`, since they aren't native `<input>` elements `register()` can bind to directly. Native-input types (`text`, `email`, `number`, `date`, `textarea`, ...) use plain `register()`.
- **`json`-typed DB columns become `json-list` fields** — repeatable string rows via RHF's `useFieldArray`, rendered by `FieldArray.tsx`. Use this for any array-of-strings column (`teaching_areas`, `quick_link`, `objectives`, `tags`, `multiple_image`).
- **`relation` fields (FK columns) render as a `select` with placeholder options** — there's no database to query real rows from. Options are hand-authored per schema file; keep them clearly labelled rather than empty, so the form reads as complete even without live data.
- **Reusable components predate the entity-form engine and follow their own pattern** — `components/shared/DataTable.tsx`, `Modal.tsx`, `Aleart.tsx` (`Alert` + `AlertDialog`, note the filename typo is intentional/existing, don't "fix" it without checking every import), `EmptyState.tsx`. These are all base-ui under the hood (ported from an original Radix + framer-motion design) and are used together in `PagesTable.tsx` — read that file as the reference for wiring a table + edit modal + delete confirmation together outside the entity-form flow.

## Verification

Before considering any change done:

```
npx tsc --noEmit
npm run lint
npm run build
```

The build output lists every route with its render mode — confirm new routes are `○ (Static)` (or `● SSG` for `generateStaticParams` routes) unless they genuinely need to read `searchParams`/`cookies` (which makes them `ƒ Dynamic`, expected for `/academics`, `/admission`, `/research`, and nothing else). An unexpectedly dynamic route usually means client state leaked into a server component's render path.

For anything interactive, start the dev server and check the actual page — a clean build proves the code compiles, not that the feature works. Watch the browser console for hydration warnings, a common source of which in this codebase has been client-side `Date`/`toLocaleDateString()` formatting; prefer pre-formatted date strings in `content/*.json` over runtime formatting.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
