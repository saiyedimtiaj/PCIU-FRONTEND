import Link from "next/link";
import { GraduationCap, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DepartmentContent } from "@/types/department";
import { DepartmentNav } from "./DepartmentNav";
import Image from "next/image";

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
      <section className="relative bg-[#2B355A] py-16 md:py-24 overflow-hidden">
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
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-[#1e3a8a] mb-1">
                {graduatesCount}
              </p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Graduates
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-[#1e3a8a] mb-1">
                {facultyCount}
              </p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Faculty Members
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-[#1e3a8a] mb-1">
                {programsCount}
              </p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Programs Offered
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-4xl font-bold text-[#1e3a8a] mb-1">
                {publicationsCount}
              </p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                Publications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 z-10">
            <DepartmentNav
              sections={[
                { id: "overview", label: "Overview" },
                {
                  id: "chairman",
                  label: content.chairmanHeading || "Chairman's Message",
                },
                { id: "programs", label: "Programs Offered" },
                { id: "tuition", label: "Tuition Fee" },
                { id: "courses", label: "Course Details" },
                { id: "faculty", label: "Faculty Members" },
                { id: "research", label: "Research Activities" },
                { id: "events", label: "Events & Notices" },
              ]}
            />
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-12">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Welcome to {content.hero.title}
              </h2>
              <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                {content.overview.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>

            {/* Chairman message */}
            <section id="chairman" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                {content.chairmanHeading}
              </h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="shrink-0 text-center w-full md:w-48">
                  <div className="w-full aspect-square rounded-xl bg-slate-100 border text-[#1e3a8a] font-heading font-bold flex items-center justify-center mb-4 overflow-hidden relative">
                    <User className="w-20 h-20 text-slate-300" />
                  </div>
                  <p className="font-bold text-[#1e3a8a]">
                    {content.chairman.name}
                  </p>
                  <p className="text-sm text-[#475569]">
                    {content.chairman.designation}
                  </p>
                </div>
                <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
                  {content.chairman.message.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </section>

            {/* Programs */}
            <section id="programs" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Programs Offered
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.programs.length > 0 ? (
                  content.programs.map((program) => (
                    <div
                      key={program.name}
                      className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <GraduationCap className="w-8 h-8 text-[#0ea5e9] mb-4" />
                      <h3 className="font-bold text-[#1e3a8a] text-lg mb-4">
                        {program.name}
                      </h3>
                      <div className="space-y-1 text-sm text-slate-500">
                        <p>Duration: {program.duration}</p>
                        <p>Credit Hours: {program.credits}</p>
                      </div>
                    </div>
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
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Faculty Members
              </h2>
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-2 scrollbar-thin">
                {content.facultyMembers.length > 0 ? (
                  content.facultyMembers.map((member) => (
                    <Link
                      key={member.slug || member.name}
                      href={`/faculty/${member.slug}`}
                      className="shrink-0 w-70 snap-start bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#0ea5e9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-5 group-hover:bg-[#0ea5e9]/10 transition-colors overflow-hidden border-4 border-white shadow-sm shrink-0">
                        {member.imageUrl ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_BASE_ASSET_URL || "https://mehedihasantuhen.com"}${member.imageUrl}`}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-10 h-10 text-slate-400 group-hover:text-[#0ea5e9] transition-colors" />
                        )}
                      </div>

                      <h3 className="font-bold text-[#1e3a8a] text-[17px] leading-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                        {member.name}
                      </h3>

                      <p className="text-[13px] font-semibold text-slate-600 mb-3 line-clamp-2 px-2">
                        {member.designation}
                      </p>

                      <div className="mt-auto w-full flex flex-col items-center">
                        {member.specialization && (
                          <p className="text-xs text-muted-foreground line-clamp-2 pt-4 border-t border-slate-100 w-full">
                            {member.specialization}
                          </p>
                        )}

                        <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity">
                          View Profile <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  ))
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

            {/* Events & Notices */}
            <section id="events" className="scroll-mt-24">
              <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
                Events & Notices
              </h2>
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                {content.notices && content.notices.length > 0 ? (
                  <div className="grid gap-4">
                    {content.notices.map((notice, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-slate-100 bg-slate-50 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <span className="inline-block px-2 py-1 bg-[#0ea5e9]/10 text-[#0ea5e9] text-xs font-semibold rounded-md mb-2">
                            {notice.type}
                          </span>
                          <h3 className="font-bold text-[#1e3a8a]">
                            {notice.title}
                          </h3>
                        </div>
                        <div className="text-sm font-medium text-slate-500 shrink-0">
                          {notice.date}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    No upcoming events or notices.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
