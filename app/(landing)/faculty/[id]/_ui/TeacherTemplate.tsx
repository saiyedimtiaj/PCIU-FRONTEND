"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  Award,
  BookOpen,
  BookText,
  Briefcase,
  Building2,
  ExternalLink,
  GraduationCap,
  Link as LinkIcon,
  MapPin,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  FaGoogleScholar,
  FaResearchgate,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import type {
  TeacherDetails,
  TeacherEducation,
  TeacherExperience,
} from "@/types/teacher";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const tabTriggerClass =
  "-mb-px inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-none border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-500 transition-colors hover:text-[#1e3a8a] data-active:border-[#0ea5e9] data-active:bg-transparent data-active:text-[#1e3a8a] data-active:shadow-none sm:px-4";

function SectionHeading({
  icon: Icon,
  title,
  description,
  count,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  count?: number;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0ea5e9]/10 text-[#0ea5e9]">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <h2 className="font-heading text-lg font-bold text-[#1e3a8a] md:text-xl">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {typeof count === "number" && (
        <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tabular-nums text-slate-600">
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      )}
    </div>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function sortByYearDesc<T extends { year: string | number }>(items: T[]) {
  return [...items].sort(
    (a, b) => (Number(b.year) || 0) - (Number(a.year) || 0),
  );
}

function sortEducationDesc(items: TeacherEducation[]) {
  return sortByYearDesc(items);
}

function sortExperienceDesc(items: TeacherExperience[]) {
  return [...items].sort(
    (a, b) => (parseYear(b.period) || 0) - (parseYear(a.period) || 0),
  );
}

/** Pull the most recent year out of free-text periods like "2018 – Present". */
function parseYear(value?: string) {
  if (!value) return 0;
  const years = value.match(/\d{4}/g);
  return years ? Math.max(...years.map(Number)) : 0;
}

