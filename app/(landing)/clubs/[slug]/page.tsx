import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, Building2, CalendarDays, Globe, Sparkles } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Button } from "@/components/ui/button";
import { getClub, getClubs } from "@/lib/api/clubs";
import SocialLinks from "../_ui/SocialLinks";

export async function generateStaticParams() {
  const clubs = await getClubs();
  return (clubs ?? []).map((club) => ({ slug: club.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getClub(slug);
  if (!detail) return { title: "Club not found | Port City International University" };
  return {
    title: `${detail.club.name} | Clubs & Forums | Port City International University`,
    description: detail.club.description.slice(0, 160) || `${detail.club.name} at Port City International University.`,
  };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getClub(slug);
  if (!detail) notFound();
  const { club, activities } = detail;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero: banner image under a brand-tinted overlay */}
      <section className="relative overflow-hidden bg-primary">
        {club.bannerImage && (
          <Image src={club.bannerImage} alt="" fill preload sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/85 to-primary/60" />
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
            <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 bg-white shadow-2xl md:size-32">
              {club.logo ? (
                <Image src={club.logo} alt={`${club.name} logo`} width={128} height={128} className="size-full object-contain p-2" />
              ) : (
                <Sparkles className="size-10 text-primary" />
              )}
            </div>
            <div className="min-w-0 flex-1 text-primary-foreground">
              {club.department && (
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Building2 className="size-3.5" />
                  {club.department}
                </span>
              )}
              <h1 className="font-heading text-3xl font-bold leading-tight md:text-5xl">{club.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {club.website && (
                  <Button
                    variant="highlight"
                    size="cta"
                    render={<a href={club.website} target="_blank" rel="noopener noreferrer" />}
                    nativeButton={false}
                  >
                    <Globe className="size-4" />
                    Visit Website
                  </Button>
                )}
                <SocialLinks links={club.socialLinks} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumb items={[{ label: "Clubs & Forums", href: "/clubs" }, { label: club.name }]} />

      <main className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-3 lg:py-16">
        <section className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">About the club</p>
            <h2 className="font-heading text-2xl font-bold text-foreground">Who we are</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {club.description || "More about this club is coming soon."}
            </p>
          </div>
        </section>

        <section className="lg:col-span-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">What we do</p>
          <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">Activities</h2>

          {activities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
              <CalendarDays className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No activities have been posted yet.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {activity.coverImage && (
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={activity.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                      {activity.type && (
                        <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-semibold text-accent-foreground">
                          {activity.type}
                        </span>
                      )}
                      {activity.date && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="size-3.5" />
                          {activity.date}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-base font-semibold leading-snug text-foreground">{activity.title}</h3>
                    {activity.description && (
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{activity.description}</p>
                    )}
                    {activity.url && (
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary hover:underline"
                      >
                        Read more
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
