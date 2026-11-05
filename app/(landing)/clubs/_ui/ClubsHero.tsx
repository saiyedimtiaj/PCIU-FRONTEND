import type { ReactNode } from "react";
import { Building2, Sparkles, Users } from "lucide-react";
import { HeroBackdrop, HeroBreadcrumb } from "@/components/shared/HeroBackdrop";
import { cn } from "@/lib/utils";
import type { Club } from "@/types/clubs";
import FallbackImage from "@/components/shared/FallbackImage";
import { initials } from "./ClubCard";

/**
 * Banner, breadcrumb and live stats for /clubs, in the circulars hero style.
 * The page pulls the club grid up over the bottom padding.
 */
export default function ClubsHero({ clubs }: { clubs: Club[] | null }) {
  const departments = clubs
    ? new Set(clubs.map((c) => c.department?.name).filter(Boolean)).size
    : null;
  const stack = clubs?.slice(0, 5) ?? [];
  const extra = (clubs?.length ?? 0) - stack.length;

  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <HeroBackdrop />

      <div className="container mx-auto px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-32">
        <HeroBreadcrumb items={[{ label: "Clubs & Forums" }]} />

        <div className="mt-8 grid items-center gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent/15">
                <Sparkles aria-hidden className="size-3.5" />
              </span>
              Student life at PCIU
            </span>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              Clubs <span className="text-accent">&amp;</span> Forums
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Find your people. Student-run clubs and forums where PCIU students learn, lead and
              create together beyond the classroom.
            </p>

            {stack.length > 0 && (
              <div className="mt-7 flex items-center gap-4">
                <ul className="flex -space-x-3" aria-label="Featured clubs">
                  {stack.map((club) => (
                    <li
                      key={club.id}
                      title={club.name}
                      className="flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-white shadow-md ring-1 ring-white/20"
                    >
                      <FallbackImage
                        src={club.logo}
                        alt={club.name}
                        width={44}
                        height={44}
                        className="size-full object-contain p-1"
                        fallback={<span className="text-xs font-bold text-primary">{initials(club.name)}</span>}
                      />
                    </li>
                  ))}
                  {extra > 0 && (
                    <li className="flex size-11 items-center justify-center rounded-full border-2 border-primary bg-accent text-xs font-bold text-accent-foreground">
                      +{extra}
                    </li>
                  )}
                </ul>
                <p className="text-sm text-primary-foreground/70">
                  Join a community that
                  <br className="sm:hidden" /> shares your passion
                </p>
              </div>
            )}
          </div>

          {clubs && (
            <dl className="grid grid-cols-2 gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-2 backdrop-blur-sm lg:w-sm">
              <Stat featured icon={<Users className="size-4.5" />} label="Active clubs" value={clubs.length} />
              <Stat icon={<Building2 className="size-4.5" />} label="Departments" value={departments ?? 0} />
            </dl>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
  featured = false,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl px-4 py-4",
        featured ? "bg-accent text-accent-foreground" : "bg-primary-foreground/5",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          featured ? "bg-accent-foreground/10" : "bg-accent/15 text-accent",
        )}
      >
        {icon}
      </span>
      {/* dt must precede dd in the markup; flip them visually. */}
      <div className="flex flex-col-reverse leading-tight">
        <dt className={cn("text-xs", featured ? "opacity-75" : "text-primary-foreground/70")}>{label}</dt>
        <dd className="font-heading text-2xl font-bold tabular-nums md:text-3xl">{value}</dd>
      </div>
    </div>
  );
}
