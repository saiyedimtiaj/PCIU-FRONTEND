import { getFaculties } from "@/lib/api/home";
import { getFacultyMeta } from "@/lib/data/faculty-departments";
import FacultyCard from "./FacultyCard";

export default async function Faculties() {
  const faculties = await getFaculties();

  if (faculties.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24" id="faculties">
     {/* Layered thin arcs behind the heading with a gentle 180-degree turn */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-24 w-[min(820px,90vw)] -translate-x-1/2"
      >
        <svg
          className="h-full w-full motion-safe:animate-arc-rotate"
          viewBox="0 0 820 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M20 6 Q410 82 800 6" stroke="hsl(42 85% 58%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.42" />
          <path d="M10 18 Q410 94 810 18" stroke="hsl(230 70% 50%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.24" />
          <path d="M28 30 Q410 102 792 30" stroke="hsl(42 85% 72%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38" />
          <path d="M45 42 Q410 108 775 42" stroke="hsl(231 77% 22%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.16" />
          <path d="M36 12 Q410 76 784 12" stroke="hsl(230 70% 50%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />
          <path d="M18 26 Q410 100 802 26" stroke="hsl(42 85% 58%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.25" />
          <path d="M54 38 Q410 106 766 38" stroke="hsl(42 85% 72%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
          <path d="M68 50 Q410 110 752 50" stroke="hsl(231 77% 22%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.12" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Our Faculties
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Explore academic excellence across diverse disciplines
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 lg:grid-cols-3">
          {faculties.map((faculty) => {
            const meta = getFacultyMeta(faculty.id);

            return (
              <FacultyCard
                key={faculty.id}
                id={faculty.id}
                name={faculty.name}
                about={faculty.about}
                departments={meta.departments}
                icon={meta.icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}