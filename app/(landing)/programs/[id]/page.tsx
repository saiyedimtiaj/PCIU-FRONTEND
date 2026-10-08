import { notFound } from "next/navigation";
import {
  GraduationCap,
  Clock,
  BookOpen,
  Banknote,
  Building,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import PageBanner from "@/components/shared/PageBanner";
import { getProgramDetails } from "@/app/(landing)/_actions/programs";

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramDetails(id);

  if (!program) {
    return notFound();
  }

  const totalTuition =
    Number(program.credit || 0) * Number(program.perCreditAmount || 0);

  const departmentName = program.department?.name;
  const facultyName = program.department?.faculty?.name;
  const subtitle = [departmentName, facultyName].filter(Boolean).join(" | ");

  return (
    <>
      <PageBanner
        title={program.title || "Program Details"}
        subtitle={subtitle}
        variant="blobs"
      />

      <section className="py-12 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-primary/5 rounded-bl-full -z-10" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-primary">
                    Program Overview
                  </h2>
                </div>

                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  The{" "}
                  <span className="font-semibold text-slate-800">
                    {program.title}
                  </span>{" "}
                  is a comprehensive {program.programType?.toLowerCase()}{" "}
                  program offered by the{" "}
                  <Link
                    href={`/department/${program.department?.slug}`}
                    className="text-secondary hover:underline font-medium"
                  >
                    {program.department?.name}
                  </Link>
                  . It is designed to equip students with in-depth knowledge and
                  practical skills required to excel in their professional
                  careers.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Duration
                      </p>
                      <p className="font-bold text-slate-800 text-lg">
                        {program.duration} Years
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">
                        Total Credits
                      </p>
                      <p className="font-bold text-slate-800 text-lg">
                        {program.credit} Credits
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Financial Info */}
              <div className="bg-linear-to-br from-primary to-[#1e3a8a] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-bold font-heading text-xl mb-6 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-accent" />
                  Tuition Details
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm">
                      Cost per Credit
                    </span>
                    <span className="font-semibold text-lg font-mono">
                      ৳{Number(program.perCreditAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/20 pb-2">
                    <span className="text-white/80 text-sm">Total Credits</span>
                    <span className="font-semibold text-lg font-mono">
                      {program.credit}
                    </span>
                  </div>
                  <div className="pt-2">
                    <span className="text-white/80 text-sm block mb-1">
                      Estimated Tuition*
                    </span>
                    <span className="font-bold text-3xl font-mono text-accent">
                      ৳{totalTuition.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 pt-2 italic leading-relaxed">
                    *Excludes admission, library, registration and other
                    semester fees. Subject to change.
                  </p>
                </div>
              </div>

              {/* Quick Navigation */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold font-heading text-lg text-primary mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-secondary" />
                  Explore More
                </h3>
                <div className="space-y-3">
                  <Link
                    href={`/department/${program.department?.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                      Visit Department
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    href={`/faculties/${program.department?.faculty?.slug}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group"
                  >
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                      Visit Faculty
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
