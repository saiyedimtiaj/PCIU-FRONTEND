import Link from "next/link";
import { GraduationCap, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DepartmentContent } from "@/types/department";
import { DepartmentNav } from "./DepartmentNav";

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
                { id: "chairman", label: content.chairmanHeading || "Chairman's Message" },
                { id: "programs", label: "Programs Offered" },
                { id: "faculty", label: "Faculty Members" },
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

          {/* Faculty members */}
          <section id="faculty" className="scroll-mt-24">
            <h2 className="font-heading font-bold text-2xl text-[#1e3a8a] uppercase mb-6 pb-2 inline-block border-b-4 border-[#0ea5e9]">
              Faculty Members
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {content.facultyMembers.length > 0 ? (
                content.facultyMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="shrink-0 w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1e3a8a] text-[15px] leading-tight mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-1">
                        {member.designation}
                      </p>
                      {member.specialization && (
                        <p className="text-xs text-[#0ea5e9] mb-2">
                          {member.specialization}
                        </p>
                      )}
                      <Link
                        href={`/faculty?department=${encodeURIComponent(content.facultyQueryParam)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0ea5e9] hover:text-[#0284c7] transition-colors"
                      >
                        View Profile <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 italic">
                  No faculty members currently available.
                </div>
              )}
            </div>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}
