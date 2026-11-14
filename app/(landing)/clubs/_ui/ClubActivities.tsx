"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ListFilter, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClubActivity } from "@/types/clubs";
import ActivityCard from "./ActivityCard";

const ALL = "";
const typeKey = (type: string) => type.trim().toLowerCase();

/** A club's activities with type pills and (for longer lists) a search box. */
export default function ClubActivities({ activities }: { activities: ClubActivity[] }) {
  const [type, setType] = useState(ALL);
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();

  const searched = useMemo(
    () =>
      term
        ? activities.filter((a) =>
            `${a.title} ${a.description} ${a.location ?? ""}`.toLowerCase().includes(term),
          )
        : activities,
    [activities, term],
  );

  const types = useMemo(() => {
    const labels = new Map<string, string>();
    for (const a of activities) {
      const key = typeKey(a.type);
      if (key && !labels.has(key)) labels.set(key, a.type);
    }
    const counts = new Map<string, number>();
    for (const a of searched) {
      const key = typeKey(a.type);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...labels].map(([value, label]) => ({ value, label, count: counts.get(value) ?? 0 }));
  }, [activities, searched]);

  const visible = type ? searched.filter((a) => typeKey(a.type) === type) : searched;
  const filtered = Boolean(type || term);
  const [featured, ...rest] = visible;

  if (activities.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CalendarDays className="size-6" aria-hidden />
        </span>
        <p className="font-heading font-semibold text-foreground">No activities yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Check back soon — this club&apos;s activities will appear here.
        </p>
      </div>
    );
  }

  const showToolbar = types.length > 1 || activities.length > 3;

  return (
    <div className="space-y-5">
      {showToolbar && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center">
          {types.length > 1 && (
            <div
              role="group"
              aria-label="Filter activities by type"
              className="-mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <ListFilter aria-hidden className="mr-0.5 size-4 shrink-0 text-muted-foreground" />
              {[{ value: ALL, label: "All", count: searched.length }, ...types].map((pill) => {
                const active = type === pill.value;
                return (
                  <button
                    key={pill.value || "all"}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setType(pill.value)}
                    className={cn(
                      "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold capitalize transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
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
          )}
          {activities.length > 3 && (
            <div className="relative sm:ml-auto sm:w-64">
              <label htmlFor="activity-search" className="sr-only">
                Search activities
              </label>
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="activity-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search activities…"
                className="h-9 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "activity" : "activities"} shown
      </p>

      {!featured ? (
        <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="font-heading font-semibold text-foreground">No activities match</p>
          <button
            type="button"
            onClick={() => {
              setType(ALL);
              setSearch("");
            }}
            className="mt-2 text-sm font-semibold text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Only the unfiltered list gets a featured card. */}
          <ActivityCard activity={featured} featured={!filtered} />
          {rest.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
