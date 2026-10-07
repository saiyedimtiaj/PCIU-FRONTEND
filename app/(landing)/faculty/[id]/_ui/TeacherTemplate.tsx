"use client";

import Link from "next/link";
import {
  MapPin,
  BookOpen,
  GraduationCap,
  Briefcase,
  Award,
  Link as LinkIcon,
  BookText,
  User,
  ExternalLink,
} from "lucide-react";
import {
  FaGoogleScholar,
  FaResearchgate,
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
} from "react-icons/fa6";
import type { TeacherDetails } from "@/types/teacher";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TeacherTemplate({
  teacher,
}: {
  teacher: TeacherDetails;
}) {
  const hasEducation = teacher.education && teacher.education.length > 0;
  const hasExperience = teacher.experiences && teacher.experiences.length > 0;
  const hasPublications =
    teacher.publications && teacher.publications.length > 0;
  const hasAwards = teacher.awards && teacher.awards.length > 0;
  const hasMemberships = teacher.memberships && teacher.memberships.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Hero Header */}
      <section className="relative w-full h-62.5 md:h-87.5 overflow-hidden bg-linear-to-r from-[#1e3a8a] via-[#2B355A] to-[#0ea5e9]">
        <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-10 mix-blend-overlay" />
      </section>

      {/* Main Profile Info */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Avatar className="w-48 h-48 border-8 border-white shadow-lg bg-slate-100 text-slate-400">
            <AvatarImage
              src={getMediaUrl(teacher.imageUrl) || ""}
              alt={teacher.name}
              className="object-cover"
            />
            <AvatarFallback className="text-6xl font-bold font-heading bg-slate-100 text-[#0ea5e9]">
              {getInitials(teacher.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] font-heading mb-2">
                {teacher.name}
              </h1>
              <p className="text-lg font-semibold text-[#0ea5e9]">
                {teacher.designation}
              </p>
              <p className="text-slate-600 mt-1">{teacher.department.name}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-600 font-medium pt-2">
              {teacher.office && (
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                  <MapPin className="w-4 h-4 text-[#0ea5e9]" />
                  <span>{teacher.office}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-4">
              {teacher.googleScholarUrl && (
                <Link
                  href={teacher.googleScholarUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <FaGoogleScholar className="w-5 h-5" />
                </Link>
              )}
              {teacher.researchgateUrl && (
                <Link
                  href={teacher.researchgateUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <FaResearchgate className="w-5 h-5" />
                </Link>
              )}
              {teacher.linkedinUrl && (
                <Link
                  href={teacher.linkedinUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <FaLinkedin className="w-5 h-5" />
                </Link>
              )}
              {teacher.facebookUrl && (
                <Link
                  href={teacher.facebookUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <FaFacebook className="w-5 h-5" />
                </Link>
              )}
              {teacher.twitterUrl && (
                <Link
                  href={teacher.twitterUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <FaXTwitter className="w-5 h-5" />
                </Link>
              )}
              {teacher.websiteUrl && (
                <Link
                  href={teacher.websiteUrl}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#0ea5e9] hover:text-white flex items-center justify-center transition-colors text-slate-600"
                >
                  <LinkIcon className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {teacher.shortBio && (
          <div className="mt-10 max-w-4xl mx-auto text-center px-4">
            <p className="text-slate-600 text-lg md:text-xl italic leading-relaxed">
              &quot;{teacher.shortBio}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Tabs Section */}
      <div className="container mx-auto px-4 mt-12">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto bg-transparent border-b border-slate-200 p-0 h-auto rounded-none mb-8">
            <TabsTrigger
              value="about"
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <User className="w-4 h-4 mr-2" /> About
            </TabsTrigger>
            {hasEducation && (
              <TabsTrigger
                value="education"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-2" /> Education
              </TabsTrigger>
            )}
            {hasExperience && (
              <TabsTrigger
                value="experience"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Briefcase className="w-4 h-4 mr-2" /> Experience
              </TabsTrigger>
            )}
            {hasPublications && (
              <TabsTrigger
                value="publications"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <BookText className="w-4 h-4 mr-2" /> Publications
              </TabsTrigger>
            )}
            {hasAwards && (
              <TabsTrigger
                value="awards"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Award className="w-4 h-4 mr-2" /> Awards
              </TabsTrigger>
            )}
            {hasMemberships && (
              <TabsTrigger
                value="memberships"
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#0ea5e9] data-[state=active]:text-[#1e3a8a] data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none py-4 px-6 font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Memberships
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            value="about"
            className="animate-in fade-in duration-500"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
              {teacher.bio && (
                <section>
                  <h3 className="text-xl font-bold text-[#1e3a8a] font-heading mb-4 pb-2 border-b-2 border-[#0ea5e9] inline-block">
                    Biography
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: teacher.bio }}
                    className="text-slate-600 leading-relaxed space-y-4 whitespace-pre-wrap"
                  />
                </section>
              )}
              {teacher.teachingAreas && (
                <section>
                  <h3 className="text-xl font-bold text-[#1e3a8a] font-heading mb-4 pb-2 border-b-2 border-[#0ea5e9] inline-block">
                    Teaching & Research Areas
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.teachingAreas.split(",").map((area, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 font-medium"
                      >
                        {area.trim()}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>

          {hasEducation && (
            <TabsContent
              value="education"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {teacher.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-[#0ea5e9] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-[#1e3a8a] text-lg">
                            {edu.degree}
                          </h4>
                          <span className="text-xs font-bold text-[#0ea5e9] bg-[#0ea5e9]/10 px-2 py-1 rounded-full">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-slate-600 font-medium text-sm">
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {hasExperience && (
            <TabsContent
              value="experience"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                {teacher.experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#1e3a8a]/5 text-[#1e3a8a] flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e3a8a] text-lg">
                        {exp.title}
                      </h4>
                      <p className="text-[#0ea5e9] font-medium text-sm mb-2">
                        {exp.organization}
                      </p>
                      <p className="text-slate-500 text-sm">{exp.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {hasPublications && (
            <TabsContent
              value="publications"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                {teacher.publications.map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#0ea5e9] transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {pub.type}
                        </span>
                        <span className="text-sm font-semibold text-[#0ea5e9]">
                          {pub.year}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1e3a8a] text-lg leading-tight">
                        {pub.title}
                      </h4>
                      <p className="text-slate-600 text-sm font-medium">
                        {pub.authors}
                      </p>
                      <p className="text-slate-500 text-sm italic">
                        {pub.venue}
                      </p>
                      {pub.externalLink && (
                        <div className="pt-3 mt-3 border-t border-slate-50">
                          <Link
                            href={pub.externalLink}
                            target="_blank"
                            className="inline-flex items-center text-[#0ea5e9] hover:text-[#1e3a8a] text-sm font-semibold transition-colors gap-1"
                          >
                            View Publication{" "}
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {hasAwards && (
            <TabsContent
              value="awards"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {teacher.awards.map((award, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e3a8a] mb-1">
                        {award.title}
                      </h4>
                      <p className="text-sm font-bold text-[#0ea5e9] mb-2">
                        {award.year}
                      </p>
                      {award.description && (
                        <p className="text-sm text-slate-600">
                          {award.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {hasMemberships && (
            <TabsContent
              value="memberships"
              className="animate-in fade-in duration-500"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {teacher.memberships.map((mem, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-5 rounded-xl border border-slate-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e3a8a]">
                        {mem.organization}
                      </h4>
                      <p className="text-sm text-slate-600">{mem.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
