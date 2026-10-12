import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  FlaskConical,
  Award,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFacultyDetails } from "../_actions/faculties";
import { getFaculties } from "@/app/(landing)/department/_actions/faculties";
import EmptyState from "@/components/shared/EmptyState";
import { FacultySidebar } from "../_ui/FacultySidebar";

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
          {/* Dean Info */}
          {faculty.dean && (
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-6 sm:p-8 rounded-2xl border border-primary/10 shadow-sm">
              <Avatar className="h-36 w-28 sm:w-32 aspect-3/4 rounded-xl border border-slate-200/80 shadow-xs shrink-0 overflow-hidden bg-slate-100">
                <AvatarImage
                  src={getMediaUrl(faculty.dean.imageUrl) || ""}
                  alt={faculty.dean.name}
                  className="aspect-3/4 object-cover w-full h-full"
                />
                <AvatarFallback className="text-2xl font-bold font-heading text-slate-400 rounded-xl">
                  {getInitials(faculty.dean.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                  Office of the Dean
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {faculty.dean.name}
                </h2>
                <p className="text-secondary font-semibold text-sm mb-3">
                  Dean, {faculty.name}
                </p>
                {faculty.dean.bio ? (
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic">
                    &quot;{faculty.dean.bio.replace(/<[^>]*>?/gm, "")}&quot;
                  </p>
                ) : faculty.dean.shortBio ? (
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    &quot;{faculty.dean.shortBio}&quot;
                  </p>
                ) : null}
              </div>
            </div>
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
              <h3 className="mb-4 font-heading text-xl font-bold text-primary">
                Departments
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {faculty.departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="rounded-xl border border-primary/10 bg-white p-5 transition-shadow duration-300 hover:shadow-md"
                  >
                    <h4 className="mb-2 font-heading font-semibold text-foreground">
                      {dept.name}
                    </h4>
                    {dept.subtitle && (
                      <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
                        {dept.subtitle}
                      </p>
                    )}
                    {dept.slug && (
                      <Link
                        href={`/department/${dept.slug}`}
                        className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-secondary px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-white"
                      >
                        View Department
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
