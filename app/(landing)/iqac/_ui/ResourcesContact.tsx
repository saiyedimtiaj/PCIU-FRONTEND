import { existsSync } from "node:fs";
import path from "node:path";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Download,
  FileText,
  FolderOpen,
  Link2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import SectionArcs from "@/components/shared/SectionArcs";
import { Button } from "@/components/ui/button";
import type { IqacPageContent } from "@/types/iqac";

const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "24px 24px",
};

const NOTICE_BAND: Record<string, string> = {
  accent: "bg-accent text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  highlight: "bg-highlight text-highlight-foreground",
};

const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(
  "Port City International University, Chattogram"
)}&output=embed`;

/** "Dec 20, 2024" -> { month: "Dec", day: "20" }, for the calendar chips. */
function splitDate(value: string) {
  const match = value.match(/^([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2})/);
  return match ? { month: match[1], day: match[2] } : { month: "", day: "—" };
}

/**
 * The document's download link, or null when there's nothing to fetch yet. A
 * local path only counts once the file is actually in public/, so a missing
 * upload shows as "Coming soon" instead of downloading a 404 page.
 */
function downloadHref(url?: string) {
  if (!url) return null;
  if (/^https?:\/\//.test(url)) return url;
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
}

function monogram(name: string) {
  return name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12 md:mb-14 text-center relative">
      <SectionArcs className="top-full mt-1 h-8 w-[min(420px,80vw)]" />
      <p className="relative text-xs font-semibold uppercase tracking-widest text-accent-hover mb-2">{eyebrow}</p>
      <h2 className="relative font-heading font-bold text-[22px] sm:text-2xl md:text-3xl leading-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

/**
 * Documents, notices and quick links as an uneven grid (wide library, stacked
 * side column) so no card trails off into empty space on desktop, then the
 * contact panel beside a live map of the campus.
 */
export default function ResourcesContact({
  documents,
  notices,
  quickLinks,
  contact,
}: Pick<IqacPageContent, "documents" | "notices" | "quickLinks" | "contact">) {
  return (
    <>
      <section id="resources" className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 scroll-mt-24">
        <SectionTitle eyebrow="Stay informed" title="Resources & Notices" />
        <div className="grid lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-7 flex flex-col rounded-3xl border border-border bg-card p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FolderOpen className="size-5" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-lg text-foreground leading-tight">
                    Document Library
                  </h3>
                  <p className="text-xs text-muted-foreground">Policies, reports and forms</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground tabular-nums">
                {documents.length} files
              </span>
            </div>
            <ul className="grid flex-1 auto-rows-fr sm:grid-cols-2 gap-3">
              {documents.map((doc) => {
                const href = downloadHref(doc.url);
                const body = (
                  <>
                    {/* A little file glyph with a folded corner and type tag */}
                    <div className="relative flex h-14 w-11 shrink-0 flex-col items-center justify-end rounded-md border border-destructive/20 bg-card pb-1.5 shadow-sm">
                      <span className="absolute top-0 right-0 size-3 rounded-bl-md border-b border-l border-destructive/20 bg-destructive/10" />
                      <FileText className="mb-1 size-4 text-destructive/70" />
                      <span className="rounded-sm bg-destructive px-1 text-[9px] font-bold leading-tight text-white">
                        {doc.type}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary">
                        {doc.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {doc.size}
                        {!href && <span className="ml-2 font-medium text-accent-hover">· Coming soon</span>}
                      </p>
                    </div>
                    {href && (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Download className="size-4" />
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={doc.name}>
                    {href ? (
                      <a
                        href={href}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Download ${doc.name} (${doc.type}, ${doc.size})`}
                        className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-muted/30 p-4 transition-all hover:border-primary/30 hover:bg-card hover:shadow-md"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="flex h-full items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-4 opacity-80">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-5 grid md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="relative flex items-center justify-between gap-3 bg-linear-to-r from-primary to-secondary px-5 py-4 sm:px-6 text-primary-foreground">
                <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
                <h3 className="relative flex items-center gap-2 font-heading font-semibold text-lg">
                  <Bell className="size-5 text-accent" />
                  Notice Board
                </h3>
                <span className="relative rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                  Latest
                </span>
              </div>
              <ul className="divide-y divide-border">
                {notices.map((notice) => {
                  const date = splitDate(notice.date);
                  return (
                    <li key={notice.title} className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
                      <div className="w-12 shrink-0 overflow-hidden rounded-lg border border-border text-center shadow-sm">
                        <p
                          className={`py-0.5 text-[10px] font-bold uppercase ${NOTICE_BAND[notice.color] ?? NOTICE_BAND.secondary}`}
                        >
                          {date.month}
                        </p>
                        <p className="bg-card py-1 font-heading text-lg font-bold leading-none text-foreground tabular-nums">
                          {date.day}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-snug">{notice.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{notice.date}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <h3 className="mb-4 flex items-center gap-2 font-heading font-semibold text-lg text-foreground">
                <Link2 className="size-5 text-primary" />
                Quick Links
              </h3>
              {quickLinks.length === 0 && (
                <p className="text-sm text-muted-foreground">Quick links will be added soon.</p>
              )}
              <ul className="grid grid-cols-2 gap-3">
                {quickLinks.map((link) => (
                  <li key={`${link.name}-${link.url}`}>
                    <a
                      href={link.url}
                      target={link.url !== "#" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex h-full items-center gap-3 rounded-2xl border border-border p-3 transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent-light font-heading text-xs font-bold text-foreground group-hover:bg-white/15 group-hover:text-white">
                        {monogram(link.name)}
                      </span>
                      <span className="min-w-0 truncate text-sm font-medium">{link.name}</span>
                      <ArrowUpRight className="ml-auto size-4 shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-secondary p-6 sm:p-10 text-primary-foreground">
            <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
            <Mail className="pointer-events-none absolute -right-8 -bottom-8 size-48 text-white/5" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Get in touch</p>
              <h2 className="mt-2 font-heading font-bold text-2xl sm:text-3xl">Contact IQAC</h2>
              <p className="mt-2 max-w-sm text-sm text-primary-foreground/75 leading-relaxed">
                Questions about quality assurance, academic audits or feedback? The IQAC office is here
                to help.
              </p>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                    <MapPin className="size-5 text-accent" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/60">
                      Office
                    </p>
                    <p className="mt-0.5 text-sm whitespace-pre-line leading-relaxed">{contact.address}</p>
                  </div>
                </li>
                <li>
                  <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="group flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition-colors group-hover:bg-accent">
                      <Phone className="size-5 text-accent group-hover:text-accent-foreground" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/60">
                        Phone
                      </p>
                      <p className="mt-0.5 text-sm">{contact.phone}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className="group flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 transition-colors group-hover:bg-accent">
                      <Mail className="size-5 text-accent group-hover:text-accent-foreground" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/60">
                        Email
                      </p>
                      <p className="mt-0.5 text-sm break-all">{contact.email}</p>
                    </div>
                  </a>
                </li>
              </ul>

              <Button
                variant="highlight"
                size="cta"
                className="mt-8 gap-2 px-6"
                render={<a href={`mailto:${contact.email}`} />}
                nativeButton={false}
              >
                Email IQAC
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="relative min-h-[280px] bg-muted sm:min-h-[360px]">
            <iframe
              src={MAP_EMBED}
              title="Map showing Port City International University"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
            <div className="pointer-events-none absolute top-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-primary shadow-lg">
              <MapPin className="size-4 text-accent-hover" />
              IQAC Office · Admin Building
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
