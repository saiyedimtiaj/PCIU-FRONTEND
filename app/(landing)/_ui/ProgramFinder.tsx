"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Building2,
  ChevronDown,
  GraduationCap,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { ProgramFinderItem } from "@/app/(landing)/_actions/programs";
import { ArrowRight } from "lucide-react";

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

  const activeFilterCount =
    (search.trim() ? 1 : 0) +
    (levelFilter !== ALL_LEVELS ? 1 : 0) +
    (facultyFilter !== ALL_FACULTIES ? 1 : 0);

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
      {/* Layered thin arcs behind the heading with a gentle 180-degree turn */}
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
          <path
            d="M36 12 Q410 76 784 12"
            stroke="hsl(230 70% 50%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.18"
          />
          <path
            d="M18 26 Q410 100 802 26"
            stroke="hsl(42 85% 58%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.25"
          />
          <path
            d="M54 38 Q410 106 766 38"
            stroke="hsl(42 85% 72%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.22"
          />
          <path
            d="M68 50 Q410 110 752 50"
            stroke="hsl(231 77% 22%)"
            strokeWidth="0.7"
            strokeLinecap="round"
            opacity="0.12"
          />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-8 text-center ">
          <span className="mb-2 mt-2 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
            Academics
          </span>
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Find Your Program
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Find a program that fits your goals from our diverse range of
            undergraduate and graduate offerings
          </p>
        </div>

        {/* Filter bar — unified card instead of three loose controls */}
        <div className="mx-auto mb-4  max-w-4xl rounded-2xl border border-primary/10 bg-white p-3 shadow-[0_10px_30px_-18px_hsl(231_77%_22%/0.3)] sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by department name..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="border-transparent bg-secondary/5 pl-12 focus-visible:border-primary/30 focus-visible:ring-primary/25"
                aria-label="Search by department name"
              />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground sm:px-1">
              <SlidersHorizontal
                className="hidden h-4 w-4 shrink-0 sm:block"
                aria-hidden
              />
              <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-initial">
                <select
                  className="w-full min-w-0 appearance-none rounded-lg border border-input bg-secondary/5 px-4 py-3 pr-9 text-sm transition-colors focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/25 focus-visible:ring-2 focus-visible:ring-primary/25 sm:text-base"
                  aria-label="Filter by level"
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value)}
                >
                  <option>{ALL_LEVELS}</option>
                  <option>Undergraduate</option>
                  <option>Graduate</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
              <div className="relative min-w-0 flex-1 sm:w-auto sm:flex-initial">
                <select
                  className="w-full min-w-0 appearance-none rounded-lg border border-input bg-secondary/5 px-4 py-3 pr-9 text-sm transition-colors focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/25 focus-visible:ring-2 focus-visible:ring-primary/25 sm:text-base"
                  aria-label="Filter by faculty"
                  value={facultyFilter}
                  onChange={(event) => setFacultyFilter(event.target.value)}
                >
                  <option>{ALL_FACULTIES}</option>
                  {faculties.map((faculty) => (
                    <option key={faculty}>{faculty}</option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 sm:self-auto"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear ({activeFilterCount})
              </button>
            )}
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
        {!error && !!filteredPrograms.length && (
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            Showing {visiblePrograms.length} of {filteredPrograms.length}{" "}
            {filteredPrograms.length === 1 ? "program" : "programs"}
          </p>
        )}
        {!error && filteredPrograms.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {visiblePrograms.map((program, index) => {
              const isGraduate =
                getLevelLabel(program.programType) === "Graduate";
              return (
                <div
                  key={program.id}
                  style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                  className="group relative flex h-full animate-card-in flex-col overflow-visible rounded-[1.4rem] border border-primary/10 bg-white opacity-0 shadow-[0_14px_36px_-20px_hsl(231_77%_22%/0.5)] transition-all duration-500 ease-out focus-within:-translate-y-2 focus-within:border-accent/40 focus-within:shadow-[0_26px_50px_-18px_hsl(230_70%_50%/0.4)] hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_26px_50px_-18px_hsl(230_70%_50%/0.4)] motion-reduce:animate-none motion-reduce:opacity-100"
                >
                  {/* Decorative header band with icon + faculty eyebrow */}
                  <div className="relative overflow-hidden rounded-t-[1.4rem] bg-linear-to-br from-primary via-primary to-primary/85 px-6 pb-10 pt-6 sm:px-7 sm:pb-11 sm:pt-7">
                    <span
                      aria-hidden
                      className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 transition-transform duration-700 ease-out group-hover:scale-125"
                    />
                    <span
                      aria-hidden
                      className="absolute -right-4 bottom-0 h-24 w-24 translate-y-1/2 rounded-full bg-accent/25 blur-2xl"
                    />
                    {/* Light sweep — a quick diagonal shine on hover to draw the eye */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-[120%] skew-x-[-20deg] bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[120%] motion-reduce:hidden"
                    />

                    <div className="relative flex items-start justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-inner backdrop-blur-sm ring-1 ring-white/20 transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-110">
                        {program.icon ? (
                          <Image
                            src={resolveUploadUrl(program.icon)}
                            alt=""
                            width={56}
                            height={56}
                            className="h-full w-full rounded-2xl object-cover"
                            unoptimized
                          />
                        ) : (
                          <GraduationCap className="h-7 w-7" aria-hidden />
                        )}
                      </div>

                      {program.facultyName && (
                        <span className="line-clamp-2 max-w-[45%] text-right text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/60">
                          {program.facultyName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Combined level + duration pill, straddling the band/body seam */}
                  <div className="relative z-10 -mt-5 flex justify-center px-6 sm:px-7">
                    <span className="inline-flex items-center divide-x divide-primary/15 overflow-hidden rounded-full bg-white text-xs font-bold shadow-[0_8px_20px_-6px_hsl(231_77%_22%/0.35)] ring-1 ring-primary/10 transition-transform duration-300 ease-out group-hover:scale-105 sm:text-sm">
                      <span
                        className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 ${
                          isGraduate
                            ? "bg-primary text-white"
                            : "bg-accent text-primary"
                        }`}
                      >
                        <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                        {getLevelLabel(program.programType)}
                      </span>
                      <span className="flex items-center gap-1.5 px-3.5 py-2 text-primary sm:px-4">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {formatDuration(program.duration)}
                      </span>
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-4 text-left sm:px-7 sm:pb-7">
                    <h3 className="font-heading mb-2.5 text-lg font-extrabold leading-snug text-primary sm:text-xl">
                      {program.title}
                    </h3>

                    <span className="mb-4 inline-flex items-center gap-1.5 self-start text-xs font-semibold text-secondary sm:text-sm">
                      <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="line-clamp-1">
                        {program.departmentName}
                      </span>
                    </span>

                    <p className=" line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {program.departmentSubtitle || ""}
                    </p>

                    <div className="mt-auto border-t border-dashed border-primary/10 pt-4">
                      <Button
                        variant="outlinePrimary"
                        className="group/btn relative w-full overflow-hidden border-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:border-accent hover:text-white"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/department/${program.departmentSlug}`}
                          />
                        }
                      >
                        <span
                          className="absolute inset-0 -translate-x-full bg-linear-to-r from-primary to-primary/90 transition-transform duration-300 group-hover/btn:translate-x-0"
                          aria-hidden
                        />
                        <span className="relative inline-flex items-center gap-1.5">
                          Learn More
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!error && filteredPrograms.length > 6 && !showAll && (
          //  Read more btn //

          <div className="mt-10 flex justify-center">
            <Button
              size="cta"
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-5 rounded-full border border-[#D99A00] bg-white  px-4 py-2.5 text-sm font-semibold text-[#082F67] shadow-[0_6px_18px_rgba(8,47,103,0.08)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#082F67] hover:bg-[#082F67] hover:text-white hover:shadow-[0_10px_24px_rgba(8,47,103,0.14)] sm:px-4 sm:py-3 sm:text-base"
            >
              <span className="font-extrabold ">Read More</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D99A00] text-white transition-all duration-300 ease-out group-hover:bg-white group-hover:text-[#082F67] ">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>
        )}
        {!error && filteredPrograms.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-primary/20 bg-secondary/5 py-12 text-center text-sm text-muted-foreground sm:text-base">
            <Search
              className="mx-auto mb-3 h-8 w-8 text-primary/40"
              aria-hidden
            />
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

      <style jsx>{`
        @keyframes card-in {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        :global(.animate-card-in) {
          animation: card-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
