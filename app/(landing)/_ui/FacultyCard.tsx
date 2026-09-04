import Link from "next/link";
import type { IconName } from "@/lib/icons";
import { iconMap } from "@/lib/icons";
import type { DepartmentLink } from "@/lib/data/faculty-departments";

interface FacultyCardProps {
  id: number;
  name: string;
  about: string | null;
  departments: DepartmentLink[];
  icon: IconName;
}

export default function FacultyCard({ id, name, about, departments, icon }: FacultyCardProps) {
  const Icon = iconMap[icon];

  return (
    <div className="group relative h-full transition-transform duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015]">
      <style>{`
        @keyframes pciuChase {
          to { stroke-dashoffset: -100; }
        }
      `}</style>

      {/* Card surface with a static, always-visible base border */}
      <div className="relative flex h-full flex-col rounded-2xl border border-primary/10 bg-white p-6 shadow-md transition-shadow duration-500 group-hover:shadow-2xl sm:p-7">
        {Icon && (
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform duration-500 group-hover:scale-110">
            <Icon className="h-6 w-6" />
          </div>
        )}

        <h3 className="font-heading mb-2 text-lg font-bold text-primary sm:text-xl">
          {name}
        </h3>

        {about && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {about}
          </p>
        )}

        {departments.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1.5">
            {departments.map((dept, index) =>
              dept.href ? (
                <Link
                  key={`${id}-${index}`}
                  href={dept.href}
                  className="rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-medium text-secondary transition-colors hover:bg-primary hover:text-white"
                >
                  {dept.name}
                </Link>
              ) : (
                <span
                  key={`${id}-${index}`}
                  className="rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-medium text-secondary"
                >
                  {dept.name}
                </span>
              )
            )}
          </div>
        )}

        <div className="mt-auto pt-2">
          <Link
            href={`/faculties?faculty=${id}`}
            className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:border-accent hover:text-white"
          >
            <span
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary to-primary/90 transition-transform duration-300 group-hover/btn:translate-x-0"
              aria-hidden
            />
            <span className="relative">Explore Faculty</span>
          </Link>
        </div>
      </div>

      {/* Traveling gradient light — genuinely orbits the perimeter,
          starting from one point and returning to it, via SVG
          stroke-dashoffset animation (no CSS mask involved). */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`chase-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
        <rect
          x="0.6"
          y="0.6"
          width="98.8"
          height="98.8"
          rx="8"
          ry="8"
          fill="none"
          stroke={`url(#chase-${id})`}
          strokeWidth="1.4"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="22 78"
          style={{ animation: "pciuChase 4.5s linear infinite" }}
        />
      </svg>
    </div>
  );
}