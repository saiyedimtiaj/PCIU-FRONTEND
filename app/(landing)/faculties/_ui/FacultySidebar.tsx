"use client";

import Link from "next/link";
import { iconMap } from "@/lib/icons";
import { useParams } from "next/navigation";

export interface SidebarFaculty {
  id: number;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
  departments: { id: number; name: string }[];
}

export function FacultySidebar({
  faculties,
  activeSlug: customActiveSlug,
}: {
  faculties: SidebarFaculty[];
  activeSlug?: string;
}) {
  const params = useParams();
  const activeSlug = customActiveSlug || (params?.slug as string);

  return (
    <nav
      aria-label="Select a faculty"
      className="flex items-center justify-start sm:justify-center gap-2.5 sm:gap-3 overflow-x-auto py-1 px-1 scrollbar-none"
    >
      {faculties.map((faculty) => {
        const FIcon = iconMap[faculty.icon as keyof typeof iconMap];
        const isActive = faculty.slug === activeSlug;
        return (
          <Link
            key={faculty.id}
            href={`/faculties/${faculty.slug}`}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary bg-primary text-white shadow-xs"
                : "border-primary/15 bg-white text-primary hover:bg-primary/5"
            }`}
          >
            {FIcon && <FIcon className="h-4 w-4 shrink-0" aria-hidden />}
            <span>{faculty.shortName}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export const FacultyNav = FacultySidebar;
