import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import type { Club } from "@/types/clubs";

/** Initials for a club with no logo: "PCIU Computer Club" → "PC". */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function ClubCard({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-accent">
        {club.bannerImage ? (
          <Image
            src={club.bannerImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Users className="size-12 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {club.department && (
          <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            {club.department}
          </span>
        )}
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6 pt-11">
        <div className="absolute -top-9 left-6 flex size-[4.5rem] items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-white shadow-md">
          {club.logo ? (
            <Image src={club.logo} alt={`${club.name} logo`} width={72} height={72} className="size-full object-contain p-1.5" />
          ) : (
            <span className="font-heading text-lg font-bold text-primary">{initials(club.name)}</span>
          )}
        </div>

        <h2 className="font-heading text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {club.name}
        </h2>
        {club.description && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{club.description}</p>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
          Explore club
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
