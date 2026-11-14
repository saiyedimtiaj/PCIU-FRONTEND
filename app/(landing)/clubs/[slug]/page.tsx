import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Building2, Globe, Info, Layers, Share2 } from "lucide-react";
import { HeroBackdrop, HeroBreadcrumb } from "@/components/shared/HeroBackdrop";
import { Button } from "@/components/ui/button";
import { getClub, getClubs } from "@/lib/api/clubs";
import FallbackImage, { CoverImage } from "@/components/shared/FallbackImage";
import SocialLinks, { toItems } from "../_ui/SocialLinks";
import ClubCard, { BANNER_FALLBACK, initials } from "../_ui/ClubCard";
import ClubActivities from "../_ui/ClubActivities";

type Props = { params: Promise<{ slug: string }> };

// Clubs known at build time are pre-rendered; a club added later from the
// admin panel renders on first request (dynamicParams defaults to true) and
// the "clubs" cache tag refreshes both on every admin save.
export async function generateStaticParams() {
  const clubs = await getClubs();
  return (clubs ?? []).map((club) => ({ slug: club.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getClub(slug);
  if (!detail) return { title: "Club not found | Port City International University" };
  const { club } = detail;
  const description = club.description.slice(0, 160) || `${club.name} at Port City International University.`;
  const image = club.bannerImage ?? club.logo;
  return {
    title: `${club.name} | Clubs & Forums | Port City International University`,
    description,
    alternates: { canonical: `/clubs/${club.slug}` },
    openGraph: {
      title: club.name,
      description,
      type: "website",
      ...(image && /^https?:\/\//.test(image) ? { images: [{ url: image }] } : {}),
    },
  };
}

const hostOf = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");

export default async function ClubPage({ params }: Props) {
  const { slug } = await params;
  const [detail, allClubs] = await Promise.all([getClub(slug), getClubs()]);
  if (!detail) notFound();
  const { club, activities } = detail;
  const { department } = club;
  const liveChannels = toItems(club.socialLinks).filter((s) => s.url).length;

  // Same department first, then the rest, in admin order.
  const others = (allClubs ?? []).filter((c) => c.id !== club.id);
  const related = [
    ...others.filter((c) => department && c.department?.name === department.name),
    ...others.filter((c) => !department || c.department?.name !== department.name),
  ].slice(0, 3);

  const stats: { icon: ReactNode; label: string; value: ReactNode }[] = [
    { icon: <Layers className="size-4" />, label: activities.length === 1 ? "Activity" : "Activities", value: activities.length },
    { icon: <Share2 className="size-4" />, label: "Social channels", value: liveChannels },
    ...(department
      ? [{ icon: <Building2 className="size-4" />, label: "Department", value: department.shortName ?? department.name }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Cover ---------- */}
      <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
        <HeroBackdrop />
        <div className="container mx-auto px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-28">
          <HeroBreadcrumb items={[{ label: "Clubs & Forums", href: "/clubs" }, { label: club.name }]} />

          {/* Banner shown whole (never cropped) over a blurred copy of itself */}
          <div className="mt-6 rounded-[2rem] border border-primary-foreground/10 bg-primary-foreground/5 p-1.5 shadow-2xl shadow-black/25 backdrop-blur-sm sm:p-2 md:mt-8">
            <div className="relative aspect-[27/10] overflow-hidden rounded-[1.6rem] bg-primary-foreground/5">
              <CoverImage
                src={club.bannerImage}
                alt={`${club.name} banner`}
                sizes="(min-width: 1536px) 1440px, (min-width: 1280px) 1200px, 100vw"
                preload
                fallback={BANNER_FALLBACK}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Profile header, pulled up over the cover ---------- */}
      <div className="relative z-10 container mx-auto -mt-16 px-4 md:-mt-20 md:px-8">
        <header className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 sm:p-7 lg:px-10">
          <div className="flex flex-col items-center gap-5 text-center lg:flex-row lg:items-end lg:gap-8 lg:text-left">
            <div className="-mt-16 flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-2xl ring-6 ring-card sm:-mt-20 sm:size-32 lg:-mt-24 lg:size-40">
              <FallbackImage
                src={club.logo}
                alt={`${club.name} logo`}
                width={160}
                height={160}
                preload
                className="size-full object-contain p-3"
                fallback={<span className="font-heading text-4xl font-bold text-primary">{initials(club.name)}</span>}
              />
            </div>

            <div className="min-w-0 flex-1">
              {department?.shortName && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[0.7rem] font-bold tracking-[0.15em] text-accent-foreground uppercase">
                  <Building2 aria-hidden className="size-3.5" />
                  {department.shortName}
                </span>
              )}
              <h1 className="mt-2 font-heading text-2xl leading-tight font-bold text-foreground capitalize sm:text-3xl lg:text-4xl">
                {club.name}
              </h1>
              {department && <p className="mt-1 text-sm text-muted-foreground md:text-base">{department.name}</p>}
            </div>

            <div className="flex flex-col items-center gap-3 lg:items-end lg:pb-1">
              <SocialLinks links={club.socialLinks} tone="light" className="justify-center lg:justify-end" />
              {club.website && (
                <Button
                  variant="highlight"
                  size="cta"
                  render={<a href={club.website} target="_blank" rel="noopener noreferrer" />}
                  nativeButton={false}
                >
                  <Globe className="size-4" />
                  Visit website
                </Button>
              )}
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted/50 p-3 last:odd:col-span-2 sm:p-4 sm:last:odd:col-span-1"
              >
                <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  {s.icon}
                </span>
                <div className="flex min-w-0 flex-col-reverse">
                  <dt className="text-xs text-muted-foreground">{s.label}</dt>
                  <dd className="truncate font-heading text-lg font-bold text-foreground tabular-nums">{s.value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </header>
      </div>

      {/* ---------- Body ---------- */}
      <main className="container mx-auto grid gap-8 px-4 py-12 md:px-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="about-heading" className="relative overflow-hidden rounded-3xl border border-border bg-card p-6">
            <div aria-hidden className="absolute -top-16 -right-16 size-40 rounded-full bg-accent/10 blur-2xl" />
            <h2 id="about-heading" className="relative flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              <Info aria-hidden className="size-4.5 text-accent" />
              About
            </h2>
            <p className="relative mt-3 text-sm leading-relaxed wrap-break-word whitespace-pre-line text-muted-foreground">
              {club.description || "More about this club is coming soon."}
            </p>

            {department && (
              <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 p-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-xs font-bold text-primary-foreground">
                  {department.shortName ?? initials(department.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Organised under</p>
                  <p className="text-sm leading-snug font-semibold text-foreground">{department.name}</p>
                </div>
              </div>
            )}
          </section>

          <section
            aria-labelledby="connect-heading"
            className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20"
          >
            <div aria-hidden className="absolute -right-12 -bottom-12 size-40 rounded-full border border-primary-foreground/10" />
            <div aria-hidden className="absolute -right-4 -bottom-4 size-24 rounded-full border border-primary-foreground/10" />
            <p className="relative mb-1 text-xs font-semibold tracking-[0.2em] text-accent uppercase">Stay in touch</p>
            <h2 id="connect-heading" className="relative font-heading text-lg font-bold">
              Connect with us
            </h2>
            <p className="relative mt-1.5 text-sm leading-relaxed text-primary-foreground/70">
              Follow the club for event updates, announcements and highlights.
            </p>
            <SocialLinks links={club.socialLinks} className="relative mt-4" />
            {club.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-4 flex items-center justify-between gap-3 rounded-2xl bg-primary-foreground/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/15"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Globe className="size-4 shrink-0 text-accent" aria-hidden />
                  <span className="truncate">{hostOf(club.website)}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0" aria-hidden />
              </a>
            )}
          </section>
        </aside>

        <section aria-labelledby="activities-heading" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">What we do</p>
              <h2 id="activities-heading" className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                Club activities
              </h2>
            </div>
            {activities.length > 0 && (
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary tabular-nums">
                {activities.length} total
              </span>
            )}
          </div>
          <ClubActivities activities={activities} />
        </section>
      </main>

      {/* ---------- More clubs ---------- */}
      {related.length > 0 && (
        <section aria-labelledby="more-heading" className="border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-12 md:px-8 md:py-16">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-1.5 text-xs font-semibold tracking-[0.2em] text-accent uppercase">Keep exploring</p>
                <h2 id="more-heading" className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                  More clubs
                </h2>
              </div>
              <Button variant="outlineAccent" render={<Link href="/clubs" />} nativeButton={false}>
                View all clubs
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <li key={c.id}>
                  <ClubCard club={c} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
