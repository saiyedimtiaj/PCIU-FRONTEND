import { getDepartmentBySlug } from "@/actions/departments";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Mail, MapPin, User } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

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
    notFound();
  }

  const facultyMembers = dept.facultyMembers || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Hero Header */}
      <section className="relative w-full py-20 px-4 md:px-8 overflow-hidden bg-gradient-to-r from-[#1e3a8a] via-[#2B355A] to-[#0ea5e9]">
        <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e3a8a]/40" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <Link
            href={`/department/${slug}`}
            className="inline-flex items-center text-sm font-semibold text-white/70 hover:text-white transition-colors mb-8 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Department
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight">
              Faculty Members
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
              Meet our distinguished faculty members of the {dept.hero.title},
              dedicated to academic excellence and innovative research.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
        {/* Teachers Grid */}
        {facultyMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facultyMembers.map((member) => (
              <Card
                key={member.id}
                className="group h-full flex flex-col bg-white border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 overflow-hidden relative rounded-2xl"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1e3a8a] to-[#0ea5e9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 z-10" />
                
                {/* Background Decor */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#0ea5e9]/5 rounded-full blur-2xl group-hover:bg-[#0ea5e9]/10 transition-colors duration-500" />

                <CardContent className="pt-10 pb-6 px-8 flex flex-col items-center flex-grow text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1e3a8a] to-[#0ea5e9] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 translate-y-2" />
                    <Avatar className="w-32 h-32 border-4 border-white shadow-md font-heading text-slate-500 bg-slate-50 group-hover:scale-105 transition-transform duration-500 relative">
                      <AvatarImage
                        src={getMediaUrl(member.imageUrl) || ""}
                        alt={member.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-slate-100 text-4xl font-bold group-hover:text-[#0ea5e9] transition-colors">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <h3 className="font-bold text-[#1e3a8a] text-xl leading-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                    {member.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-sm font-bold text-[#0ea5e9] bg-[#0ea5e9]/10 px-4 py-1.5 rounded-full inline-block">
                      {member.designation}
                    </span>
                  </div>
                  
                  {member.specialization && (
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 mt-auto leading-relaxed px-2">
                      {member.specialization}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="px-8 pb-8 pt-0 mt-auto w-full relative z-10">
                  <Link href={`/faculty/${member.id}`} className="w-full">
                    <Button
                      variant="outlineAccent"
                      className="w-full h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-[#0ea5e9] hover:text-white hover:border-[#0ea5e9] hover:shadow-lg hover:shadow-[#0ea5e9]/25 transition-all duration-300 font-bold"
                    >
                      View Profile <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full bg-white border border-slate-100 shadow-sm rounded-3xl p-16 text-center flex flex-col items-center justify-center mt-8">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50/50">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#1e3a8a] font-heading mb-3">No Faculty Members Found</h3>
            <p className="text-slate-500 text-lg max-w-md">
              There are currently no faculty members listed for this department. Check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
