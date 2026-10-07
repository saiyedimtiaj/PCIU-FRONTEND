"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { useParams } from "next/navigation";

export interface SidebarFaculty {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
  departments: { id: number; name: string }[];
}

export function FacultySidebar({ faculties }: { faculties: SidebarFaculty[] }) {
  const params = useParams();
  const activeSlug = params.slug as string;

  return (
    <>
      {/* Mobile/tablet: horizontal scrollable faculty tabs */}
      <nav
        aria-label="Select a faculty"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
      >
        {faculties.map((faculty) => {
          const FIcon = iconMap[faculty.icon as keyof typeof iconMap];
          const isActive = faculty.slug === activeSlug;
          return (
            <Link
              key={faculty.id}
              href={`/faculties/${faculty.slug}`}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary bg-primary text-white"
                  : "border-primary/15 bg-white text-primary hover:bg-primary/5"
              }`}
            >
              {FIcon && <FIcon className="h-4 w-4 shrink-0" aria-hidden />}
              {faculty.shortName}
            </Link>
          );
        })}
      </nav>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden shrink-0 lg:block lg:w-80">
        <div className="sticky top-24 space-y-2">
          <h2 className="mb-4 px-2 font-heading text-lg font-semibold text-primary">
            All Faculties
          </h2>
          {faculties.map((faculty) => {
            const FIcon = iconMap[faculty.icon as keyof typeof iconMap];
            const isActive = faculty.slug === activeSlug;
            return (
              <Link
                key={faculty.id}
                href={`/faculties/${faculty.slug}`}
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground hover:bg-muted/60"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/20"
                      : "bg-primary/10 group-hover:bg-primary/20"
                  }`}
                >
                  {FIcon && (
                    <FIcon
                      className={`h-5 w-5 ${isActive ? "text-white" : "text-primary"}`}
                      aria-hidden
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block truncate text-sm font-medium leading-tight ${isActive ? "text-white" : ""}`}
                  >
                    {faculty.shortName}
                  </span>
                  <span
                    className={`block truncate text-xs ${isActive ? "text-white/70" : "text-muted-foreground"}`}
                  >
                    {faculty.departments.length} Department
                    {faculty.departments.length !== 1 ? "s" : ""}
                  </span>
                </span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 shrink-0 transition-transform ${
                    isActive
                      ? "translate-x-0.5 text-white"
                      : "text-muted-foreground"
                  }`}
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
