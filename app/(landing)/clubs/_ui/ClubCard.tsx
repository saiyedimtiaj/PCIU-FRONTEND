import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Users } from "lucide-react";
import type { Club } from "@/types/clubs";
import FallbackImage, { CoverImage } from "@/components/shared/FallbackImage";
import { toItems } from "./SocialLinks";

/** Initials for a club with no logo: "PCIU Computer Club" → "PC". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export const BANNER_FALLBACK = (
  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary via-primary-glow to-secondary">
    <div className="absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[18px_18px] text-white opacity-15" />
    <span className="relative flex size-14 items-center justify-center rounded-2xl bg-accent/15 text-accent ring-1 ring-accent/25">
      <Users className="size-7" aria-hidden />
    </span>
  </div>
);

/** How many social chips to show before collapsing the rest into "+n". */
const MAX_CHANNELS = 4;

/**
 * A club as a profile card: cover on top, the logo overlapping its lower-left
 * edge with the name and department beside it, then a short bio and a footer
 * with the club's social channels. The whole card is one link, so the social
 * chips are icons, not anchors.
 */
export default function ClubCard({ club, eager = false }: { club: Club; eager?: boolean }) {
  const { department } = club;
  const channels = toItems(club.socialLinks).filter((s) => s.url);
  const shown = channels.slice(0, MAX_CHANNELS);
  const hidden = channels.length - shown.length;

  return (
    <Link
      href={`/clubs/${club.slug}`}
      aria-label={`View ${club.name} profile`}
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* Cover */}
      <div className="relative aspect-2/1 overflow-hidden bg-muted">
        <CoverImage
          src={club.bannerImage}
          alt={`${club.name} banner`}
          sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          eager={eager}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          fallback={BANNER_FALLBACK}
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/50 via-black/5 to-transparent" />
        {department?.shortName && (
          <span className="absolute top-3 left-3 rounded-full bg-black/35 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-white uppercase ring-1 ring-white/25 backdrop-blur-md">
            {department.shortName}
          </span>
        )}
        <span
          aria-hidden
          className="absolute top-3 right-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-white text-primary opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      {/* Accent line that grows on hover */}
      <span
        aria-hidden
        className="h-0.5 w-0 bg-linear-to-r from-accent to-primary transition-all duration-500 group-hover:w-full"
      />

      {/* Header: logo at the start, name + department beside it */}
      <div className="flex gap-3.5 px-5">
        <div className="relative -mt-9 flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-4 ring-card transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
          <FallbackImage
            src={club.logo}
            alt={`${club.name} logo`}
            width={72}
            height={72}
            className="size-full object-contain p-1.5"
            fallback={<span className="font-heading text-lg font-bold text-primary">{initials(club.name)}</span>}
          />
        </div>
        <div className="min-w-0 pt-2.5">
          <h3 className="line-clamp-2 font-heading text-base leading-snug font-bold text-foreground capitalize transition-colors group-hover:text-primary">
            {club.name}
          </h3>
          {department && (
            <p
              className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"
              title={department.name}
            >
              <Building2 aria-hidden className="size-3 shrink-0 text-accent" />
              <span className="truncate">{department.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-5 pt-3.5 pb-5">
        {club.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{club.description}</p>
        )}

        <div aria-hidden className="min-h-4 flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
          {shown.length > 0 ? (
            <ul className="flex items-center -space-x-1.5" aria-label="Social channels">
              {shown.map(({ key, label, Icon }) => (
                <li
                  key={key}
                  title={label}
                  className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-foreground/70"
                >
                  <Icon className="size-3" />
                  <span className="sr-only">{label}</span>
                </li>
              ))}
              {hidden > 0 && (
                <li className="flex size-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[0.62rem] font-bold text-muted-foreground">
                  +{hidden}
                </li>
              )}
            </ul>
          ) : (
            <span className="text-xs text-muted-foreground">Student club</span>
          )}

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
            View profile
            <ArrowRight
              aria-hidden
              className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
