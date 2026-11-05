"use client";

import { useMemo, useState } from "react";
import { ArrowDownAZ, ListFilter, RotateCcw, Search, X } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/clubs";
import ClubCard from "./ClubCard";

const ALL = "";

const SORTS = {
  featured: "Featured first",
  az: "Name: A → Z",
  za: "Name: Z → A",
} as const;
type Sort = keyof typeof SORTS;

/**
 * Search, department and sort filters over the full club list. Everything is
 * client-side (the list is small and already fetched), so the page itself
 * stays static.
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

  // Department pills, in first-seen (admin) order, counted against the search.
  const departments = useMemo(() => {
    const labels = new Map<string, string>();
    for (const c of clubs) {
      if (c.department && !labels.has(c.department.name)) {
        labels.set(c.department.name, c.department.shortName ?? c.department.name);
      }
    }
    const counts = new Map<string, number>();
    for (const c of searched) {
      if (c.department) counts.set(c.department.name, (counts.get(c.department.name) ?? 0) + 1);
    }
    return [...labels].map(([value, label]) => ({ value, label, title: value, count: counts.get(value) ?? 0 }));
  }, [clubs, searched]);

  const visible = useMemo(() => {
    const list = department ? searched.filter((c) => c.department?.name === department) : [...searched];
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "za") list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [searched, department, sort]);

  const activeCount = [term, department, sort !== "featured"].filter(Boolean).length;

  function reset() {
    setSearch("");
    setDepartment(ALL);
    setSort("featured");
  }

  const pills = [
    { value: ALL, label: "All clubs", title: "All clubs", count: searched.length },
    ...departments.filter((d) => d.count > 0 || d.value === department),
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Toolbar — overlaps the hero, hence the heavier shadow. */}
      <div role="search" className="rounded-2xl border border-border bg-card p-3 shadow-xl shadow-primary/10 sm:p-4">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
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
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter by department"
            className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ListFilter aria-hidden className="mr-0.5 size-4 shrink-0 text-muted-foreground" />
            {pills.map((pill) => {
              const active = department === pill.value;
              return (
                <button
                  key={pill.value || "all"}
                  type="button"
                  title={pill.title}
                  aria-pressed={active}
                  onClick={() => setDepartment(pill.value)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {pill.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[0.68rem] tabular-nums",
                      active ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            className="h-9 shrink-0 self-end text-muted-foreground sm:self-auto"
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

      <section aria-label="Clubs">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
          <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground md:text-xl">
            <span aria-hidden className="h-5 w-1 rounded-full bg-accent" />
            {department ? (departments.find((d) => d.value === department)?.title ?? "Clubs") : "All clubs"}
          </h2>
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Showing <span className="font-semibold text-foreground">{visible.length}</span> of {clubs.length}{" "}
            {clubs.length === 1 ? "club" : "clubs"}
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card">
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
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((club, index) => (
              <li key={club.id}>
                {/* The first row is above the fold on desktop — load it eagerly. */}
                <ClubCard club={club} eager={index < 4} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
