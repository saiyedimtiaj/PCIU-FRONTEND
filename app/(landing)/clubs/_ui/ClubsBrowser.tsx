"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, Building2, LayoutGrid, RotateCcw, Search, X } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/clubs";
import ClubCard from "./ClubCard";

/** Sentinel for "no department filter" — base-ui Select treats "" as empty. */
const ALL = "all";

const SORTS = {
  featured: "Featured first",
  az: "Name: A → Z",
  za: "Name: Z → A",
} as const;
type Sort = keyof typeof SORTS;

interface DepartmentOption {
  value: string;
  label: string;
  short: string;
  count: number;
}

/**
 * Search, department and sort filters over the full club list. Everything is
 * client-side (the list is small and already fetched), so the page itself
 * stays static. Departments are a sidebar on desktop and a dropdown below lg.
 */
export default function ClubsBrowser({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [sort, setSort] = useState<Sort>("featured");
  const term = search.trim().toLowerCase();

  const searched = useMemo(
    () =>
      term
        ? clubs.filter((c) =>
            [c.name, c.description, c.department?.name, c.department?.shortName]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(term),
          )
        : clubs,
    [clubs, term],
  );

  // Departments in first-seen (admin) order, counted against the search.
  const departments = useMemo<DepartmentOption[]>(() => {
    const shorts = new Map<string, string>();
    for (const c of clubs) {
      if (c.department && !shorts.has(c.department.name)) {
        shorts.set(c.department.name, c.department.shortName ?? initialsOf(c.department.name));
      }
    }
    const counts = new Map<string, number>();
    for (const c of searched) {
      if (c.department) counts.set(c.department.name, (counts.get(c.department.name) ?? 0) + 1);
    }
    return [...shorts].map(([value, short]) => ({ value, label: value, short, count: counts.get(value) ?? 0 }));
  }, [clubs, searched]);

  const visible = useMemo(() => {
    const list = department === ALL ? [...searched] : searched.filter((c) => c.department?.name === department);
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [searched, department, sort]);

  const activeCount = [term, department !== ALL, sort !== "featured"].filter(Boolean).length;
  const activeDept = departments.find((d) => d.value === department);

  const options: DepartmentOption[] = [
    { value: ALL, label: "All departments", short: "", count: searched.length },
    ...departments,
  ];
  const selectItems = Object.fromEntries(options.map((o) => [o.value, o.label]));

  function reset() {
    setSearch("");
    setDepartment(ALL);
    setSort("featured");
  }

  return (
    <div className="space-y-8">
      {/* Toolbar — overlaps the hero, hence the heavier shadow. */}
      <div role="search" className="rounded-2xl border border-border bg-card p-3 shadow-xl shadow-primary/10 sm:p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_12rem] lg:grid-cols-[minmax(0,1fr)_12rem_auto]">
          <div className="relative">
            <label htmlFor="club-search" className="sr-only">
              Search clubs
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="club-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clubs by name, department or interest…"
              className="pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Department dropdown — the sidebar replaces it on lg+. */}
          <div className="lg:hidden">
            <Select items={selectItems} value={department} onValueChange={(v) => setDepartment((v as string) || ALL)}>
              <SelectTrigger aria-label="Filter by department">
                <Building2 aria-hidden className="size-4 text-muted-foreground" />
                <SelectValue className="min-w-0 flex-1 truncate text-left" />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    <span className="truncate">{o.label}</span>
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">{o.count}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select items={SORTS} value={sort} onValueChange={(value) => setSort((value as Sort) || "featured")}>
            <SelectTrigger aria-label="Sort clubs">
              <ArrowDownAZ aria-hidden className="size-4 text-muted-foreground" />
              <SelectValue className="min-w-0 flex-1 truncate text-left" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORTS) as Sort[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORTS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="hidden h-11 text-muted-foreground lg:inline-flex"
            onClick={reset}
            disabled={activeCount === 0}
          >
            <RotateCcw aria-hidden />
            Reset
            {activeCount > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">{activeCount}</span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Department sidebar */}
        <aside className="hidden lg:block">
          <nav
            aria-label="Filter by department"
            className="sticky top-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-3">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 aria-hidden className="size-4" />
              </span>
              <h2 className="font-heading text-sm font-bold text-foreground">Departments</h2>
            </div>
            <ul className="space-y-0.5 p-2">
              {options.map((o) => {
                const active = department === o.value;
                const empty = o.count === 0 && !active;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      aria-pressed={active}
                      disabled={empty}
                      onClick={() => setDepartment(o.value)}
                      className={cn(
                        "group/dept relative flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45",
                        active ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "text-foreground hover:bg-muted",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg text-[0.62rem] font-bold tracking-wide uppercase",
                          active ? "bg-accent text-accent-foreground" : "bg-primary/8 text-primary",
                        )}
                      >
                        {o.value === ALL ? <LayoutGrid className="size-4" /> : o.short.slice(0, 4)}
                      </span>
                      <span className="line-clamp-2 min-w-0 flex-1 leading-snug font-medium" title={o.label}>
                        {o.label}
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums",
                          active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {o.count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section aria-label="Clubs" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <div>
              <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground md:text-xl">
                <span aria-hidden className="h-5 w-1 rounded-full bg-accent" />
                {activeDept ? activeDept.label : "All clubs"}
              </h2>
              <p className="mt-0.5 pl-3.5 text-sm text-muted-foreground" aria-live="polite">
                Showing <span className="font-semibold text-foreground">{visible.length}</span> of {clubs.length}{" "}
                {clubs.length === 1 ? "club" : "clubs"}
              </p>
            </div>

            {/* Active filters as removable chips */}
            {activeCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {term && <Chip label={`“${search.trim()}”`} onRemove={() => setSearch("")} />}
                {activeDept && <Chip label={activeDept.short} onRemove={() => setDepartment(ALL)} />}
                {sort !== "featured" && <Chip label={SORTS[sort]} onRemove={() => setSort("featured")} />}
                <button
                  type="button"
                  onClick={reset}
                  className="ml-1 text-xs font-semibold text-primary hover:underline lg:hidden"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card">
              <EmptyState
                title="No clubs match your filters"
                description="Try a different search term or department."
                action={
                  <Button variant="outlineAccent" onClick={reset}>
                    <RotateCcw className="size-4" />
                    Reset filters
                  </Button>
                }
              />
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((club, index) => (
                <li key={club.id}>
                  {/* The first row is above the fold on desktop — load it eagerly. */}
                  <ClubCard club={club} eager={index < 3} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-primary/20 bg-primary/5 pr-1 pl-2.5 text-xs font-medium text-primary">
      <span className="max-w-40 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter ${label}`}
        className="flex size-5 items-center justify-center rounded-full hover:bg-primary/15"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

/** "Computer Science and Engineering" → "CSE" when the API has no short name. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 3 || /^[A-Z]/.test(w))
    .filter((w) => !/^(and|of|the)$/i.test(w))
    .map((w) => w[0]!.toUpperCase())
    .join("")
    .slice(0, 4);
}
