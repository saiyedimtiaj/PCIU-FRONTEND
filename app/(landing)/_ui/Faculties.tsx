import { getFaculties } from "@/lib/api/home";
import { getFacultyMeta } from "@/lib/data/faculty-departments";
import FacultyCard from "./FacultyCard";

export default async function Faculties() {
  const faculties = await getFaculties();

  if (faculties.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24" id="faculties">
      {/* Crescent-shaped glow behind the heading — layered for more depth */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-140px] h-[420px] w-[1100px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 550px 300px at center, hsl(210 80% 78% / 0.85), hsl(210 75% 85% / 0.5) 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-100px] h-[320px] w-[750px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 380px 200px at center, hsl(42 85% 78% / 0.7), transparent 68%)",
            filter: "blur(40px)",
          }}
        />
        {/* Thin gold arc tracing the crescent's lower edge */}
        <svg
          className="absolute left-1/2 top-[80px] -translate-x-1/2"
          width="820"
          height="60"
          viewBox="0 0 820 60"
          fill="none"
        >
          <path
            d="M10 5 Q410 75 810 5"
            stroke="url(#crescent-arc)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.5"
          />
          <defs>
            <linearGradient id="crescent-arc" x1="0" y1="0" x2="820" y2="0">
              <stop offset="0%" stopColor="hsl(210 70% 80%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(42 80% 60%)" />
              <stop offset="100%" stopColor="hsl(210 70% 80%)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
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