import FallbackImage, { CoverImage } from "@/components/shared/FallbackImage";
import type { SportsTeam } from "@/types/sports";
import SportIcon from "./SportIcon";

/** Initials for a team with no logo: "PCIU Chess Team" → "PC". */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/**
 * One team. Not a link: the API has no per-team detail endpoint yet, so
 * there's nowhere real to send "Explore team" — add one when it exists.
 */
export default function TeamCard({ team, eager = false }: { team: SportsTeam; eager?: boolean }) {
  return (
    <article
      aria-labelledby={`team-${team.id}`}
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15"
    >
      {/* Banner shown whole (object-contain over a blurred copy), never cropped */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <CoverImage
          src={team.banner}
          alt={`${team.name} banner`}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          eager={eager}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary via-primary-glow to-secondary">
              <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[18px_18px] text-white opacity-15" />
              <span className="relative flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/25">
                <SportIcon sport={team.sport} className="size-7" />
              </span>
            </div>
          }
        />
        <div aria-hidden className="absolute inset-0 rounded-xl ring-1 ring-black/5 ring-inset" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-primary/85 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide text-primary-foreground shadow-md backdrop-blur-sm">
          <SportIcon sport={team.sport} className="size-3.5 text-accent" />
          {team.sportLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pt-4 pb-2.5">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <FallbackImage
              src={team.logo}
              alt={`${team.name} logo`}
              width={48}
              height={48}
              className="size-full object-contain p-1"
              fallback={<span className="font-heading text-sm font-bold text-primary">{initials(team.name)}</span>}
            />
          </div>
          <div className="min-w-0">
            <h3
              id={`team-${team.id}`}
              className="line-clamp-2 font-heading text-base leading-snug font-bold text-foreground capitalize transition-colors group-hover:text-primary"
            >
              {team.name}
            </h3>
            {team.type && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground capitalize">{team.type}</p>
            )}
          </div>
        </div>

        {team.description && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground first-letter:uppercase">
            {team.description}
          </p>
        )}
      </div>
    </article>
  );
}
