import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
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

/**
 * A club as a profile card: cover on top, a round logo overlapping it, then
 * name, department, a short bio and the club's social channels.
 * The whole card is one link, so the social chips are icons, not anchors.
 */
export default function ClubCard({ club, eager = false }: { club: Club; eager?: boolean }) {
  const { department } = club;
  const channels = toItems(club.socialLinks).filter((s) => s.url);

  return (
    <Link
      href={`/clubs/${club.slug}`}
      aria-label={`View ${club.name} profile`}
      className="reveal group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lg shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-2xl hover:shadow-primary/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      {/* Cover */}
      <div className="relative aspect-[27/10] overflow-hidden bg-muted">
        <CoverImage
          src={club.bannerImage}
          alt={`${club.name} banner`}
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          eager={eager}
          className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          fallback={BANNER_FALLBACK}
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
        {department?.shortName && (
          <span className="absolute top-3 right-3 rounded-full bg-primary/85 px-2.5 py-1 text-[0.65rem] font-bold tracking-wider text-primary-foreground uppercase shadow-md backdrop-blur-sm">
            {department.shortName}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative -mt-11 flex justify-center">
        <div className="flex size-22 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl ring-4 ring-card transition-transform duration-300 group-hover:scale-105">
          <FallbackImage
            src={club.logo}
            alt={`${club.name} logo`}
            width={88}
            height={88}
            className="size-full object-contain p-2"
            fallback={<span className="font-heading text-xl font-bold text-primary">{initials(club.name)}</span>}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-3 pb-5 text-center">
        <h3 className="line-clamp-2 font-heading text-lg leading-snug font-bold text-foreground capitalize transition-colors group-hover:text-primary">
          {club.name}
        </h3>
        {department && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground" title={department.name}>
            {department.name}
          </p>
        )}

        {club.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{club.description}</p>
        )}

        <div aria-hidden className="min-h-4 flex-1" />

        {channels.length > 0 && (
          <ul className="mb-4 flex flex-wrap justify-center gap-1.5" aria-label="Social channels">
            {channels.map(({ key, label, Icon }) => (
              <li
                key={key}
                title={label}
                className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/60 text-foreground/70"
              >
                <Icon className="size-3.5" />
                <span className="sr-only">{label}</span>
              </li>
            ))}
          </ul>
        )}

        <span className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary/8 text-sm font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          View profile
          <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
