import Link from "next/link";
import { Target, FlaskConical, Award, ChevronRight } from "lucide-react";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFacultyDetails } from "../_actions/faculties";
import EmptyState from "@/components/shared/EmptyState";

export default async function FacultyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faculty = await getFacultyDetails(slug);

  if (!faculty) {
    return (
      <EmptyState
        title="Faculty not found!"
        description="The faculty you are looking for does not exist."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Faculty Header & Dean Info */}
      <div className="mb-6 rounded-xl bg-linear-to-r from-primary/10 via-secondary-light/20 to-accent/5 p-5 sm:mb-8 sm:p-6 md:p-8">
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl md:text-4xl mb-6">
          {faculty.name}
        </h2>

        {faculty.dean && (
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white p-5 rounded-xl border border-slate-100 shadow-md">
            <Avatar className="h-28 w-28 border-4 border-white shadow-sm bg-slate-100">
              <AvatarImage
                src={getMediaUrl(faculty.dean.imageUrl) || ""}
                alt={faculty.dean.name}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl font-bold font-heading text-slate-400">
                {getInitials(faculty.dean.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-heading text-2xl font-bold text-primary mb-1">
                {faculty.dean.name}
              </h3>
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
      </div>

      {faculty.about && (
        <div className="mb-8">
          <h3 className="mb-3 font-heading text-lg font-semibold text-primary sm:text-xl">
            About
          </h3>
          <p className="leading-relaxed text-muted-foreground">
            {faculty.about}
          </p>
        </div>
      )}

      {(faculty.vision || faculty.mission) && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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
                <FlaskConical className="h-5 w-5 text-secondary" aria-hidden />
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

      {faculty.keyPoint && faculty.keyPoint.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-heading text-lg font-semibold text-primary sm:text-xl">
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

      {faculty.departments && faculty.departments.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 font-heading text-lg font-semibold text-primary sm:text-xl">
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
  );
}
