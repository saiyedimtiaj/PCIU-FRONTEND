import type { ReactNode } from "react";
import { Medal, Trophy } from "lucide-react";
import { HeroBackdrop, HeroBreadcrumb } from "@/components/shared/HeroBackdrop";
import { cn } from "@/lib/utils";
import type { SportsTeam } from "@/types/sports";
import SportIcon from "./SportIcon";

/**
 * Banner, breadcrumb and live stats for /sports, in the clubs hero style.
 * The page pulls the team grid up over the bottom padding.
 */
export default function SportsHero({ teams }: { teams: SportsTeam[] | null }) {
  // Distinct sports, in team sort order.
  const sports = teams
    ? [...new Map(teams.filter((t) => t.sport).map((t) => [t.sport, t.sportLabel])).entries()]
    : [];

  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <HeroBackdrop />
      {/* Oversized trophy watermark, desktop only */}
      <Trophy
        aria-hidden
        strokeWidth={0.75}
        className="pointer-events-none absolute top-1/2 right-[4%] -z-10 hidden size-80 -translate-y-1/2 rotate-12 text-primary-foreground/6 xl:block"
      />

      <div className="container mx-auto px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-32">
        <HeroBreadcrumb items={[{ label: "Sports Teams" }]} />

        <div className="mt-8 grid items-center gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-accent uppercase">
              <span className="flex size-6 items-center justify-center rounded-md bg-accent/15">
                <Medal aria-hidden className="size-3.5" />
              </span>
              Athletics at PCIU
            </span>
            <h1 className="mt-3 font-heading text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
              Sports <span className="text-accent">Teams</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
              Discipline, teamwork and the drive to win. Meet the teams that represent Port City
              International University in inter-university competitions.
            </p>

            {sports.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Sports played">
                {sports.map(([sport, label]) => (
                  <li
                    key={sport}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1.5 text-xs font-medium backdrop-blur-sm"
                  >
                    <SportIcon sport={sport} className="size-3.5 text-accent" />
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {teams && (
            <dl className="grid grid-cols-2 gap-2 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-2 backdrop-blur-sm lg:w-sm">
              <Stat featured icon={<Trophy className="size-4.5" />} label="Active teams" value={teams.length} />
              <Stat icon={<Medal className="size-4.5" />} label="Sports" value={sports.length} />
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
