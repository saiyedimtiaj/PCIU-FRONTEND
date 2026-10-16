import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ScrollText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResearchTabs from "./_ui/ResearchTabs";
import { getResearchPage } from "@/lib/api/research";
import type { ResearchSectionId } from "@/types/research";

export const metadata: Metadata = {
  title: "Research Wing | Port City International University",
  description:
    "Advancing knowledge, innovation and impact — research centres, areas, publications, partnerships and MoUs at PCIU.",
};

const PUBLISH_LINKS = [
  {
    href: "/research/port-city-journal",
    icon: BookOpen,
    eyebrow: "ISSN 2311-3146",
    title: "Port City Journal",
    body: "Browse the peer-reviewed multidisciplinary journal and its full archive of volumes.",
  },
  {
    href: "/research/call-for-paper",
    icon: FileText,
    eyebrow: "Submissions open",
    title: "Call for Paper",
    body: "Submit original research, case studies and short communications for the next issue.",
  },
  {
    href: "/research/call-for-paper-guidelines",
    icon: ScrollText,
    eyebrow: "Before you submit",
    title: "Author Guidelines",
    body: "Manuscript structure, reference style and formatting rules for authors.",
  },
];

export default async function ResearchPage() {
  const content = await getResearchPage();

  // Sections with nothing in them yet stay out of the strip rather than
  // advertising a row of zeroes.
  const stats = (
    [
      { id: "centres", label: "Research Centres", value: content.centres.length },
      { id: "areas", label: "Research Areas", value: content.areas.length },
      { id: "publications", label: "Publications", value: content.publications.length },
      { id: "partnerships", label: "Partners", value: content.partnerships.length },
      { id: "mous", label: "MoUs Signed", value: content.mous.length },
    ] satisfies { id: ResearchSectionId; label: string; value: number }[]
  ).filter((stat) => stat.value > 0);

  const statCols = ["", "grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-2 sm:grid-cols-4", "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"][stats.length];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <Image
          src="/images/research-lab.jpg"
          alt="PCIU Research Laboratory"
          fill
          preload
          sizes="100vw"
          className="object-cover motion-safe:animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-linear-to-br from-primary/95 via-primary/85 to-secondary/70" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 pt-20 pb-28 md:pt-24 md:pb-32 text-center">
          <Badge variant="accent" className="mb-4">
            Office of Research &amp; Innovation
          </Badge>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Research Wing
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
            Advancing knowledge, innovation and impact — from coast to campus. Explore our
            centres, focus areas, published work and the partners we build it with.
          </p>
        </div>
      </section>

      {/* Live counts, overlapping the hero; each jumps to its tab. */}
      {stats.length > 0 && (
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div
          className={`mx-auto grid ${statCols} ${stats.length < 4 ? "max-w-3xl" : ""} gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-lg`}
        >
          {stats.map((stat, index) => (
            <Link
              key={stat.id}
              href={`/research?section=${stat.id}#research-sections`}
              scroll={false}
              className={`group bg-card px-4 py-5 text-center transition-colors hover:bg-muted/60 ${
                stats.length === 5 && index === 4 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <p className="font-heading font-bold text-3xl text-primary tabular-nums">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
      )}

      <div id="research-sections" className="container mx-auto px-4 py-14 scroll-mt-24">
        <Suspense fallback={null}>
          <ResearchTabs content={content} />
        </Suspense>
      </div>

      <section className="bg-muted/40 border-t border-border py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover mb-2">
              Publish with PCIU
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">
              Share your research
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PUBLISH_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-5" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {item.eyebrow}
                  </p>
                  <h3 className="font-heading font-semibold text-lg text-foreground mt-1 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
