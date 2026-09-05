import Image from "next/image";
import { Calendar, GraduationCap, Users } from "lucide-react";

export default function RoutineInfoBar({
  title,
  department,
  batch,
  section,
}: {
  title: string;
  department: string;
  batch: string;
  section: string;
}) {
  return (
    <div className="rounded-t-lg border-b border-[#0D2B45]/10 bg-[#F6FAFF] px-4 py-5 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image
          src="/images/pciu-logo.png"
          alt="PCIU logo"
          width={48}
          height={48}
          className="h-12 w-12 object-contain"
        />
        <h3 className="font-heading text-xl font-bold text-[#0D2B45] sm:text-2xl">{title}</h3>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-[#0D2B45]">
          <GraduationCap className="size-4 text-[#059669]" />
          Program: {department}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-[#0D2B45]">
          <Users className="size-4 text-[#059669]" />
          Section: {section}
        </span>
        <span className="flex items-center gap-1.5 font-medium text-[#0D2B45]">
          <Calendar className="size-4 text-[#059669]" />
          Batch: {batch}
        </span>
      </div>
    </div>
  );
}
