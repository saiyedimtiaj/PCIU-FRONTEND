import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type {
  AdminDashboardContent,
  DashboardStatTone,
  DashboardTone,
} from "@/types/admin-dashboard";

const STAT_STYLES: Record<
  DashboardStatTone,
  { card: string; icon: string; label: string; caption: string; meta: string; arrow: string }
> = {
  dark: {
    card: "border-transparent bg-[#151b2f] text-white",
    icon: "bg-white/10 text-white",
    label: "text-white/55",
    caption: "text-white/62",
    meta: "bg-white/10 text-white/80",
    arrow: "text-white/35 group-hover:text-white",
  },
  violet: {
    card: "border-transparent bg-linear-to-br from-indigo-500 to-violet-600 text-white",
    icon: "bg-white/15 text-white",
    label: "text-indigo-100/65",
    caption: "text-indigo-100/75",
    meta: "bg-white/15 text-white",
    arrow: "text-white/45 group-hover:text-white",
  },
  blue: {
    card: "border-blue-200/70 bg-[#eef5ff] text-foreground",
    icon: "bg-blue-600 text-white",
    label: "text-blue-700/65",
    caption: "text-muted-foreground",
    meta: "bg-white text-blue-700 ring-1 ring-blue-200/70",
    arrow: "text-blue-400 group-hover:text-blue-700",
  },
  gold: {
    card: "border-amber-200/80 bg-[#fff8df] text-foreground",
    icon: "bg-amber-400 text-amber-950",
    label: "text-amber-800/65",
    caption: "text-muted-foreground",
    meta: "bg-white text-amber-800 ring-1 ring-amber-200/80",
    arrow: "text-amber-500 group-hover:text-amber-800",
  },
};

const ACTION_TONES: Record<DashboardTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success-light text-success",
  info: "bg-info-light text-info",
  violet: "bg-secondary/10 text-secondary",
  warning: "bg-warning-light text-warning-foreground",
};

const STATUS_STYLES: Record<string, string> = {
  Published: "border-emerald-300/20 bg-emerald-400/10 text-emerald-300",
  "In review": "border-amber-300/20 bg-amber-400/10 text-amber-200",
  Scheduled: "border-sky-300/20 bg-sky-400/10 text-sky-200",
};