export default function TeacherTemplate({
  teacher,
}: {
  teacher: TeacherDetails;
}) {
  const education = teacher.education ?? [];
  const experiences = teacher.experiences ?? [];
  const publications = teacher.publications ?? [];
  const awards = teacher.awards ?? [];
  const memberships = teacher.memberships ?? [];

  const teachingAreas = (teacher.teachingAreas ?? "")
    .split(",")
    .map((area) => area.trim())
    .filter(Boolean);

  const hasEducation = education.length > 0;
  const hasExperience = experiences.length > 0;
  const hasPublications = publications.length > 0;
  const hasAwards = awards.length > 0;
  const hasMemberships = memberships.length > 0;

  const socialCandidates: {
    href?: string;
    label: string;
    Icon: IconType;
  }[] = [
    {
      href: teacher.googleScholarUrl,
      label: "Google Scholar",
      Icon: FaGoogleScholar,
    },
    {
      href: teacher.researchgateUrl,
      label: "ResearchGate",
      Icon: FaResearchgate,
    },
    { href: teacher.linkedinUrl, label: "LinkedIn", Icon: FaLinkedin },
    { href: teacher.facebookUrl, label: "Facebook", Icon: FaFacebook },
    { href: teacher.twitterUrl, label: "X (Twitter)", Icon: FaXTwitter },
    { href: teacher.websiteUrl, label: "Personal website", Icon: LinkIcon },
  ];

  const socials = socialCandidates.filter(
    (social): social is { href: string; label: string; Icon: IconType } =>
      Boolean(social.href),
  );

  const stats = [
    { label: "Publications", value: publications.length, icon: BookText },
    { label: "Awards", value: awards.length, icon: Award },
    { label: "Memberships", value: memberships.length, icon: Building2 },
    { label: "Positions", value: experiences.length, icon: Briefcase },
  ].filter((stat) => stat.value > 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Header */}
      <section className="relative h-44 w-full overflow-hidden bg-[#1e3a8a] md:h-60">
        <Image
          src="/images/faculty-hero-bg.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#1e3a8a]/95 via-[#1e3a8a]/75 to-[#0ea5e9]/45" />
        <div className="absolute inset-0 bg-linear-to-t from-[#1e3a8a]/60 via-transparent to-transparent" />
      </section>

      {/* Main Profile Info */}
      <div className="container relative z-10 mx-auto -mt-24 px-4 md:-mt-28">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)] md:p-8">
          <div className="flex flex-col gap-7 md:flex-row md:items-start">
            <div className="shrink-0 self-center md:self-auto">
              <Avatar className="aspect-3/4 h-auto w-32 overflow-hidden rounded-2xl border-4 border-white bg-slate-100 text-slate-400 shadow-lg after:hidden sm:w-36 md:w-40">
                <AvatarImage
                  src={getMediaUrl(teacher.imageUrl) || ""}
                  alt={teacher.name}
                  className="size-full rounded-2xl object-cover"
                />
                <AvatarFallback className="size-full rounded-2xl bg-linear-to-br from-[#1e3a8a] to-[#0ea5e9] font-heading text-4xl font-bold text-white">
                  {getInitials(teacher.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1 space-y-3 text-center md:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0ea5e9]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0c7bb3]">
                  <Building2 className="size-3.5" />
                  {teacher.department?.name ?? "Faculty"}
                </span>
                <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-[#1e3a8a] md:text-4xl">
                  {teacher.name}
                </h1>
                <p className="mt-1 text-base font-semibold text-[#0ea5e9] md:text-lg">
                  {teacher.designation}
                </p>
                {teacher.department?.faculty?.name && (
                  <p className="mt-0.5 text-sm text-slate-500">
                    {teacher.department.faculty.name}
                  </p>
                )}
              </div>

              {(teacher.office || teacher.isStudyLeave) && (
                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  {teacher.office && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                      <MapPin className="size-3.5 text-[#0ea5e9]" />
                      {teacher.office}
                    </span>
                  )}
                  {teacher.isStudyLeave && (
                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                      On study leave
                      {teacher.leavePeriod ? ` · ${teacher.leavePeriod}` : ""}
                    </span>
                  )}
                </div>
              )}

              {socials.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 md:justify-start">
                  {socials.map(({ href, label, Icon }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0ea5e9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]/40"
                    >
                      <Icon className="size-4" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {stats.length > 0 && (
            <div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-3 py-2.5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#0ea5e9] shadow-sm">
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-lg font-bold leading-none text-[#1e3a8a] tabular-nums">
                      {value}
                    </p>
                    <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto mt-10 px-4">
        <Tabs defaultValue="about" variant="underline" className="w-full">
          <div className="sticky top-17.5 z-30 -mx-4 border-b border-slate-200/80 bg-slate-50/90 px-4 backdrop-blur-md">
            <TabsList className="h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-none border-b-0 bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <TabsTrigger value="about" className={tabTriggerClass}>
                <User className="size-4" /> About
              </TabsTrigger>
              {hasEducation && (
                <TabsTrigger value="education" className={tabTriggerClass}>
                  <GraduationCap className="size-4" /> Education
                </TabsTrigger>
              )}
              {hasExperience && (
                <TabsTrigger value="experience" className={tabTriggerClass}>
                  <Briefcase className="size-4" /> Experience
                </TabsTrigger>
              )}
              {hasPublications && (
                <TabsTrigger value="publications" className={tabTriggerClass}>
                  <BookText className="size-4" /> Publications
                </TabsTrigger>
              )}
              {hasAwards && (
                <TabsTrigger value="awards" className={tabTriggerClass}>
                  <Award className="size-4" /> Awards
                </TabsTrigger>
              )}
              {hasMemberships && (
                <TabsTrigger value="memberships" className={tabTriggerClass}>
                  <BookOpen className="size-4" /> Memberships
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* About */}
          <TabsContent
            value="about"
            className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Panel>
                <SectionHeading
                  icon={User}
                  title="Biography"
                  description="Academic background and professional summary"
                />
                {teacher.bio ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: teacher.bio }}
                    className="max-w-none text-[15px] leading-7 text-slate-600 [&_a]:font-medium [&_a]:text-[#0ea5e9] [&_a]:underline [&_a]:underline-offset-2 [&_li]:mb-1.5 [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-slate-800"
                  />
                ) : (
                  <p className="text-sm italic text-slate-500">
                    A detailed biography for this faculty member will be added
                    soon.
                  </p>
                )}
              </Panel>

              <aside className="space-y-6">
                {teachingAreas.length > 0 && (
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1e3a8a]">
                      Teaching &amp; Research Areas
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {teachingAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-lg border border-[#0ea5e9]/20 bg-[#0ea5e9]/5 px-3 py-1.5 text-xs font-medium text-[#0c7bb3]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(teacher.office || socials.length > 0) && (
                  <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#1e3a8a]">
                      Contact &amp; Profiles
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm">
                      {teacher.office && (
                        <li className="flex items-start gap-2.5 text-slate-600">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-[#0ea5e9]" />
                          <span>{teacher.office}</span>
                        </li>
                      )}
                      {socials.map(({ href, label, Icon }) => (
                        <li key={label}>
                          <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 text-slate-600 transition-colors hover:text-[#0ea5e9]"
                          >
                            <Icon className="size-4 shrink-0 text-[#0ea5e9]" />
                            <span className="truncate">{label}</span>
                            <ExternalLink className="size-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-[#0ea5e9]" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </TabsContent>

          {/* Education */}
          {hasEducation && (
            <TabsContent
              value="education"
              className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
            >
              <Panel>
                <SectionHeading
                  icon={GraduationCap}
                  title="Education"
                  description="Academic qualifications and degrees"
                  count={education.length}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {sortEducationDesc(education).map((edu, idx) => (
                    <div
                      key={`${edu.degree}-${idx}`}
                      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-300 hover:border-[#0ea5e9]/40 hover:bg-white hover:shadow-md"
                    >
                      <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-linear-to-b from-[#1e3a8a] to-[#0ea5e9] transition-transform duration-300 group-hover:scale-y-100" />
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-white text-[#0ea5e9] shadow-sm">
                          <GraduationCap className="size-5" />
                        </span>
                        {edu.year && (
                          <span className="rounded-full bg-[#1e3a8a]/5 px-2.5 py-1 text-xs font-semibold tabular-nums text-[#1e3a8a]">
                            {edu.year}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-4 font-heading text-base font-bold leading-snug text-[#1e3a8a]">
                        {edu.degree}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {edu.institution}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>
          )}

          {/* Experience */}
          {hasExperience && (
            <TabsContent
              value="experience"
              className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
            >
              <Panel>
                <SectionHeading
                  icon={Briefcase}
                  title="Professional Experience"
                  description="Academic and professional appointments"
                  count={experiences.length}
                />
                <ol className="relative space-y-5 before:absolute before:inset-y-3 before:left-4 before:w-px before:bg-linear-to-b before:from-[#0ea5e9]/50 before:via-slate-200 before:to-transparent">
                  {sortExperienceDesc(experiences).map((exp, idx) => (
                    <li key={`${exp.title}-${idx}`} className="relative flex gap-4">
                      <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0ea5e9] shadow-sm ring-1 ring-[#0ea5e9]/25">
                        <Briefcase className="size-3.5" />
                      </span>
                      <div className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-colors duration-300 hover:border-[#0ea5e9]/40 hover:bg-white">
                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                          <h3 className="font-heading text-base font-bold text-[#1e3a8a]">
                            {exp.title}
                          </h3>
                          {exp.period && (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              {exp.period}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm font-medium text-[#0ea5e9]">
                          {exp.organization}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Panel>
            </TabsContent>
          )}

          {/* Publications */}
          {hasPublications && (
            <TabsContent
              value="publications"
              className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
            >
              <Panel>
                <SectionHeading
                  icon={BookText}
                  title="Publications"
                  description="Peer-reviewed research and scholarly output"
                  count={publications.length}
                />
                <div className="space-y-4">
                  {sortByYearDesc(publications).map((pub, idx) => (
                    <article
                      key={pub.id ?? `${pub.title}-${idx}`}
                      className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/40 p-5 transition-all duration-300 hover:border-[#0ea5e9]/40 hover:bg-white hover:shadow-md md:p-6"
                    >
                      <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-linear-to-b from-[#1e3a8a] to-[#0ea5e9] transition-transform duration-300 group-hover:scale-y-100" />
                      <div className="flex flex-wrap items-center gap-2">
                        {pub.type && (
                          <span className="rounded-full bg-[#1e3a8a]/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1e3a8a]">
                            {pub.type}
                          </span>
                        )}
                        {pub.year && (
                          <span className="rounded-full bg-[#0ea5e9]/10 px-2.5 py-1 text-[11px] font-bold tabular-nums text-[#0c7bb3]">
                            {pub.year}
                          </span>
                        )}
                        {idx === 0 && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                            Latest
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-heading text-base font-bold leading-snug text-[#1e3a8a] md:text-lg">
                        {pub.title}
                      </h3>
                      {pub.authors && (
                        <p className="mt-1.5 text-sm font-medium text-slate-600">
                          {pub.authors}
                        </p>
                      )}
                      {pub.venue && (
                        <p className="mt-0.5 text-sm italic text-slate-500">
                          {pub.venue}
                        </p>
                      )}
                      {pub.externalLink && (
                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <Link
                            href={pub.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0ea5e9] transition-colors hover:text-[#1e3a8a]"
                          >
                            View publication
                            <ExternalLink className="size-4" />
                          </Link>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </Panel>
            </TabsContent>
          )}

          {/* Awards */}
          {hasAwards && (
            <TabsContent
              value="awards"
              className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
            >
              <Panel>
                <SectionHeading
                  icon={Award}
                  title="Awards & Honours"
                  description="Recognition for academic and professional excellence"
                  count={awards.length}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {sortByYearDesc(awards).map((award, idx) => (
                    <div
                      key={`${award.title}-${idx}`}
                      className="flex gap-4 rounded-xl border border-amber-100 bg-linear-to-br from-amber-50/80 to-white p-5 transition-shadow duration-300 hover:shadow-md"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Award className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-heading font-bold leading-snug text-[#1e3a8a]">
                            {award.title}
                          </h3>
                          {award.year && (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold tabular-nums text-amber-700 ring-1 ring-amber-200">
                              {award.year}
                            </span>
                          )}
                        </div>
                        {award.description && (
                          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                            {award.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>
          )}

          {/* Memberships */}
          {hasMemberships && (
            <TabsContent
              value="memberships"
              className="mt-8 rounded-none border-0 bg-transparent p-0 outline-none animate-in fade-in duration-300"
            >
              <Panel>
                <SectionHeading
                  icon={BookOpen}
                  title="Professional Memberships"
                  description="Societies, associations, and boards"
                  count={memberships.length}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {memberships.map((mem, idx) => (
                    <div
                      key={`${mem.organization}-${idx}`}
                      className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 transition-all duration-300 hover:border-[#0ea5e9]/40 hover:bg-white hover:shadow-md"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0ea5e9] shadow-sm">
                        <Building2 className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-heading font-bold leading-snug text-[#1e3a8a]">
                          {mem.organization}
                        </h3>
                        {mem.role && (
                          <p className="mt-1 text-sm text-slate-600">
                            {mem.role}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
