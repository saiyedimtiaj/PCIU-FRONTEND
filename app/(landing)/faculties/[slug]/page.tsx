import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  FlaskConical,
  Award,
  ChevronRight,
  GraduationCap,
  Building2,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils/media";
import { ChaseBorder } from "@/components/shared/ChaseBorder";
import { getFacultyDetails } from "../_actions/faculties";
import { getFaculties } from "@/app/(landing)/department/_actions/faculties";
import EmptyState from "@/components/shared/EmptyState";
import { FacultySidebar } from "../_ui/FacultySidebar";
import { DeanMessage } from "../_ui/DeanMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FACULTY_CONFIG: Record<
  string,
  { icon: string; shortName: string; order: number }
> = {
  "faculty-of-business-studies": {
    icon: "building",
    shortName: "Business Studies",
    order: 1,
  },
  "faculty-of-humanities-social-sciences-and-law": {
    icon: "book-open",
    shortName: "Humanities & Law",
    order: 2,
  },
  "faculty-of-science-and-engineering": {
    icon: "microscope",
    shortName: "Science & Eng.",
    order: 3,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faculty = await getFacultyDetails(slug);

  if (!faculty) {
    return {
      title: "Faculty Not Found | Port City International University",
    };
  }

  return {
    title: `${faculty.name} | Port City International University`,
    description:
      faculty.about ||
      `Explore academic programs and departments in ${faculty.name} at Port City International University.`,
  };
}

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [faculty, apiFaculties] = await Promise.all([
    getFacultyDetails(slug),
    getFaculties(),
  ]);

  if (!faculty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<GraduationCap className="h-16 w-16" />}
          title="Faculty not found!"
          description="The faculty you are looking for does not exist."
        />
      </div>
    );
  }

  const faculties = apiFaculties || [];
  const augmentedFaculties = faculties
    .map((f) => ({
      ...f,
      icon: FACULTY_CONFIG[f.slug]?.icon || "graduation-cap",
      shortName: FACULTY_CONFIG[f.slug]?.shortName || f.name,
      order: FACULTY_CONFIG[f.slug]?.order || 99,
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      {/* Dynamic Hero Banner */}
      <section className="relative py-14 text-white sm:py-16 md:py-20 overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('/images/banners/faculties-layout-banner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-primary/75 z-0" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-primary/90 z-0" />

        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
          <GraduationCap
            className="mx-auto mb-4 h-12 w-12 sm:h-14 sm:w-14 drop-shadow-md text-white/90"
            aria-hidden
          />
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl drop-shadow-lg text-white">
            {faculty.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/90 sm:text-base md:text-lg drop-shadow">
            Explore academic excellence across diverse disciplines at Port City
            International University
          </p>
        </div>
      </section>

      {/* Faculty Navigation Bar (Pill design for all devices) */}
      {augmentedFaculties.length > 0 && (
        <div className="border-b border-border/60 bg-white py-4 shadow-2xs">
          <div className="container mx-auto px-4 sm:px-6">
            <FacultySidebar faculties={augmentedFaculties} activeSlug={slug} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
          {/* Dean's message */}
          {faculty.dean && (
            <DeanMessage dean={faculty.dean} facultyName={faculty.name} />
          )}

          {/* About */}
          {faculty.about && (
            <div>
              <h3 className="mb-3 font-heading text-xl font-bold text-primary">
                About
              </h3>
              <p className="leading-relaxed text-muted-foreground text-base">
                {faculty.about}
              </p>
            </div>
          )}

          {/* Vision & Mission */}
          {(faculty.vision || faculty.mission) && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              {faculty.vision && (
                <div className="rounded-xl border border-primary/10 border-l-4 border-l-primary bg-white p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" aria-hidden />
                    <h4 className="font-heading font-semibold text-primary">
                      Vision
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {faculty.vision}
                  </p>
                </div>
              )}
              {faculty.mission && (
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
                    {faculty.mission}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Key Highlights */}
          {faculty.keyPoint && faculty.keyPoint.length > 0 && (
            <div>
              <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {faculty.keyPoint.map((item: string) => (
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

          {/* Departments */}
          {faculty.departments && faculty.departments.length > 0 && (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <h3 className="font-heading text-xl font-bold text-primary">
                  Departments
                </h3>
                <span className="rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-primary">
                  {faculty.departments.length}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {faculty.departments.map((dept) => {
                  const thumbnail = getMediaUrl(dept.image);
                  const cardContent = (
                    <>
                      {/* Decorative corner wash */}
                      <div className="absolute right-0 top-0 -z-10 h-28 w-28 rounded-bl-full bg-linear-to-bl from-secondary/10 via-secondary/5 to-transparent transition-transform duration-500 group-hover:scale-125" />

                      <div className="mb-4 flex items-start justify-between">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary/5 shadow-xs">
                          <Avatar className="h-full w-full rounded-lg">
                            <AvatarImage src={thumbnail || ""} />
                            <AvatarFallback>
                              <span className="flex h-full w-full items-center justify-center text-secondary">
                                <Building2 className="h-6 w-6" aria-hidden />
                              </span>
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        {dept.shortName && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 transition-colors duration-300 group-hover:bg-secondary/10 group-hover:text-secondary">
                            {dept.shortName}
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading text-lg font-bold leading-snug text-primary line-clamp-2 transition-colors duration-300 group-hover:text-secondary">
                        {dept.name}
                      </h4>

                      {dept.subtitle && (
                        <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                          {dept.subtitle}
                        </p>
                      )}

                      <div className="mt-auto grid grid-cols-2 gap-3 pt-5 text-sm text-slate-600">
                        <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-slate-200/60">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Graduates
                          </span>
                          <span className="font-semibold tabular-nums text-slate-700">
                            {typeof dept.graduate === "number" &&
                            dept.graduate > 0
                              ? dept.graduate.toLocaleString()
                              : "—"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50 p-3 transition-colors group-hover:border-secondary/30 group-hover:bg-secondary/5">
                          <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Overview
                          </span>
                          <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                            Visit
                            <ChevronRight
                              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                              aria-hidden
                            />
                          </span>
                        </div>
                      </div>

                      {/* Traveling animated gradient border (same as program cards) */}
                      <ChaseBorder id={`faculty-department-${dept.id}`} />
                    </>
                  );

                  const cardClassName =
                    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl";

                  return dept.slug ? (
                    <Link
                      key={dept.id}
                      href={`/department/${dept.slug}`}
                      className={cardClassName}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={dept.id} className={cardClassName}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
