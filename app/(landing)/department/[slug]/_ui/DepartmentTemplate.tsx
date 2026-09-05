import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  User,
  ChevronRight,
  FileText,
  Download,
  BookOpen,
  Award,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DepartmentContent } from "@/types/department";

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
            <span className="inline-block bg-[#0ea5e9] text-white text-xs font-bold px-3 py-1 rounded-full mb-6">
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
                className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white border-0 h-12 px-8 rounded-md font-semibold text-base"
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <section>
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
            <section>
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
            <section>
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
            <section>
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

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Notices */}
            <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-700/50 flex items-center gap-2">
                <FileText className="w-5 h-5 text-white" />
                <h3 className="font-bold text-white uppercase tracking-wide">
                  Latest Notices
                </h3>
              </div>
              <div className="p-0">
                {content.notices.length > 0 ? (
                  <div className="divide-y divide-slate-700/50">
                    {content.notices.map((notice) => (
                      <div
                        key={notice.title}
                        className="p-5 hover:bg-slate-800/50 transition-colors"
                      >
                        <p className="text-sm font-medium text-white mb-2 leading-snug">
                          {notice.title}
                        </p>
                        <p className="text-xs text-slate-400 mb-3">
                          {notice.date}
                        </p>
                        <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#0ea5e9] hover:text-white transition-colors">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </div>
                    ))}
                    <div className="p-5">
                      <Link
                        href="#"
                        className="text-sm text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        View all notices <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-400 italic text-sm">
                    No recent notices.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#0ea5e9] rounded-xl overflow-hidden shadow-sm text-white">
              <div className="p-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="font-bold text-lg">Quick Links</h3>
              </div>
              <div className="px-5 pb-5">
                <ul className="space-y-3">
                  {content.quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.url}
                        className="text-sm text-white/90 hover:text-white hover:pl-1 transition-all flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Us */}
            <div className="bg-[#1e40af] rounded-xl p-6 shadow-sm text-white">
              <h3 className="font-bold text-xl mb-6">Contact Us</h3>
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 text-blue-200" />
                  <div>
                    <p className="font-medium text-blue-100 mb-1">
                      {content.hero.title}
                    </p>
                    <p className="text-blue-200 leading-relaxed whitespace-pre-line">
                      {content.contact.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 shrink-0 text-blue-200" />
                  <p className="text-blue-200">{content.contact.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 shrink-0 text-blue-200" />
                  <p className="text-blue-200">{content.contact.email}</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-lg text-[#1e3a8a] mb-5 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0ea5e9]" /> Achievements
              </h3>
              <div className="space-y-4">
                {content.achievements.map((achievement) => (
                  <div
                    key={achievement.label}
                    className="bg-slate-50 rounded-xl p-5 text-center border border-slate-100"
                  >
                    <p className="text-3xl font-bold text-[#0ea5e9] mb-1">
                      {achievement.value}
                    </p>
                    <p className="text-sm font-medium text-slate-600">
                      {achievement.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
