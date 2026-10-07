import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { getFaculties } from "@/app/(landing)/department/_actions/faculties";
import EmptyState from "@/components/shared/EmptyState";
import { FacultySidebar } from "./_ui/FacultySidebar";

const FACULTY_CONFIG: Record<string, { icon: string; shortName: string }> = {
  "faculty-of-science-and-engineering": {
    icon: "microscope",
    shortName: "Science & Eng.",
  },
  "faculty-of-business-studies": {
    icon: "building",
    shortName: "Business Studies",
  },
  "faculty-of-humanities-social-sciences-and-law": {
    icon: "book-open",
    shortName: "Humanities & Law",
  },
};

export const metadata: Metadata = {
  title: "Our Faculties | Port City International University",
  description:
    "Explore academic excellence across diverse disciplines at Port City International University.",
};

export default async function FacultiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const apiFaculties = await getFaculties();
  const faculties = apiFaculties || [];

  const augmentedFaculties = faculties.map((f) => ({
    ...f,
    icon: FACULTY_CONFIG[f.slug]?.icon || "graduation-cap",
    shortName: FACULTY_CONFIG[f.slug]?.shortName || f.name,
  }));

  if (augmentedFaculties.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="h-16 w-16" />}
        title="No faculty information found"
        description="Faculty information is currently unavailable. Please check back soon."
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-14 text-white sm:py-16 md:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6">
          <GraduationCap
            className="mx-auto mb-4 h-12 w-12 sm:h-14 sm:w-14"
            aria-hidden
          />
          <h1 className="font-heading text-3xl font-bold sm:text-4xl md:text-5xl">
            Our Faculties
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 sm:text-base md:text-lg">
            Explore academic excellence across diverse disciplines at Port City
            International University
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <FacultySidebar faculties={augmentedFaculties} />
            <div className="min-w-0 flex-1">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
