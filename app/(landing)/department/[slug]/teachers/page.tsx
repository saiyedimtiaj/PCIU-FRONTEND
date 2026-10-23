import { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import EmptyState from "@/components/shared/EmptyState";
import { getDepartmentBySlug } from "../../_actions/departments";

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
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <EmptyState
          title="Department Not Found"
          description="The department you are looking for does not exist or has been removed."
          size="lg"
        />
      </div>
    );
  }

  const facultyMembers = dept.facultyMembers || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Premium Hero Header */}
      <section className="relative w-full py-20 px-4 md:px-8 overflow-hidden bg-linear-to-r from-[#1e3a8a] via-[#2B355A] to-[#0ea5e9]">
        <div className="absolute inset-0 bg-[url('/images/pattern-light.svg')] opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#1e3a8a]/40" />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {facultyMembers.map((member) => (
              <Link
                key={member.id}
                href={`/faculty/${member.id}`}
                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0ea5e9]/40 hover:shadow-[0_20px_40px_-20px_rgba(30,58,138,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]/40 focus-visible:ring-offset-2"
              >
                {/* Hover accent rail */}
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-linear-to-b from-[#1e3a8a] to-[#0ea5e9] transition-transform duration-300 group-hover:scale-y-100" />

                <div className="relative aspect-3/4 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 shadow-sm sm:w-28">
                  <Avatar className="size-full overflow-hidden rounded-none bg-slate-100 text-slate-300 after:hidden">
                    <AvatarImage
                      src={getMediaUrl(member.imageUrl) || ""}
                      alt={member.name}
                      className="rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <AvatarFallback className="rounded-none bg-slate-100 font-heading text-2xl font-bold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="font-heading text-base font-bold leading-snug text-[#1e3a8a] line-clamp-2 transition-colors group-hover:text-[#0c7bb3]">
                    {member.name}
                  </h3>
                  <p className="mt-1 w-fit max-w-full truncate rounded-full bg-[#0ea5e9]/10 px-2.5 py-1 text-[11px] font-semibold text-[#0c7bb3]">
                    {member.designation}
                  </p>
                  {member.specialization && (
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {member.specialization}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-[#0ea5e9] transition-all duration-300 group-hover:gap-2">
                    View Profile <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white border border-slate-100 shadow-sm rounded-3xl py-16">
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
