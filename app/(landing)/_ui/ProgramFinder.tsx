"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Building2, GraduationCap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { ProgramFinderItem } from "@/actions/programs";

const ALL_LEVELS = "All Levels";
const ALL_FACULTIES = "All Faculties";

function formatDuration(duration: string | number) {
  const value = String(duration).trim();
  return `${value} ${value === "1" ? "Year" : "Years"}`;
}

function getLevelLabel(programType: string) {
  return programType.toUpperCase() === "GRADUATE"
    ? "Graduate"
    : "Undergraduate";
}

export default function ProgramFinder({
  programs,
  error,
}: {
  programs: ProgramFinderItem[];
  error: boolean;
}) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState(ALL_LEVELS);
  const [facultyFilter, setFacultyFilter] = useState(ALL_FACULTIES);
  const [showAll, setShowAll] = useState(false);

  const faculties = useMemo(
    () => [
      ...new Set(
        programs.map((program) => program.facultyName).filter(Boolean),
      ),
    ],
    [programs],
  );
  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();
    return programs.filter((program) => {
      const matchesSearch =
        !query || program.departmentName.toLowerCase().includes(query);
      const matchesLevel =
        levelFilter === ALL_LEVELS ||
        getLevelLabel(program.programType) === levelFilter;
      const matchesFaculty =
        facultyFilter === ALL_FACULTIES ||
        program.facultyName === facultyFilter;
      return matchesSearch && matchesLevel && matchesFaculty;
    });
  }, [facultyFilter, levelFilter, programs, search]);
  const visiblePrograms = showAll
    ? filteredPrograms
    : filteredPrograms.slice(0, 6);

  function clearFilters() {
    setSearch("");
    setLevelFilter(ALL_LEVELS);
    setFacultyFilter(ALL_FACULTIES);
  }

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24"
      id="academics"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-24 w-[min(820px,90vw)] -translate-x-1/2"
      >
        <svg
          className="h-full w-full motion-safe:animate-arc-rotate"
          viewBox="0 0 820 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M20 6 Q410 82 800 6"
            stroke="hsl(42 85% 58%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.42"
          />
          <path
            d="M10 18 Q410 94 810 18"
            stroke="hsl(230 70% 50%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.24"
          />
          <path
            d="M28 30 Q410 102 792 30"
            stroke="hsl(42 85% 72%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.38"
          />
          <path
            d="M45 42 Q410 108 775 42"
            stroke="hsl(231 77% 22%)"
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity="0.16"
          />
        </svg>
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Find Your Program
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Find a program that fits your goals from our diverse range of
            undergraduate and graduate offerings
          </p>
        </div>
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by department name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-12"
                aria-label="Search by department name"
              />
            </div>
            <select
              className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-base"
              aria-label="Filter by level"
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
            >
              <option>{ALL_LEVELS}</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
            </select>
            <select
              className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-base"
              aria-label="Filter by faculty"
              value={facultyFilter}
              onChange={(event) => setFacultyFilter(event.target.value)}
            >
              <option>{ALL_FACULTIES}</option>
              {faculties.map((faculty) => (
                <option key={faculty}>{faculty}</option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <div className="py-12 text-center text-muted-foreground">
            <p className="font-semibold text-primary">
              Unable to load programs.
            </p>
            <p>Please try again later.</p>
          </div>
        )}
        {!error && filteredPrograms.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {visiblePrograms.map((program) => (
              <div
                key={program.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-3 border-primary/10 border-l-primary border-r-primary bg-linear-to-br from-white via-white to-secondary/5 p-6 shadow-[0_10px_30px_-18px_hsl(231_77%_22%/0.45)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-l-accent hover:border-r-accent hover:shadow-[0_18px_40px_-18px_hsl(230_70%_50%/0.45)] sm:p-7"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                    {getLevelLabel(program.programType)}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-500 group-hover:scale-110">
                    {program.icon ? (
                      <Image
                        src={resolveUploadUrl(program.icon)}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full rounded-xl object-cover"
                        unoptimized
                      />
                    ) : (
                      <GraduationCap className="h-6 w-6" aria-hidden />
                    )}
                  </div>
                </div>
                <h3 className="font-heading mb-2 text-lg font-bold text-primary sm:text-xl">
                  {program.title}
                </h3>
                <div className="mb-4 flex flex-wrap items-start gap-x-3 gap-y-2 text-xs text-muted-foreground sm:text-sm">
                  <span>{formatDuration(program.duration)}</span>
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-secondary" />
                  <span className="inline-flex min-w-0 flex-1 items-start gap-1.5 font-medium text-primary/80">
                    <Building2
                      className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                      aria-hidden
                    />
                    <span className="line-clamp-2">
                      {program.departmentName}
                    </span>
                  </span>
                </div>
                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {program.departmentSubtitle || ""}
                </p>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outlinePrimary"
                    className="group/btn relative w-full overflow-hidden border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-accent hover:text-white"
                    nativeButton={false}
                    render={
                      <Link href={`/department/${program.departmentSlug}`} />
                    }
                  >
                    <span
                      className="absolute inset-0 -translate-x-full bg-linear-to-r from-primary to-primary/90 transition-transform duration-300 group-hover/btn:translate-x-0"
                      aria-hidden
                    />
                    <span className="relative">Learn More</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!error && filteredPrograms.length > 6 && !showAll && (
          <div className="mt-10 text-center">
            <Button
              variant="outlinePrimary"
              size="cta"
              onClick={() => setShowAll(true)}
            >
              Read More
            </Button>
          </div>
        )}
        {!error && filteredPrograms.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground sm:text-base">
            <p>
              {search
                ? `No programs found for "${search}".`
                : "No programs found."}
            </p>
            <Button
              variant="outlineAccent"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
