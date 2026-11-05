"use client";

import { useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  RotateCcw,
  Search,
  SearchX,
  X,
} from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type {
  Circular,
  CircularFilterOption,
  CircularPagination,
  CircularStatus,
} from "@/types/circulars";
import CircularCard from "./CircularCard";
import CircularDetailsModal from "./CircularDetailsModal";
import { STATUS_META } from "./circular-meta";

const ALL = "all";
const STATUS_ORDER: CircularStatus[] = ["active", "upcoming", "expired", "inactive"];

/** 1 … 4 5 6 … 10 — always first, last, and the current page's neighbours. */
function getPageList(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["gap" as const, p] : [p]));
}

interface CircularsBrowserProps {
  circulars: Circular[];
  pagination: CircularPagination;
  typeOptions: CircularFilterOption[];
  departmentOptions: CircularFilterOption[];
  activeType: string;
  activeDepartment: string;
}

export default function CircularsBrowser({
  circulars,
  pagination,
  typeOptions,
  departmentOptions,
  activeType,
  activeDepartment,
}: CircularsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLElement>(null);

  // Selects reflect the new choice immediately while the server refetches.
  const [type, setType] = useOptimistic(activeType);
  const [department, setDepartment] = useOptimistic(activeDepartment);

  // The API has no search or status params, so both filter the fetched page
  // here. They're mirrored into the URL (without a refetch) so they survive
  // paging and can be shared.
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  const [status, setStatus] = useState<CircularStatus | "">(() => {
    const s = searchParams.get("status");
    return STATUS_ORDER.find((x) => x === s) ?? "";
  });
  const term = search.trim().toLowerCase();

  const [selected, setSelected] = useState<Circular | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const searched = useMemo(
    () =>
      term
        ? circulars.filter((c) => `${c.title} ${c.description}`.toLowerCase().includes(term))
        : circulars,
    [circulars, term],
  );
  const statusCounts = useMemo(() => {
    const counts: Record<CircularStatus, number> = { active: 0, upcoming: 0, expired: 0, inactive: 0 };
    for (const c of searched) counts[c.status] += 1;
    return counts;
  }, [searched]);
  const visible = useMemo(
    () => (status ? searched.filter((c) => c.status === status) : searched),
    [searched, status],
  );

  const typeItems = useMemo(
    () => ({ [ALL]: "All types", ...Object.fromEntries(typeOptions.map((o) => [o.value, o.label])) }),
    [typeOptions],
  );
  const departmentItems = useMemo(
    () => ({
      [ALL]: "All departments",
      ...Object.fromEntries(departmentOptions.map((o) => [o.value, o.label])),
    }),
    [departmentOptions],
  );

  const hasServerFilters = Boolean(activeType || activeDepartment);
  const activeFilterCount = [activeType, activeDepartment, term, status].filter(Boolean).length;
  const { currentPage, totalPages, totalCirculars, limit } = pagination;
  const showPagination = totalPages > 1 || currentPage > 1;
  const rangeStart = (currentPage - 1) * (limit || circulars.length) + 1;
  const rangeEnd = rangeStart + circulars.length - 1;

  function buildHref(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function navigate(updates: Record<string, string | null>, scrollToList = false) {
    if (scrollToList) listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    startTransition(() => {
      if ("type" in updates) setType(updates.type ?? "");
      if ("department" in updates) setDepartment(updates.department ?? "");
      router.push(buildHref(updates), { scroll: false });
    });
  }

  /** Client-only filters: update the URL without asking the server for anything. */
  function setLocalParam(key: string, value: string) {
    // Read the live URL, not the `searchParams` snapshot, so two updates in
    // one event don't overwrite each other.
    const next = new URLSearchParams(window.location.search);
    if (value.trim()) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  }

  function handleSearch(value: string) {
    setSearch(value);
    setLocalParam("q", value);
  }

  function handleStatus(value: CircularStatus | "") {
    setStatus(value);
    setLocalParam("status", value);
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    navigate({ q: null, status: null, type: null, department: null, page: null });
  }

  function goToPage(page: number) {
    navigate({ page: page > 1 ? String(page) : null }, true);
  }

  function openDetails(circular: Circular) {
    setSelected(circular);
    setDetailsOpen(true);
  }

  const statusPills: { value: CircularStatus | ""; label: string; count: number; dot?: string }[] = [
    { value: "", label: "All", count: searched.length },
    ...STATUS_ORDER.filter((s) => statusCounts[s] > 0 || status === s).map((s) => ({
      value: s,
      label: STATUS_META[s].label,
      count: statusCounts[s],
      dot: STATUS_META[s].dot,
    })),
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Toolbar — overlaps the hero, hence the heavier shadow. */}
      <div role="search" className="rounded-2xl border border-border bg-card p-3 shadow-lg sm:p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_11rem_17rem]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <label htmlFor="circular-search" className="sr-only">
              Search circulars
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="circular-search"
              type="search"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by title or description…"
              className="pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Select
            items={typeItems}
            value={type || ALL}
            onValueChange={(value) =>
              navigate({ type: !value || value === ALL ? null : String(value), page: null })
            }
          >
            <SelectTrigger aria-label="Filter by circular type">
              <SelectValue className="min-w-0 truncate text-left" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All types</SelectItem>
              {typeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            items={departmentItems}
            value={department || ALL}
            onValueChange={(value) =>
              navigate({ department: !value || value === ALL ? null : String(value), page: null })
            }
            disabled={departmentOptions.length === 0}
          >
            <SelectTrigger aria-label="Filter by department">
              <SelectValue className="min-w-0 truncate text-left" />
            </SelectTrigger>
            <SelectContent className="max-w-[min(28rem,calc(100vw-2rem))]">
              <SelectItem value={ALL}>All departments</SelectItem>
              {departmentOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-3 flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter by status"
            className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <ListFilter aria-hidden className="mr-0.5 size-4 shrink-0 text-muted-foreground" />
            {statusPills.map((pill) => {
              const active = status === pill.value;
              return (
                <button
                  key={pill.value || ALL}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleStatus(pill.value)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  )}
                >
                  {pill.dot && <span aria-hidden className={cn("size-1.5 rounded-full", pill.dot)} />}
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
            className="h-9 self-end text-muted-foreground sm:self-auto"
            onClick={resetFilters}
            disabled={activeFilterCount === 0 || pending}
          >
            <RotateCcw aria-hidden />
            Reset filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results */}
      <section
        ref={listRef}
        aria-label="Circulars"
        aria-busy={pending}
        className={cn("scroll-mt-28 transition-opacity", pending && "pointer-events-none opacity-60")}
      >
        {circulars.length > 0 && (
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
            <h2 className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground md:text-xl">
              <span aria-hidden className="h-5 w-1 rounded-full bg-accent" />
              Latest circulars
            </h2>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {term || status ? (
                <>
                  <span className="font-semibold text-foreground">{visible.length}</span> of{" "}
                  {circulars.length} on this page match your filters
                  {totalPages > 1 && " (search and status cover the current page only)"}
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {rangeStart}–{rangeEnd}
                  </span>{" "}
                  of {totalCirculars}
                </>
              )}
            </p>
          </div>
        )}

        {circulars.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card">
            {currentPage > 1 && totalPages > 0 && currentPage > totalPages ? (
              <EmptyState
                title="This page is empty"
                description={`There ${totalPages === 1 ? "is only 1 page" : `are only ${totalPages} pages`} of circulars.`}
                action={
                  <Button variant="outline" onClick={() => goToPage(1)}>
                    Go to first page
                  </Button>
                }
              />
            ) : hasServerFilters ? (
              <EmptyState
                title="No circulars match these filters"
                description="Try a different type or department, or clear the filters."
                action={
                  <Button variant="outline" onClick={resetFilters}>
                    <RotateCcw aria-hidden />
                    Reset filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                title="No circulars published yet"
                description="New job openings, tenders and announcements will appear here as soon as they're published."
              />
            )}
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card">
            <EmptyState
              variant="icon"
              icon={<SearchX className="size-6" />}
              title="No matching circulars"
              description={
                term
                  ? `Nothing on this page matches “${search.trim()}”${status ? ` with status ${STATUS_META[status].label}` : ""}.`
                  : `No ${status ? STATUS_META[status].label.toLowerCase() : ""} circulars on this page.`
              }
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    handleSearch("");
                    handleStatus("");
                  }}
                >
                  Clear search &amp; status
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {visible.map((circular) => (
              <li key={circular.id} className="min-w-0">
                <CircularCard circular={circular} onViewDetails={openDetails} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pagination */}
      {showPagination && (
        <nav
          aria-label="Circulars pagination"
          className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-2 shadow-sm sm:p-3"
        >
          <Button
            variant="outline"
            className="h-10"
            disabled={!pagination.hasPreviousPage || pending}
            onClick={() => goToPage(Math.min(currentPage - 1, Math.max(totalPages, 1)))}
            aria-label="Previous page"
          >
            <ChevronLeft aria-hidden />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <p className="text-sm text-muted-foreground sm:hidden">
            Page <span className="font-semibold text-foreground">{currentPage}</span> /{" "}
            {Math.max(totalPages, 1)}
          </p>

          <ol className="hidden items-center gap-1 sm:flex">
            {getPageList(currentPage, Math.max(totalPages, 1)).map((p, i) =>
              p === "gap" ? (
                <li key={`gap-${i}`} aria-hidden className="px-1 text-muted-foreground">
                  …
                </li>
              ) : (
                <li key={p}>
                  <Button
                    variant={p === currentPage ? "default" : "ghost"}
                    className="size-10 p-0 tabular-nums"
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? "page" : undefined}
                    disabled={pending}
                    onClick={() => p !== currentPage && goToPage(p)}
                  >
                    {p}
                  </Button>
                </li>
              ),
            )}
          </ol>

          <Button
            variant="outline"
            className="h-10"
            disabled={!pagination.hasNextPage || pending}
            onClick={() => goToPage(currentPage + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight aria-hidden />
          </Button>
        </nav>
      )}

      <CircularDetailsModal
        circular={selected}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}
