import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Target,
  FlaskConical,
  Award,
  ChevronRight,
} from "lucide-react";
import { iconMap } from "@/lib/icons";
import { getFacultyOverview } from "@/lib/data/faculty-overview";

export const metadata: Metadata = {
  title: "Our Faculties | Port City International University",
  description:
    "Explore academic excellence across diverse disciplines at Port City International University.",
};

export default async function FacultiesOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ faculty?: string }>;
}) {
  const params = await searchParams;
  const faculties = await getFacultyOverview();

  if (faculties.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background px-4 py-20 text-center">
        <p className="text-muted-foreground">
          Faculty information is currently unavailable. Please check back soon.
        </p>
      </div>
    );
  }

  const selected =
    faculties.find((f) => f.slug === params.faculty) ?? faculties[0];
  const SelectedIcon = iconMap[selected.icon];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-14 text-white sm:py-16 md:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6">
          <GraduationCap
            className="mx-auto mb-4 h-12 w-12 sm:h-14 sm:w-14"
            aria-hidden
          />
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Faculties
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base md:text-lg">
            Explore academic excellence across diverse disciplines at Port City
            International University
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            {/* Mobile/tablet: horizontal scrollable faculty tabs */}
            <nav
              aria-label="Select a faculty"
              className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden"
            >
              {faculties.map((faculty) => {
                const FIcon = iconMap[faculty.icon];
                const isActive = faculty.slug === selected.slug;
                return (
                  <Link
                    key={faculty.id}
                    href={`/faculties?faculty=${faculty.slug}`}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-primary/15 bg-white text-primary hover:bg-primary/5"
                    }`}
                  >
                    {FIcon && (
                      <FIcon className="h-4 w-4 shrink-0" aria-hidden />
                    )}
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
                  const FIcon = iconMap[faculty.icon];
                  const isActive = faculty.slug === selected.slug;
                  return (
                    <Link
                      key={faculty.id}
                      href={`/faculties?faculty=${faculty.slug}`}
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

            {/* Faculty details */}
            <div className="min-w-0 flex-1">
              <div className="mb-6 flex items-start gap-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary-light/20 to-accent/5 p-5 sm:mb-8 sm:gap-5 sm:p-6 md:p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary sm:h-16 sm:w-16">
                  {SelectedIcon && (
                    <SelectedIcon
                      className="h-7 w-7 text-white sm:h-8 sm:w-8"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-heading text-xl font-bold text-primary sm:text-2xl md:text-3xl">
                    {selected.name}
                  </h2>
                  <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" aria-hidden />
                    <span>
                      Dean:{" "}
                      <strong className="text-foreground">
                        {selected.dean}
                      </strong>
                    </span>
                  </p>
                </div>
              </div>

              {selected.about && (
                <div className="mb-8">
                  <h3 className="mb-3 font-heading text-lg font-semibold text-primary sm:text-xl">
                    About
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {selected.about}
                  </p>
                </div>
              )}

              {(selected.vision || selected.mission) && (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  {selected.vision && (
                    <div className="rounded-xl border border-primary/10 border-l-4 border-l-primary bg-white p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" aria-hidden />
                        <h4 className="font-heading font-semibold text-primary">
                          Vision
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {selected.vision}
                      </p>
                    </div>
                  )}
                  {selected.mission && (
                    <div className="rounded-xl border border-primary/10 border-l-4 border-l-secondary bg-white p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <FlaskConical
                          className="h-5 w-5 text-secondary"
                          aria-hidden
                        />
                        <h4 className="font-heading font-semibold text-secondary">
                          Mission
                        </h4>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {selected.mission}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selected.departments.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 font-heading text-lg font-semibold text-primary sm:text-xl">
                    Departments
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {selected.departments.map((dept) => (
                      <div
                        key={dept.name}
                        className="rounded-xl border border-primary/10 bg-white p-5 transition-shadow duration-300 hover:shadow-md"
                      >
                        <h4 className="mb-1 font-heading font-semibold text-foreground">
                          {dept.name}
                        </h4>
                        {dept.chairman && (
                          <p className="mb-3 text-xs text-muted-foreground">
                            Chairman: {dept.chairman}
                          </p>
                        )}
                        {dept.programs.length > 0 && (
                          <div className="mb-4 flex flex-wrap gap-1.5">
                            {dept.programs.map((prog) => (
                              <span
                                key={prog}
                                className="rounded-full bg-secondary-light px-2.5 py-1 text-xs font-medium text-secondary"
                              >
                                {prog}
                              </span>
                            ))}
                          </div>
                        )}
                        {dept.href ? (
                          <Link
                            href={dept.href}
                            className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
                          >
                            View Department
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selected.highlights.length > 0 && (
                <div>
                  <h3 className="mb-4 font-heading text-lg font-semibold text-primary sm:text-xl">
                    Key Highlights
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selected.highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-lg bg-muted/40 p-3"
                      >
                        <Award
                          className="mt-0.5 h-5 w-5 shrink-0 text-secondary"
                          aria-hidden
                        />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