function StatCards({ stats }: { stats: AdminDashboardContent["stats"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon];
        const style = STAT_STYLES[stat.tone];

        return (
          <Link
            key={stat.label}
            href={stat.href}
            className={cn(
              "group relative min-h-48 overflow-hidden rounded-3xl border p-5 transition-transform duration-200 hover:-translate-y-0.5",
              style.card,
            )}
          >
            <div aria-hidden className="absolute -right-14 -top-16 size-40 rounded-full border border-current opacity-[0.06]" />
            <div aria-hidden className="absolute -right-5 -top-8 size-24 rounded-full border border-current opacity-[0.08]" />
            <div className="relative flex items-start justify-between gap-3">
              <span className={cn("flex size-11 items-center justify-center rounded-2xl", style.icon)}>
                <Icon className="size-5" />
              </span>
              <ArrowUpRight className={cn("size-4 transition-colors", style.arrow)} />
            </div>
            <div className="relative mt-6">
              <p className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", style.label)}>{stat.label}</p>
              <p className="mt-1 font-heading text-4xl font-bold tracking-tight">{stat.value}</p>
              <p className={cn("mt-2 text-sm", style.caption)}>{stat.caption}</p>
            </div>
            <span className={cn("relative mt-5 inline-flex rounded-full px-3 py-1 text-[10px] font-semibold", style.meta)}>
              {stat.meta}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function WorkspaceCoverage({ workspace }: { workspace: AdminDashboardContent["workspace"] }) {
  const maxGroup = Math.max(...workspace.groups.map((group) => group.count), 1);

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Actual project structure</p>
          <h2 className="mt-2 font-heading text-xl font-semibold text-foreground">{workspace.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{workspace.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3">
          <span className="font-heading text-2xl font-bold text-foreground">{workspace.totalModules}</span>
          <span className="text-xs font-medium leading-tight text-muted-foreground">registered<br />modules</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.35fr_0.65fr]">
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
          {workspace.groups.map((group) => {
            const Icon = iconMap[group.icon];
            return (
              <Link
                key={group.label}
                href={group.href}
                className="group rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:border-primary/25 hover:bg-accent/45"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-card text-primary ring-1 ring-border">
                    <Icon className="size-4" />
                  </span>
                  <span className="font-heading text-2xl font-bold text-foreground">{group.count}</span>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{group.label}</span>
                  <ArrowUpRight className="size-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(group.count / maxGroup) * 100}%` }} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="m-4 mt-0 rounded-3xl bg-[#151b2f] p-5 text-white sm:m-6 sm:mt-0 xl:ml-0 xl:mt-6">
          <div className="flex items-center gap-5">
            <div
              className="flex size-28 shrink-0 items-center justify-center rounded-full p-2"
              style={{
                background: `conic-gradient(#34d399 0 ${workspace.connectionRate}%, rgba(255,255,255,0.1) ${workspace.connectionRate}% 100%)`,
              }}
            >
              <div className="flex size-full flex-col items-center justify-center rounded-full bg-[#151b2f]">
                <span className="font-heading text-2xl font-bold">{workspace.connectionRate}%</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-white/45">Connected</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Backend status</p>
              <p className="mt-1 font-heading text-2xl font-semibold">{workspace.connectedModules} of {workspace.totalModules}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/50">Only four registered modules still use the dashboard&apos;s explicit not-connected state.</p>
            </div>
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-300" />
              <p className="text-xs font-semibold text-white">Awaiting backend endpoints</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              {workspace.unconnected.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.055] px-3 py-2.5 transition-colors hover:bg-white/10"
                >
                  <span>
                    <span className="block text-xs font-semibold text-white">{item.label}</span>
                    <span className="mt-0.5 block text-[10px] text-white/40">{item.group}</span>
                  </span>
                  <ArrowUpRight className="size-3.5 text-white/35" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkAndAdmissions({
  updates,
  admissions,
}: {
  updates: AdminDashboardContent["recentUpdates"];
  admissions: AdminDashboardContent["admissions"];
}) {
  const maxWeekly = Math.max(...admissions.weekly.map((item) => item.value), 1);

  return (
    <section className="overflow-hidden rounded-[2rem] bg-[#121827] p-4 text-white sm:p-5">
      <div className="flex flex-col gap-2 px-1 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">Editorial workspace</p>
          <h2 className="mt-1 font-heading text-xl font-semibold">Recent work &amp; admission momentum</h2>
        </div>
        <p className="text-xs text-white/45">Admission figures are clearly marked demo data</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-3xl bg-white/[0.045] p-3 ring-1 ring-white/10">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <div>
              <p className="font-heading text-sm font-semibold">Recent content updates</p>
              <p className="mt-0.5 text-xs text-white/45">Most recently touched public areas</p>
            </div>
            <Clock3 className="size-4 text-white/35" />
          </div>
          <div className="space-y-2">
            {updates.map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <Link
                  key={item.path}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors",
                    index === 0
                      ? "border-indigo-400/35 bg-linear-to-r from-indigo-500/25 to-violet-500/20"
                      : "border-white/5 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.06]",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">{item.title}</span>
                      <span className={cn("hidden rounded-full border px-2 py-0.5 text-[9px] font-semibold sm:inline-flex", STATUS_STYLES[item.status])}>
                        {item.status}
                      </span>
                    </span>
                    <span className="mt-1 flex min-w-0 items-center gap-2 text-[11px] text-white/45">
                      <span className="shrink-0">{item.category}</span>
                      <span aria-hidden>·</span>
                      <span className="truncate">{item.path}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0">{item.updated}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-white/30 transition-colors group-hover:text-white" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 via-indigo-600 to-violet-700 p-5 sm:p-6">
          <div aria-hidden className="absolute -right-20 -top-24 -z-10 size-72 rounded-full bg-white/15 blur-3xl" />
          <div aria-hidden className="absolute -bottom-28 left-1/3 -z-10 size-64 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-lg">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80">{admissions.eyebrow}</span>
                <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold text-amber-950">Demo · {admissions.term}</span>
              </div>
              <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight sm:text-3xl">{admissions.title}</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-indigo-100/75">{admissions.description}</p>
            </div>
            <div className="shrink-0 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm sm:text-right">
              <p className="text-xs font-medium text-indigo-100/70">Applications started</p>
              <p className="mt-1 font-heading text-4xl font-bold tracking-tight">{admissions.applicationTotal}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-200"><TrendingUp className="size-3.5" />{admissions.change} vs last intake</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {admissions.stages.map((stage) => (
              <div key={stage.label} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
                <p className="font-heading text-xl font-semibold">{stage.value}</p>
                <p className="mt-1 text-[11px] font-medium text-indigo-100/65">{stage.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 border-t border-white/15 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 flex items-center justify-between text-xs"><span className="font-semibold text-white">Weekly interest</span><span className="text-indigo-100/60">Last 6 weeks</span></div>
              <div className="flex h-20 items-end gap-2">
                {admissions.weekly.map((item) => (
                  <div key={item.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                    <div className="w-full rounded-t-lg bg-white/75 hover:bg-white" style={{ height: `${Math.max((item.value / maxWeekly) * 100, 12)}%` }} title={`${item.label}: ${item.value}`} />
                    <span className="text-[9px] font-medium text-indigo-100/55">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Link href={admissions.secondaryAction.href} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-semibold text-white hover:bg-white/20">{admissions.secondaryAction.label}<ArrowUpRight className="size-3.5" /></Link>
              <Link href={admissions.primaryAction.href} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">{admissions.primaryAction.label}<ArrowRight className="size-3.5" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteRecords({
  inventory,
  faculty,
}: {
  inventory: AdminDashboardContent["inventory"];
  faculty: AdminDashboardContent["facultySnapshot"];
}) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-2">
      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Existing website data</p>
          <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">{inventory.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{inventory.description}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {inventory.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="size-5" /></span>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2"><span className="font-heading text-2xl font-bold text-foreground">{item.value}</span><span className="text-xs font-semibold text-foreground">{item.label}</span></div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Directory data</p>
            <h2 className="mt-2 font-heading text-lg font-semibold text-foreground">{faculty.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{faculty.description}</p>
          </div>
          <span className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-secondary/10 text-secondary"><span className="font-heading text-xl font-bold leading-none">{faculty.total}</span><span className="mt-1 text-[8px] font-bold uppercase tracking-wider">Total</span></span>
        </div>
        <div className="mt-6 space-y-4">
          {faculty.groups.map((group) => (
            <div key={group.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs"><span className="font-medium text-foreground">{group.label}</span><span className="font-semibold text-muted-foreground">{group.count}</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-linear-to-r from-primary to-secondary" style={{ width: `${(group.count / faculty.total) * 100}%` }} /></div>
            </div>
          ))}
        </div>
        <Button variant="ghostAccent" size="sm" className="mt-5" render={<Link href={faculty.action.href} />} nativeButton={false}>{faculty.action.label}<ArrowRight className="size-4" /></Button>
      </section>
    </div>
  );
}

function QuickActions({ actions }: { actions: AdminDashboardContent["quickActions"] }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div><h2 className="font-heading text-lg font-semibold text-foreground">Quick actions</h2><p className="mt-1 text-sm text-muted-foreground">Common publishing tasks, one click away.</p></div>
        <span className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Plus className="size-5" /></span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <Link key={action.href} href={action.href} className="group flex min-h-32 flex-col rounded-2xl border border-border bg-muted/20 p-4 transition-colors hover:border-primary/25 hover:bg-accent/50">
              <div className="flex items-start justify-between gap-3"><span className={cn("flex size-10 items-center justify-center rounded-xl", ACTION_TONES[action.tone])}><Icon className="size-4.5" /></span><ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary" /></div>
              <p className="mt-4 font-heading text-sm font-semibold text-foreground">{action.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function UpcomingEvents({ upcoming }: { upcoming: AdminDashboardContent["upcoming"] }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div><h2 className="font-heading text-lg font-semibold text-foreground">{upcoming.title}</h2><p className="mt-1 text-sm text-muted-foreground">{upcoming.description}</p></div>
        <Button variant="ghostAccent" size="sm" render={<Link href={upcoming.action.href} />} nativeButton={false}>{upcoming.action.label}<ArrowRight className="size-4" /></Button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {upcoming.items.map((item) => (
          <div key={`${item.month}-${item.day}-${item.title}`} className="flex items-center gap-4 rounded-2xl border border-border bg-muted/20 p-4">
            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-primary-foreground"><span className="text-[9px] font-bold tracking-widest">{item.month}</span><span className="font-heading text-xl font-bold leading-none">{item.day}</span></div>
            <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="text-sm font-semibold text-foreground">{item.title}</p><Badge variant="muted" className="text-[9px]">{item.category}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{item.meta}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboardOverview({ data }: { data: AdminDashboardContent }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">{data.intro.eyebrow}</span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-[10px] font-semibold text-muted-foreground">{data.intro.dataLabel}</span>
          </div>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{data.intro.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{data.intro.description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button variant="outline" size="cta" render={<Link href={data.intro.secondaryAction.href} target="_blank" />} nativeButton={false}>{data.intro.secondaryAction.label}<ArrowUpRight className="size-4" /></Button>
          <Button size="cta" render={<Link href={data.intro.primaryAction.href} />} nativeButton={false}><Plus className="size-4" />{data.intro.primaryAction.label}</Button>
        </div>
      </div>

      <StatCards stats={data.stats} />
      <WorkspaceCoverage workspace={data.workspace} />
      <WorkAndAdmissions updates={data.recentUpdates} admissions={data.admissions} />
      <SiteRecords inventory={data.inventory} faculty={data.facultySnapshot} />
      <QuickActions actions={data.quickActions} />
      <UpcomingEvents upcoming={data.upcoming} />
    </div>
  );
}
