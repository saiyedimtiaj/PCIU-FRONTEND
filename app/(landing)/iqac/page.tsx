import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Target,
  ClipboardCheck,
  Mail,
  Building2,
  Quote,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActivitiesGallery from "./_ui/ActivitiesGallery";
import ResourcesContact from "./_ui/ResourcesContact";
import pageData from "@/content/iqac/page.json";
import { getIqacActivities, getIqacGallery, getIqacPage } from "@/lib/api/iqac";
import type { IqacPageContent, IqacPerson } from "@/types/iqac";

const content = pageData as IqacPageContent;

export const metadata: Metadata = {
  title: "IQAC | Port City International University",
  description:
    "Institutional Quality Assurance Cell — ensuring excellence in teaching, learning, and research at Port City International University.",
};


const RICH_TEXT =
  "space-y-3 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline";

const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "24px 24px",
};

const JUMP_LINKS = [
  { href: "#about", label: "About" },
  { href: "#director", label: "Director" },
  { href: "#committee", label: "Committee" },
  { href: "#activities", label: "Activities" },
  { href: "#gallery", label: "Gallery" },
  { href: "#resources", label: "Resources" },
];

function initial(name: string) {
  return name.replace(/^((Prof|Dr|Engr|Mr|Mrs|Ms)\.\s*)+/g, "").charAt(0).toUpperCase();
}

