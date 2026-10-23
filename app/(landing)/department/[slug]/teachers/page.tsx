import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  User,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { cn, getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import { getDepartmentBySlug } from "../../_actions/departments";
import { TeachersDirectory } from "./_ui/TeachersDirectory";

type Props = {
  params: Promise<{ slug: string }>;
};

const DEPARTMENT_LINKS = [
  { hash: "overview", label: "Overview", icon: BookOpen },
  { hash: "programs", label: "Programs", icon: GraduationCap },
  { hash: "research", label: "Research", icon: FlaskConical },
  { hash: "events", label: "Notices", icon: CalendarDays },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);

  if (!dept) {
    return { title: "Department Not Found" };
  }

  return {
    title: `Faculty Members - ${dept.hero.title} | PCIU`,
    description: `Meet the distinguished faculty members of the ${dept.hero.title} at Port City International University.`,
  };
}

export default async function DepartmentTeachersPage({ params }: Props) {
  const { slug } = await params;
  const dept = await getDepartmentBySlug(slug);

  if (!dept) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <EmptyState
          title="Department Not Found"
          description="The department you are looking for does not exist or has been removed."
          size="lg"
        />
      </div>
    );
  }

  const facultyMembers = dept.facultyMembers || [];
  const chairmanName = dept.chairman?.name?.trim();
  const featuredMember =
    (chairmanName
      ? facultyMembers.find((member) => member.name.trim() === chairmanName)
      : undefined) ?? facultyMembers[0];
  const isChairmanFeatured =
    Boolean(chairmanName) && featuredMember?.name.trim() === chairmanName;
  const featuredImage = getMediaUrl(featuredMember?.imageUrl);

  const focusAreas = (featuredMember?.specialization ?? "")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero */}
      <section
        className={cn(
          "relative overflow-hidden bg-primary",
          featuredMember ? "pb-32 md:pb-40" : "pb-14 md:pb-20",
        )}
      >
        <Image
          src={getMediaUrl(dept.image) || "/images/hero-campus.jpg"}
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/95 to-primary/75" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-16 -top-16 size-[380px] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 pt-8 md:pt-10">
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/department/${slug}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
            >
              <ArrowLeft className="mr-2 size-3.5" aria-hidden />
              Back to Department
            </Link>

            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-1.5 text-[11px] text-white/50 sm:text-xs"
            >
              <Link href="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <ChevronRight className="size-3" aria-hidden />
              <Link
                href="/academics"
                className="transition-colors hover:text-white"
              >
                Academics
              </Link>
              <ChevronRight className="size-3" aria-hidden />
              <span>Departments</span>
              <ChevronRight className="size-3" aria-hidden />
              <Link
                href={`/department/${slug}`}
                className="transition-colors hover:text-white"
              >
                {dept.hero.badge || dept.hero.title}
              </Link>
              <ChevronRight className="size-3" aria-hidden />
              <span className="font-medium text-white/85">Faculty Members</span>
            </nav>
          </div>

          <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-start lg:gap-14">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                <span className="h-px w-8 bg-accent" aria-hidden />
                {dept.hero.title}
              </p>
              <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[56px]">
                Faculty Members
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                Meet our distinguished faculty members of the {dept.hero.title},
                dedicated to academic excellence and innovative research.
              </p>
            </div>

            {/* Directory summary — mirrors the hero card in the reference */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-md">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-heading text-5xl font-bold leading-none text-accent">
                    {facultyMembers.length}
                  </p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    Faculty Members
                  </p>
                </div>
                <Users className="mb-1 size-9 text-white/15" aria-hidden />
              </div>

              <div className="my-5 h-px bg-white/10" />

              <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                Explore Department
              </p>
              <nav className="grid gap-1">
                {DEPARTMENT_LINKS.map(({ hash, label, icon: Icon }) => (
                  <Link
                    key={hash}
                    href={`/department/${slug}#${hash}`}
                    className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Icon
                      className="size-3.5 text-white/30 transition-colors group-hover:text-accent"
                      aria-hidden
                    />
                    <span className="flex-1">{label}</span>
                    <ChevronRight
                      className="size-3 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Featured faculty card — overlaps the hero like the reference */}
      {featuredMember && (
        <div className="container relative z-20 mx-auto -mt-20 max-w-7xl px-4 md:-mt-24">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(8,47,103,0.14)]">
            <div className="grid gap-0 md:grid-cols-[210px_minmax(0,1fr)]">
              <div className="relative min-h-[260px] bg-slate-100 md:min-h-full">
                {featuredImage ? (
                  <Image
                    src={featuredImage}
                    alt={featuredMember.name}
                    fill
                    sizes="(min-width: 768px) 210px, 100vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[260px] items-center justify-center font-heading text-5xl font-bold text-slate-300">
                    {getInitials(featuredMember.name)}
                  </div>
                )}
                <span
                  className="pointer-events-none absolute left-4 top-4 size-10 rounded-tl-lg border-l-2 border-t-2 border-accent"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-4 right-4 size-10 rounded-br-lg border-b-2 border-r-2 border-accent"
                  aria-hidden
                />
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7a5a00]">
                    {isChairmanFeatured
                      ? "Office of the Chairman"
                      : "Featured Faculty"}
                  </span>
                  <span className="rounded-full bg-primary/5 px-3 py-1 text-[10px] font-semibold text-primary">
                    {dept.hero.badge || "Department"}
                  </span>
                </div>

                <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-primary md:text-3xl">
                  {featuredMember.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-accent">
                  {featuredMember.designation}
                </p>
                <p className="mt-1 text-sm text-slate-500">{dept.hero.title}</p>

                {focusAreas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {focusAreas.map((area) => (
                      <span
                        key={area}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-600"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="outlineAccent"
                    size="cta"
                    className="rounded-full"
                    render={<Link href={`/faculty/${featuredMember.id}`} />}
                    nativeButton={false}
                  >
                    View Profile
                    <ArrowRight className="size-4" aria-hidden />
                  </Button>
                  <span className="text-xs font-medium text-slate-400">
                    {facultyMembers.length} faculty member
                    {facultyMembers.length === 1 ? "" : "s"} in this department
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directory */}
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-6 bg-accent" aria-hidden />
              Our People
            </p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Our Faculty
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Browse the scholars and practitioners who teach, mentor, and
              research with our students.
            </p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
            {facultyMembers.length} profiles
          </span>
        </div>

        {facultyMembers.length > 0 ? (
          <TeachersDirectory members={facultyMembers} />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 bg-white py-16 shadow-sm">
            <EmptyState
              title="No Faculty Members Found"
              description="There are currently no faculty members listed for this department. Check back later."
              variant="icon"
              icon={<User className="size-6" />}
            />
          </div>
        )}
      </div>
    </div>
  );
}
