import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGooglescholar, SiResearchgate } from "react-icons/si";

import ScrollReveal from "@/components/motion/ScrollReveal";
import { getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import type { FacultyDean } from "@/types/academics";

type ProfileLink = {
  href: string | null;
  label: string;
  icon: ReactNode;
};

/**
 * Dean's message block for a faculty page, deliberately mirroring the
 * homepage's Vice Chancellor section: framed portrait card, quote preview,
 * and a pill CTA that opens the dean's full teacher profile.
 */
export function DeanMessage({
  dean,
  facultyName,
}: {
  dean: FacultyDean;
  facultyName: string;
}) {
  const photoUrl = getMediaUrl(dean.imageUrl);
  const preview = getBioPreview(dean.bio || dean.shortBio);

  const profileCandidates: ProfileLink[] = [
    {
      href: normalizeUrl(dean.websiteUrl),
      label: "Website",
      icon: <Globe className="size-4" aria-hidden />,
    },
    {
      href: normalizeUrl(dean.googleScholarUrl),
      label: "Google Scholar",
      icon: <SiGooglescholar className="size-4" aria-hidden />,
    },
    {
      href: normalizeUrl(dean.researchgateUrl),
      label: "ResearchGate",
      icon: <SiResearchgate className="size-4" aria-hidden />,
    },
    {
      href: normalizeUrl(dean.linkedinUrl),
      label: "LinkedIn",
      icon: <FaLinkedinIn className="size-4" aria-hidden />,
    },
  ];

  const profileLinks = profileCandidates.filter(
    (link): link is ProfileLink & { href: string } => Boolean(link.href),
  );

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white px-4 py-10 sm:px-8 sm:py-12 md:px-10">
      {/* Background decoration, echoing the homepage VC section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-64 w-64 rounded-full bg-blue-50 opacity-70 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-amber-50 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-32 w-1/2 bg-linear-to-t from-blue-50/30 to-transparent" />
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
        {/* Dean portrait card */}
        <ScrollReveal direction="left" className="w-full">
          <div className="relative mx-auto w-full max-w-[300px]">
            {/* Decorative back panel */}
            <div className="absolute -left-4 -top-4 h-[calc(100%-25px)] w-[calc(100%-20px)] rounded-[28px] bg-primary sm:-left-5 sm:-top-5" />

            {/* Main card */}
            <div className="relative rounded-[26px] bg-white p-3 shadow-[0_25px_70px_rgba(8,47,103,0.13)] sm:p-4">
              {/* Gold corner - top right */}
              <div className="absolute right-5 top-5 z-20 h-20 w-20 rounded-tr-2xl border-r-4 border-t-4 border-accent" />

              {/* Gold corner - bottom left */}
              <div className="absolute bottom-24.5 left-5 z-20 h-14 w-14 rounded-bl-2xl border-b-4 border-l-4 border-accent" />

              {/* Photo */}
              <div className="group relative aspect-5/4 overflow-hidden rounded-[21px] bg-[#EEF5FC]">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={`${dean.name} - ${dean.designation}`}
                    fill
                    sizes="(min-width: 1024px) 300px, (min-width: 768px) 280px, 90vw"
                    className="object-contain object-top transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center font-heading text-5xl font-bold text-slate-300">
                    {getInitials(dean.name)}
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#082F67]/15 via-transparent to-transparent" />
              </div>

              {/* Name / designation */}
              <div className="relative z-30 -mt-6 ml-4 rounded-2xl bg-primary px-4 py-4 shadow-[0_12px_35px_rgba(8,47,103,0.13)]">
                <h3 className="font-heading text-xs font-bold leading-snug text-white sm:text-[13px]">
                  {dean.name}
                </h3>
                <p className="mt-1 text-xs font-bold leading-relaxed tracking-wide text-accent">
                  {dean.designation}
                </p>
              </div>

              {profileLinks.length > 0 && (
                <nav
                  aria-label={`${dean.name} profile links`}
                  className="relative z-30 flex justify-center gap-3 pt-3 sm:gap-4"
                >
                  {profileLinks.map(({ href, label, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dean.name} on ${label}`}
                      className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-primary shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                    >
                      {icon}
                    </a>
                  ))}
                </nav>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Message */}
        <ScrollReveal direction="right" delay={0.08} className="w-full">
          <div className="relative text-center lg:text-left">
            <p className="mb-3 inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              Office of the Dean · {facultyName}
            </p>

            <h2 className="mx-auto max-w-3xl font-heading text-[24px] font-bold leading-[1.12] tracking-tight text-[#082F67] sm:text-[30px] lg:mx-0">
              Message from the Dean
            </h2>

            {/* Accent */}
            <div className="mx-auto mt-3 mb-6 h-1 w-34 rounded-full bg-linear-to-r from-[#082F67] via-accent to-accent shadow-[0_3px_10px_rgba(245,183,29,0.18)] lg:mx-0" />

            {preview && (
              <p className="relative mx-auto max-w-2xl text-sm leading-7 text-slate-900 sm:text-base sm:leading-8 md:text-lg md:leading-9 lg:mx-0">
                <span className="mr-1 align-[-0.3em] font-serif text-4xl font-bold leading-none text-accent">
                  “
                </span>
                {preview}
                <span className="ml-1 align-[-0.3em] font-serif text-4xl font-bold leading-none text-accent">
                  ”
                </span>
              </p>
            )}

            {/* Read full message → dean's teacher profile */}
            <div className="mt-9 sm:mt-10">
              <Link
                href={`/faculty/${dean.id}`}
                className="group inline-flex items-center gap-3 rounded-full border border-[#D99A00]/40 bg-white/80 py-1.5 pl-5 pr-1.5 shadow-[0_6px_20px_rgba(8,47,103,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#082F67] hover:bg-white hover:shadow-[0_10px_28px_rgba(8,47,103,0.14)]"
              >
                <span className="font-heading text-sm font-semibold tracking-wide text-[#082F67] sm:text-base">
                  Read Full Message
                </span>
                <span className="flex size-9 items-center justify-center rounded-full bg-[#D99A00] text-white shadow-[0_4px_12px_rgba(217,154,0,0.25)] transition-all duration-300 group-hover:bg-[#082F67] group-hover:shadow-[0_5px_16px_rgba(8,47,103,0.25)]">
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function normalizeUrl(
  value: string | string[] | null | undefined,
): string | null {
  const values = Array.isArray(value) ? value : [value];
  return (
    values
      .find(
        (candidate): candidate is string =>
          typeof candidate === "string" && candidate.trim().length > 0,
      )
      ?.trim() ?? null
  );
}

function getBioPreview(bio: string | null | undefined): string {
  const text = (bio ?? "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 360) return text;
  return `${text.slice(0, 357).trimEnd()}...`;
}