function Avatar({ person, className }: { person: IqacPerson; className: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center shrink-0 ${className}`}
    >
      {person.image ? (
        <Image src={person.image} alt={person.name} fill sizes="160px" className="object-cover" />
      ) : (
        initial(person.name)
      )}
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-6 md:mb-8 text-center ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover mb-2">{eyebrow}</p>
      <h2 className="font-heading font-bold text-[22px] sm:text-2xl md:text-3xl leading-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

export default async function IqacPage() {
  const [data, activities, gallery] = await Promise.all([
    getIqacPage(),
    getIqacActivities(),
    getIqacGallery(),
  ]);
  const director = data.director;
  const hasDirectorMessage = Boolean(data.directorMessageHtml || data.directorMessage.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
        <ClipboardCheck className="pointer-events-none absolute -right-10 -bottom-10 size-64 text-white/5 md:size-96" />
        <div className="container relative z-10 mx-auto px-4 pt-16 pb-28 md:pt-20 md:pb-32 text-center">
          <Badge variant="accent" className="mb-4">
            Quality Assurance
          </Badge>
          <h1 className="font-heading font-bold text-[28px] leading-tight sm:text-4xl lg:text-5xl text-white mb-4 wrap-anywhere">
            {data.title}
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto wrap-anywhere">
            {data.subtitle}
          </p>
          <nav aria-label="On this page" className="mt-8 flex flex-wrap justify-center gap-2">
            {JUMP_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* About + vision/mission, overlapping the hero */}
      <section id="about" className="container mx-auto px-4 -mt-16 relative z-10 scroll-mt-24">
        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">About IQAC</h2>
            </div>
            {data.aboutHtml ? (
              <div
                className={`text-sm sm:text-[15px] text-muted-foreground leading-relaxed ${RICH_TEXT}`}
                dangerouslySetInnerHTML={{ __html: data.aboutHtml }}
              />
            ) : (
              <div className="space-y-4 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {data.about.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            {[
              { icon: Eye, title: "Our Vision", body: data.vision },
              { icon: Target, title: "Our Mission", body: data.mission },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-accent" />
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-accent-light text-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives */}
      {data.objectives.length > 0 && (
        <section className="container mx-auto px-4 py-10 md:py-14">
          <SectionTitle eyebrow="What we work towards" title="Our Objectives" />
          <ol className="grid sm:grid-cols-[repeat(auto-fit,minmax(260px,380px))] justify-center gap-4">
            {data.objectives.map((obj, i) => (
              <li
                key={i}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5 font-heading text-lg font-bold text-primary tabular-nums transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-2 text-sm text-foreground/80 leading-relaxed">{obj}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Director's message */}
      {(director || hasDirectorMessage) && (
        <section id="director" className="bg-muted/40 border-y border-border py-10 md:py-14 scroll-mt-24">
          <div className="container mx-auto px-4">
            <SectionTitle eyebrow="A word from the head" title="Message from the Director" />
            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-lg md:grid md:grid-cols-[320px_1fr]">
              {director && (
                <div className="relative flex flex-col items-center justify-center bg-linear-to-br from-primary to-secondary p-6 text-center text-primary-foreground">
                  <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
                  {/* A large portrait rather than a small circle */}
                  <div className="relative aspect-4/5 w-full max-w-60 md:max-w-none overflow-hidden rounded-2xl bg-white/10 shadow-xl ring-4 ring-white/15">
                    {director.image ? (
                      <Image
                        src={director.image}
                        alt={director.name}
                        fill
                        sizes="(min-width: 768px) 272px, 240px"
                        className="object-cover object-top"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-heading text-6xl font-bold text-white">
                        {initial(director.name)}
                      </span>
                    )}
                  </div>
                  <p className="relative mt-4 font-heading font-semibold text-lg leading-snug">
                    {director.name}
                  </p>
                  <p className="relative mt-1 text-xs font-semibold uppercase tracking-wide text-accent">
                    Director, IQAC
                  </p>
                  {director.designation && (
                    <p className="relative mt-1 text-sm text-primary-foreground/75">{director.designation}</p>
                  )}
                  {director.href && (
                    <Link
                      href={director.href}
                      className="group relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium hover:bg-white hover:text-primary"
                    >
                      View profile
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              )}
              <div className="relative p-6 sm:p-8 md:p-10">
                <Quote className="mb-4 size-10 text-accent" />
                {data.directorMessageHtml ? (
                  <div
                    className={`text-sm sm:text-[15px] text-muted-foreground leading-relaxed ${RICH_TEXT}`}
                    dangerouslySetInnerHTML={{ __html: data.directorMessageHtml }}
                  />
                ) : (
                  <div className="space-y-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                    {data.directorMessage.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
                {director?.email && (
                  <a
                    href={`mailto:${director.email}`}
                    className="mt-6 inline-flex max-w-full items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Mail className="size-4 shrink-0" />
                    <span className="truncate">{director.email}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Committee */}
      <section id="committee" className="container mx-auto px-4 py-10 md:py-14 scroll-mt-24">
        <SectionTitle eyebrow="The people behind it" title="IQAC Committee" />
        {data.committee.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(200px,260px))] justify-center gap-3 sm:gap-6">
            {data.committee.map((member, i) => {
              const card = (
                <div className="flex h-full flex-col items-center rounded-2xl border border-border bg-card p-4 sm:p-6 text-center transition-all group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg">
                  <Avatar
                    person={member}
                    className="size-16 sm:size-24 text-xl sm:text-2xl ring-4 ring-primary/5"
                  />
                  {member.role && (
                    <span className="mt-3 sm:mt-4 rounded-full bg-accent-light px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-foreground">
                      {member.role}
                    </span>
                  )}
                  <p className="mt-2 text-sm sm:text-base font-semibold text-foreground leading-snug wrap-break-word group-hover:text-primary">
                    {member.name}
                  </p>
                  {member.designation && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{member.designation}</p>
                  )}
                  {member.department && (
                    <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground/80 line-clamp-2">
                      {member.department}
                    </p>
                  )}
                  {member.href && (
                    <p className="mt-auto pt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      View profile
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  )}
                </div>
              );
              const key = `${member.name}-${i}`;
              return member.href ? (
                <Link key={key} href={member.href} className="group block">
                  {card}
                </Link>
              ) : (
                <div key={key} className="group">
                  {card}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
            Committee members will be announced soon.
          </p>
        )}
      </section>

      <ActivitiesGallery activities={activities} gallery={gallery} />

      <ResourcesContact
        documents={content.documents}
        notices={content.notices}
        quickLinks={content.quickLinks}
        contact={content.contact}
      />
    </div>
  );
}
