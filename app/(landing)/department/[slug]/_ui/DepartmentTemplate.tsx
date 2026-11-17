import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DepartmentContent } from "@/types/department";
import { DepartmentNav } from "./DepartmentNav";
import { FacultyCarousel } from "./FacultyCarousel";
import { ChairmanMessage } from "./ChairmanMessage";
import { ChaseBorder } from "@/components/shared/ChaseBorder";
import Image from "next/image";
import { getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import { formatEventDateTime } from "@/lib/event-format";
import { formatNoticeDate, getNoticeDateParts } from "@/lib/notice-date";
import StatCounter from "@/app/(landing)/_ui/StatCounter";

export default function DepartmentTemplate({
  content,
}: {
  content: DepartmentContent;
}) {
  // Derive stat numbers for the stats bar
  const graduatesCount =
    content.stats?.find((s) => s.label.toLowerCase().includes("graduate"))
      ?.value || "500+";
  const facultyCount =
    content.facultyMembers.length > 0
      ? content.facultyMembers.length.toString()
      : "10";
  const programsCount =
    content.programs.length > 0 ? content.programs.length.toString() : "10";
  const publicationsCount =
    content.researchAreas.length > 0
      ? content.researchAreas.length.toString() + "+"
      : "20+";

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero */}
      <section className="relative bg-[#2B355A] pt-16 md:pt-24 pb-28 md:pb-36 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block bg-accent text-black text-xs font-bold px-3 py-1 rounded-full mb-6">
              {content.hero.badge}
            </span>
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4 leading-tight">
              {content.hero.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              {content.hero.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                className="bg-accent text-black hover:bg-accent-hover border-0 h-12 px-8 rounded-md font-semibold text-base"
                render={<Link href={content.hero.buttonLink || "#"} />}
                nativeButton={false}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
        <Image
          src={getMediaUrl(content.image) || "/images/hero-campus.jpg"}
          alt="hero background"
          fill
          className="object-cover opacity-20"
        />
      </section>

      {/* Stats Cards - Overlapping Hero */}
      <div className="container relative z-20 mx-auto px-4 -mt-14 md:-mt-18 mb-8">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            { label: "Graduates", value: graduatesCount },
            { label: "Faculty Members", value: facultyCount },
            { label: "Programs Offered", value: programsCount },
            { label: "Publications", value: publicationsCount },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl border-slate-100 shadow-lg transition-shadow duration-300 hover:shadow-xl"
            >
              <CardContent className="flex h-full flex-col items-center justify-center gap-1 px-3 py-5 text-center">
                <div className="text-2xl font-bold text-[#1e3a8a] tabular-nums md:text-3xl">
                  <StatCounter value={stat.value} />
                </div>
                <p className="text-[10px] font-semibold uppercase leading-tight tracking-wider text-muted-foreground md:text-[11px]">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 z-10">
            <DepartmentNav
              title="Department Menu"
              sections={[
                { id: "overview", label: "Overview", icon: "home" },
                {
                  id: "chairman",
                  label: content.chairmanHeading || "Chairman's Message",
                  icon: "users",
                },
                {
                  id: "programs",
                  label: "Programs Offered",
                  icon: "graduation-cap",
                },
                { id: "tuition", label: "Tuition Fee", icon: "file-text" },
                { id: "courses", label: "Course Details", icon: "book-open" },
                { id: "faculty", label: "Faculty Members", icon: "users" },
                {
                  id: "research",
                  label: "Research Activities",
                  icon: "microscope",
                },
                { id: "events", label: "Department Events", icon: "calendar" },
                {
                  id: "notices",
                  label: "Notices",
                  icon: "file-text",
                },
              ]}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-12 container mx-auto">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24 text-wrap">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 border-b-4 border-[#0ea5e9]">
                Welcome to {content.hero.title}
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                {content.overview.content.map((p, i) => (
                  <p dangerouslySetInnerHTML={{ __html: p }} key={i}></p>
                ))}
              </div>
            </section>

            {/* Chairman message */}
            {content.chairman && (
              <section id="chairman" className="scroll-mt-24">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 md:gap-14 items-start pt-6">
                  {/* Photo Card styled like VC */}
                  <div className="relative mx-auto w-full max-w-[320px] md:mx-0">
                    {/* Decorative back panel */}
                    <div className="absolute -left-3 -top-3 h-[calc(100%-24px)] w-[calc(100%-16px)] rounded-3xl bg-[#1e3a8a] sm:-left-4 sm:-top-4" />

                    {/* Main card */}
                    <div className="relative rounded-3xl bg-white p-3 shadow-xl sm:p-4 border border-slate-100">
                      {/* Accent corner - top right */}
                      <div className="absolute right-4 top-4 z-20 h-16 w-16 rounded-tr-xl border-r-[3px] border-t-[3px] border-[#0ea5e9]" />

                      {/* Accent corner - bottom left */}
                      <div className="absolute bottom-14 left-4 z-20 h-12 w-12 rounded-bl-xl border-b-[3px] border-l-[3px] border-[#0ea5e9]" />

                      {/* Photo */}
                      <div className="group relative aspect-4/5 overflow-hidden rounded-[18px] bg-slate-100">
                        {content.chairman.imageUrl ? (
                          <Image
                            src={getMediaUrl(content.chairman.imageUrl) || ""}
                            alt={content.chairman.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-slate-200 text-5xl font-bold text-slate-400 font-heading">
                            {getInitials(content.chairman.name)}
                          </div>
                        )}
                        {/* Subtle image overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1e3a8a]/20 via-transparent to-transparent" />
                      </div>

                      {/* Name / Designation Tag */}
                      <div className="relative z-30 -mt-6 ml-3 mr-3 rounded-xl bg-[#1e3a8a] px-4 py-3 shadow-lg">
                        <h3 className="font-heading text-sm font-bold leading-snug text-white">
                          {content.chairman.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold tracking-wide text-[#0ea5e9]">
                          {content.chairman.designation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="relative">
                    <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#1e3a8a] mb-2">
                      {content.chairmanHeading}
                    </h2>
                    {/* Accent line */}
                    <div className="mb-6 h-1 w-24 rounded-full bg-linear-to-r from-[#1e3a8a] to-[#0ea5e9]" />

                    <div className="relative">
                      <span className="absolute -top-6 -left-4 font-serif text-7xl text-[#0ea5e9]/15 font-bold leading-none select-none">
                        “
                      </span>
                      <ChairmanMessage bio={content.chairman.bio} />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Programs */}
            <section id="programs" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Programs Offered
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.programs.length > 0 ? (
                  content.programs.map((program) => (
                    <Link
                      href={`/programs/${program.id}`}
                      key={program.name}
                      className="group relative bg-white border border-slate-200/90 rounded-xl p-6 hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden block hover:-translate-y-1"
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-linear-to-bl from-[#0ea5e9]/10 via-[#0ea5e9]/5 to-transparent rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-125" />

                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1e3a8a]/5 flex items-center justify-center text-[#0ea5e9] transition-colors duration-300 group-hover:bg-[#0ea5e9] group-hover:text-white shadow-xs">
                          <GraduationCap className="w-7 h-7" />
                        </div>
                        {program.description && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider group-hover:bg-[#0ea5e9]/10 group-hover:text-[#0ea5e9] transition-colors">
                            {program.description}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading font-bold text-[#1e3a8a] text-lg mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-[#0ea5e9]">
                        {program.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-slate-200/60 transition-colors">
                          <span className="text-xs text-slate-400 font-medium uppercase">
                            Duration
                          </span>
                          <span className="font-semibold text-slate-700">
                            {program.duration}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:border-slate-200/60 transition-colors">
                          <span className="text-xs text-slate-400 font-medium uppercase">
                            Credit Hours
                          </span>
                          <span className="font-semibold text-slate-700">
                            {program.credits}
                          </span>
                        </div>
                      </div>

                      {/* Traveling animated gradient border */}
                      <ChaseBorder id={`program-${program.id}`} />
                    </Link>
                  ))
                ) : (
                  <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 italic">
                    No programs currently available.
                  </div>
                )}
              </div>
            </section>

            {/* Tuition Fee */}
            <section id="tuition" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Tuition Fee
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-x-auto">
                {content.tuitionFees && content.tuitionFees.length > 0 ? (
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-slate-50 text-[#1e3a8a] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Program</th>
                        <th className="px-4 py-3">Total Credits</th>
                        <th className="px-4 py-3">Per Credit (BDT)</th>
                        <th className="px-4 py-3 rounded-tr-lg">
                          Total Fees (BDT)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {content.tuitionFees.map((fee, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {fee.program}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {fee.credit}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            ৳ {fee.perCreditAmount}
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0ea5e9]">
                            ৳ {fee.totalFees.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Tuition fee information will be updated soon from the
                    backend.
                  </p>
                )}
              </div>
            </section>

            {/* Course Details */}
            <section id="courses" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Course Details
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                {content.courses && content.courses.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {content.courses.map((course, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex items-start gap-3"
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className="w-8 h-8 rounded bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9] font-bold text-xs">
                            {course.courseCode.split(" ")[0] ||
                              course.courseCode.substring(0, 3)}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1e3a8a] text-[15px] mb-1">
                            {course.courseName}
                          </h3>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                            <span>{course.courseCode}</span>
                            {course.credit && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span>{course.credit} Credits</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    Course details are currently unavailable.
                  </p>
                )}
              </div>
            </section>

            {/* Faculty members */}
            <section id="faculty" className="scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase pb-2 border-b-4 border-[#0ea5e9] inline-block m-0">
                  Faculty Members
                </h2>
                {content.facultyMembers.length > 0 && (
                  <Link
                    href={`/department/${content.slug}/teachers`}
                    className="group w-fit inline-flex items-center gap-3 rounded-full border border-[#0ea5e9]/40 bg-white/80 py-1.5 pl-5 pr-1.5 shadow-[0_6px_20px_rgba(8,47,103,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1e3a8a] hover:bg-white hover:shadow-[0_10px_28px_rgba(8,47,103,0.14)] shrink-0"
                  >
                    <span className="font-heading text-sm font-semibold tracking-wide text-[#1e3a8a] transition-colors duration-300 sm:text-base">
                      View All Faculty
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0ea5e9] text-white shadow-[0_4px_12px_rgba(14,165,233,0.25)] transition-all duration-300 group-hover:bg-[#1e3a8a] group-hover:shadow-[0_5px_16px_rgba(30,58,138,0.25)]">
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                )}
              </div>
              <div className="w-full">
                {content.facultyMembers.length > 0 ? (
                  <FacultyCarousel members={content.facultyMembers} />
                ) : (
                  <div className="w-full bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 italic">
                    No faculty members currently available.
                  </div>
                )}
              </div>
            </section>

            {/* Research Activities */}
            <section id="research" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Research Activities
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                {content.researchAreas && content.researchAreas.length > 0 ? (
                  <div className="grid gap-4">
                    {content.researchAreas.map((area, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-slate-100 bg-slate-50 rounded-lg"
                      >
                        <h3 className="font-bold text-[#1e3a8a] mb-1">
                          {area.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-600 mb-2">
                          By: {area.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {area.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    No research activities found.
                  </p>
                )}
              </div>
            </section>

            {/* Department Events — fetched from /department/events/:id */}
            <section id="events" className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#0ea5e9] pb-2">
                <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase">
                  Department Events
                </h2>
                <Link
                  href="/events"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0ea5e9] transition-colors hover:text-[#1e3a8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
                >
                  All events
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {content.events && content.events.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {content.events.map((event) => {
                    const coverImage = getMediaUrl(event.coverImageUrl);
                    const eventHref = event.slug
                      ? `/events/${event.slug}`
                      : "/events";

                    return (
                      <Link
                        key={event.id}
                        href={eventHref}
                        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0ea5e9]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          {coverImage ? (
                            <Image
                              src={coverImage}
                              alt={event.title}
                              fill
                              sizes="(min-width: 640px) 45vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <CalendarDays
                                aria-hidden="true"
                                className="h-8 w-8"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          {(event.badgeLabel || event.category) && (
                            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
                              {event.badgeLabel ?? event.category}
                            </span>
                          )}
                          <h3 className="line-clamp-2 font-heading font-bold text-[#1e3a8a] transition-colors group-hover:text-[#0ea5e9]">
                            {event.title}
                          </h3>
                          {event.summary && (
                            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                              {event.summary}
                            </p>
                          )}
                          <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Clock3
                                aria-hidden="true"
                                className="h-3.5 w-3.5 shrink-0"
                              />
                              <span className="line-clamp-1">
                                {formatEventDateTime(
                                  event.startDateTime,
                                  event.allDay,
                                )}
                              </span>
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin
                                  aria-hidden="true"
                                  className="h-3.5 w-3.5 shrink-0"
                                />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm italic text-muted-foreground">
                    No upcoming events scheduled for this department.
                  </p>
                </div>
              )}
            </section>

            {/* Department Notices — fetched from /department/notices/:id */}
            <section id="notices" className="scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#0ea5e9] pb-2">
                <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase">
                  Department Notices
                </h2>
                <Link
                  href="/notices"
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0ea5e9] transition-colors hover:text-[#1e3a8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
                >
                  All notices
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {content.notices && content.notices.length > 0 ? (
                <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  {content.notices.map((notice) => {
                    const dateParts = getNoticeDateParts(notice.date);

                    return (
                      <li key={notice.id}>
                        <Link
                          href={`/notices/${notice.id}`}
                          aria-label={`View notice: ${notice.title}`}
                          className="group flex items-start gap-4 px-4 py-4 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0ea5e9]"
                        >
                          <span
                            aria-hidden="true"
                            className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#0ea5e9]/10 py-2 text-[#1e3a8a]"
                          >
                            {dateParts ? (
                              <>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-[#0ea5e9]">
                                  {dateParts.month}
                                </span>
                                <span className="font-heading text-xl font-bold leading-none">
                                  {dateParts.day}
                                </span>
                              </>
                            ) : (
                              <CalendarDays className="h-5 w-5" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0ea5e9]">
                                {notice.badgeLabel ?? notice.category}
                              </span>
                              {notice.badgeLabel && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                  {notice.category}
                                </span>
                              )}
                            </span>
                            <span className="line-clamp-2 font-bold text-[#1e3a8a] transition-colors group-hover:text-[#0ea5e9]">
                              {notice.title}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-slate-500">
                              {formatNoticeDate(notice.date)}
                            </span>
                          </span>

                          <ArrowRight
                            aria-hidden="true"
                            className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0ea5e9]"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm italic text-muted-foreground">
                    No notices published for this department yet.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
