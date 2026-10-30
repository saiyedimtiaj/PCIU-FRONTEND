import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CodeXml, Globe, GraduationCap, IdCard, SquareTerminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SectionArcs from "@/components/shared/SectionArcs";
import { FacebookIcon, GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import CardMotion from "./_ui/CardMotion";
import DeveloperDetails from "./_ui/DeveloperDetails";
import { DOT_PATTERN, githubProfile, initials } from "./_ui/developer-utils";
import raw from "@/content/developers/page.json";
import { getDevelopers } from "@/lib/api/developers";
import type { Developer, DevelopersPageContent } from "@/types/developers";

const data = raw as DevelopersPageContent;

export const metadata: Metadata = {
  title: "Developers | Port City International University",
  description:
    "Meet the team that designs, builds and maintains the Port City International University website, admin dashboard and faculty portal.",
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 md:mb-14 text-center relative">
      <SectionArcs className="top-full mt-1 h-8 w-[min(420px,80vw)]" />
      <p className="relative font-mono text-xs font-semibold uppercase tracking-widest text-accent-hover mb-2">
        {eyebrow}
      </p>
      <h2 className="relative font-heading font-bold text-[22px] sm:text-2xl md:text-3xl leading-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

const SOCIAL_LINK =
  "flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground";

/** Decorative barcode bar widths derived from the name, so each card's differs but stays stable between renders. */
function barcode(seed: string) {
  return Array.from({ length: 26 }, (_, i) => (seed.charCodeAt(i % seed.length) * (i + 7)) % 3 + 1);
}

function DeveloperCard({ dev }: { dev: Developer }) {
  const github = dev.github ? githubProfile(dev.github) : null;
  const socials = [
    github && { href: github.href, label: "GitHub", Icon: GithubIcon },
    dev.linkedin && { href: dev.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    dev.facebook && { href: dev.facebook, label: "Facebook", Icon: FacebookIcon },
    dev.portfolio && { href: dev.portfolio, label: "Portfolio", Icon: Globe },
  ].filter((link) => !!link);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/15">
      {/* Clicking anywhere on the card opens the profile and work */}
      <DeveloperDetails dev={dev} />

      {/* ID-card header band with a lanyard slot */}
      <div className="relative h-20 bg-[linear-gradient(110deg,var(--primary),var(--secondary),var(--primary))] bg-size-[300%_100%] group-hover:motion-safe:animate-border-flow">
        <div className="absolute inset-0 opacity-15" style={DOT_PATTERN} />
        <span className="absolute left-1/2 top-3 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/25 shadow-inner" />
        <span className="absolute left-4 top-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          PCIU · Dev
        </span>
        <span className="absolute right-4 top-5 inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent">
          <CodeXml className="size-3.5" />
          <span className="transition-opacity duration-300 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100">
            View work
          </span>
        </span>
      </div>

      {/* Photo overlapping the band */}
      <div className="relative mx-auto -mt-11 size-22 overflow-hidden rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg ring-4 ring-card transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
        {dev.image ? (
          <Image src={dev.image} alt={dev.name} fill sizes="88px" className="object-cover object-top" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-bold text-white">
            {initials(dev.name)}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col items-center px-5 pt-3 text-center">
        <h3 className="font-heading text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {dev.name}
        </h3>
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
          <span className="size-1.5 rounded-full bg-accent-hover" />
          {dev.role}
        </span>
        {dev.about && (
          <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{dev.about}</p>
        )}
        {socials.length > 0 && (
          <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${dev.name} on ${label}`}
                className={SOCIAL_LINK}
              >
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Student ID strip */}
      <div className="relative mt-4 flex items-end justify-between gap-3 border-t border-dashed border-border bg-muted/40 px-5 py-3">
        {/* Punched notches on the tear line */}
        <span className="absolute -left-2 -top-2 size-4 rounded-full border border-border bg-background" />
        <span className="absolute -right-2 -top-2 size-4 rounded-full border border-border bg-background" />
        <div className="min-w-0 text-left">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
            {dev.studentId ? "Student ID" : "Department"}
          </p>
          <p className="mt-0.5 flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
            <IdCard className="size-3.5 shrink-0 text-accent-hover" />
            <span className="truncate">{dev.studentId ?? "CSE · PCIU"}</span>
          </p>
        </div>
        <div aria-hidden className="flex h-7 shrink-0 items-stretch gap-px opacity-70">
          {barcode(dev.name).map((width, i) => (
            <span key={i} className="bg-foreground" style={{ width }} />
          ))}
        </div>
      </div>
    </article>
  );
}

export default async function DevelopersPage() {
  const developers = await getDevelopers();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
        <div className="pointer-events-none absolute -left-24 top-10 size-80 rounded-full bg-accent/20 blur-3xl transform-gpu motion-safe:animate-drift" />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 size-96 rounded-full bg-secondary/40 blur-3xl transform-gpu motion-safe:animate-drift"
          style={{ animationDelay: "-7s" }}
        />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 text-center sm:px-6 md:pt-20 md:pb-24 lg:px-8">
          <Badge variant="accent" className="mb-4">
            <SquareTerminal />
            Behind the website
          </Badge>
          <h1 className="font-heading text-[32px] font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Meet the <span className="text-accent">Developers</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{data.intro}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              <GraduationCap className="size-4 text-accent" />
              Students of CSE, PCIU
            </span>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="accent" size="cta" nativeButton={false} render={<a href="#team" />}>
              Meet the team
              <ArrowRight />
            </Button>
            <Button variant="outlineAccent" size="cta" nativeButton={false} render={<Link href="/department/cse" />}>
              <GraduationCap />
              Department of CSE
            </Button>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8 scroll-mt-24">
        <SectionTitle eyebrow="git log --authors" title={data.team} />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,260px))] justify-center gap-5 sm:gap-6">
          {developers.map((dev, i) => (
            <CardMotion key={`${dev.name}-${i}`} index={i}>
              <DeveloperCard dev={dev} />
            </CardMotion>
          ))}
        </div>
      </section>
    </div>
  );
}
