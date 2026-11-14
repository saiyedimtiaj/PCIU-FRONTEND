"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "@/components/shared/EmptyState";
import { cn, getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import type { DepartmentFacultyMember } from "@/types/department";

const ALL_FACULTY = "All Faculty";

/** Academic ranks read best in this order; anything else is alphabetical. */
const RANK_ORDER = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Adjunct Faculty",
];

/** "Dean, Professor" → "Professor"; "Professor, Department of CSE" → "Professor". */
function designationGroup(designation: string) {
  const parts = designation
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const rank = parts.find((part) =>
    /\b(professor|lecturer|faculty)\b/i.test(part),
  );
  return rank ?? parts[0] ?? designation;
}

type SortOption = "name-asc" | "name-desc";

export function TeachersDirectory({
  members,
}: {
  members: DepartmentFacultyMember[];
}) {
  const [activeFilter, setActiveFilter] = useState(ALL_FACULTY);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const filters = useMemo(() => {
    const groups = new Set<string>();
    members.forEach((member) => {
      const group = designationGroup(member.designation);
      if (group) groups.add(group);
    });

    const sortedGroups = Array.from(groups).sort((a, b) => {
      const aIndex = RANK_ORDER.indexOf(a);
      const bIndex = RANK_ORDER.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    return [ALL_FACULTY, ...sortedGroups];
  }, [members]);

  const visibleMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return members
      .filter((member) => {
        const matchesFilter =
          activeFilter === ALL_FACULTY ||
          designationGroup(member.designation) === activeFilter;
        if (!matchesFilter) return false;
        if (!normalizedQuery) return true;

        return [member.name, member.designation, member.specialization]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) =>
        sort === "name-asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
  }, [members, activeFilter, query, sort]);

  return (
    <div>
      {filters.length > 2 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200",
                  isActive
                    ? "border-accent bg-accent text-black shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary",
                )}
              >
                {filter}
              </button>
            );
          })}
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-xs">
          <span className="sr-only">Search faculty by name or keyword</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or keyword"
            className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 shadow-xs outline-none transition-colors placeholder:text-slate-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </label>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-xs font-medium text-slate-400">
            {visibleMembers.length} member
            {visibleMembers.length === 1 ? "" : "s"}
          </span>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <SlidersHorizontal className="size-3.5 text-slate-400" aria-hidden />
            <span className="sr-only">Sort faculty</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="h-9 cursor-pointer rounded-full border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-600 outline-none transition-colors hover:border-primary/30 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </label>
        </div>
      </div>

      {visibleMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleMembers.map((member) => (
            <Link
              key={member.id}
              href={`/faculty/${member.id}`}
              aria-label={`View ${member.name}'s profile`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 shadow-[0_8px_30px_rgba(8,47,103,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_40px_rgba(8,47,103,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
            >
              {/* Gold rule revealed on hover */}
              <span className="absolute inset-x-6 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-slate-100">
                <Avatar className="size-full rounded-none after:hidden">
                  <AvatarImage
                    src={getMediaUrl(member.imageUrl) || ""}
                    alt={member.name}
                    className="rounded-none object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <AvatarFallback className="rounded-none bg-slate-100 font-heading text-3xl font-bold text-slate-300">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/45 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                  <h3 className="font-heading text-lg font-bold leading-tight text-white line-clamp-2">
                    {member.name}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs font-medium text-white/75">
                    {member.designation}
                  </p>
                </div>
              </div>

              <span className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-accent/70 px-3 py-2 text-xs font-semibold text-primary transition-colors duration-200 group-hover:bg-accent group-hover:text-black">
                View Profile
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-12 shadow-sm">
          <EmptyState
            title="No faculty members found"
            description="Try a different search term or filter to see more faculty members."
            variant="icon"
            icon={<User className="size-6" />}
          />
        </div>
      )}
    </div>
  );
}
