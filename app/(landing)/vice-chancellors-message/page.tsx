import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Globe } from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa6";
import { SiGooglescholar, SiResearchgate } from "react-icons/si";

import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getVCInfo } from "@/lib/api/home";
import { getMediaUrl } from "@/lib/utils/media";

export const metadata: Metadata = {
  title: "Vice Chancellor's Message | Port City International University",
  description:
    "A message from the Vice Chancellor of Port City International University (PCIU), Chattogram.",
};

export default async function VCMessagePage() {
  const vc = await getVCInfo();

  if (!vc) {
    return (
      <div className="min-h-screen bg-background">
        <PageBanner
          title="Vice Chancellor’s Message"
          subtitle="Port City International University"
          variant="solid"
        />
        <Breadcrumb items={[{ label: "Vice Chancellor’s Message" }]} />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              The Vice Chancellor’s message is temporarily unavailable.
            </div>
          </div>
        </section>
      </div>
    );
  }

  const imageSrc = getMediaUrl(vc.imageUrl) ?? "/images/vc-photo.jpg";
  const bioHtml = vc.bio?.trim() || "";
  const designation =
    vc.designation?.replace(/,?\s*PCIU\s*$/i, "").trim() || "Vice Chancellor";
  const educationEntries = [...(vc.education ?? [])].sort(
    (first, second) =>
      (first.eduOrder ?? Number.MAX_SAFE_INTEGER) -
      (second.eduOrder ?? Number.MAX_SAFE_INTEGER),
  );

  const normalizeUrl = (value: string | string[] | null | undefined) => {
    if (!value) return null;
    if (Array.isArray(value)) return value.find(Boolean) ?? null;
    return value.trim() || null;
  };

  const profileLinks = [
    { href: normalizeUrl(vc.websiteUrl), label: "Website", icon: Globe },
    {
      href: normalizeUrl(vc.googleScholarUrl),
      label: "Google Scholar",
      icon: SiGooglescholar,
    },
    {
      href: normalizeUrl(vc.researchgateUrl),
      label: "ResearchGate",
      icon: SiResearchgate,
    },
    {
      href: normalizeUrl(vc.linkedinUrl),
      label: "LinkedIn",
      icon: FaLinkedinIn,
    },
  ].filter(
    (link): link is { href: string; label: string; icon: typeof Globe } =>
      Boolean(link.href),
  );

  const renderEducationYear = (value?: string | null) => {
    if (!value) return null;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;

    return parsed.getFullYear();
  };

  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Vice Chancellor’s Message"
        subtitle="Port City International University"
        variant="solid"
      />
      <Breadcrumb items={[{ label: "Vice Chancellor’s Message" }]} />

      <section className="relative overflow-hidden bg-white px-4 py-10 sm:py-10 md:px-14 ">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-50 blur-3xl opacity-70" />
          <div className="absolute -right-40 bottom-[-120px] h-[420px] w-[420px] rounded-full bg-amber-50 blur-3xl opacity-60" />

          <div className="absolute bottom-[-15px] right-[-120px] h-[360px] w-[760px] sm:h-[430px] sm:w-[850px] lg:h-[500px] lg:w-[950px]">
            <svg
              viewBox="0 0 950 500"
              className="h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="blueWave" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#DCEAF8" stopOpacity="0" />
                  <stop offset="45%" stopColor="#C9DDF2" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#AFCBE8" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="goldWave" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F3E4B8" stopOpacity="0" />
                  <stop offset="55%" stopColor="#E6C96D" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D99A00" stopOpacity="0.55" />
                </linearGradient>
              </defs>

              <path
                d="M -80 455 C 150 350, 300 430, 470 350 C 650 265, 710 250, 1020 40"
                stroke="url(#blueWave)"
                strokeWidth="1.4"
              />
              <path
                d="M -80 470 C 150 365, 310 445, 480 365 C 660 280, 730 255, 1020 55"
                stroke="url(#blueWave)"
                strokeWidth="1.2"
              />
              <path
                d="M -80 485 C 145 380, 315 460, 490 380 C 675 295, 750 270, 1020 72"
                stroke="url(#blueWave)"
                strokeWidth="1.15"
              />
              <path
                d="M -70 500 C 150 395, 320 475, 500 395 C 690 310, 765 285, 1020 90"
                stroke="url(#blueWave)"
                strokeWidth="1"
              />
              <path
                d="M -50 515 C 160 410, 330 490, 510 410 C 705 325, 780 300, 1020 108"
                stroke="url(#blueWave)"
                strokeWidth="1"
              />
              <path
                d="M -20 525 C 170 420, 345 500, 525 425 C 720 340, 795 315, 1020 125"
                stroke="url(#blueWave)"
                strokeWidth="0.9"
              />
              <path
                d="M 10 535 C 185 430, 355 510, 540 440 C 735 355, 815 330, 1020 143"
                stroke="url(#blueWave)"
                strokeWidth="0.9"
              />
              <path
                d="M 45 545 C 200 440, 370 520, 555 455 C 750 370, 830 345, 1020 160"
                stroke="url(#blueWave)"
                strokeWidth="0.85"
              />

              <path
                d="M 130 535 C 300 450, 410 505, 570 445 C 750 378, 830 350, 1020 190"
                stroke="url(#goldWave)"
                strokeWidth="1"
              />
              <path
                d="M 175 540 C 330 465, 430 515, 590 460 C 770 395, 850 365, 1020 205"
                stroke="url(#goldWave)"
                strokeWidth="0.9"
              />
              <path
                d="M 220 545 C 360 480, 450 525, 610 475 C 790 410, 870 380, 1020 220"
                stroke="url(#goldWave)"
                strokeWidth="0.85"
              />
              <path
                d="M 270 550 C 390 495, 470 535, 630 490 C 805 425, 890 395, 1020 235"
                stroke="url(#goldWave)"
                strokeWidth="0.75"
              />

              <path
                d="M 90 500 C 250 420, 350 470, 530 390 C 710 310, 780 275, 1020 105"
                stroke="#E5EFF9"
                strokeWidth="0.7"
              />
              <path
                d="M 110 515 C 265 435, 365 485, 545 405 C 725 325, 800 290, 1020 120"
                stroke="#E9F2FA"
                strokeWidth="0.7"
              />
              <path
                d="M 150 525 C 285 445, 385 495, 560 420 C 740 340, 820 305, 1020 135"
                stroke="#EDF4FA"
                strokeWidth="0.65"
              />
            </svg>
          </div>

          <div className="absolute bottom-0 right-0 h-40 w-[55%] bg-gradient-to-t from-blue-50/20 to-transparent" />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[390px_1fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-[350px] ">
              <div className="relative z-10">
                <div className="pointer-events-none absolute -left-4 -top-4 bottom-6 w-[calc(100%-20px)] rounded-[28px] bg-primary sm:-left-5 sm:-top-5 " />

                <div className="relative z-10 rounded-t-2xl bg-white p-3 shadow-[0_25px_70px_rgba(8,47,103,0.13)] sm:p-4">
                  <div className="absolute right-5 top-5 z-20 h-20 w-20 rounded-tr-2xl border-r-4 border-t-4 border-accent" />
                  <div className="absolute bottom-[115px] left-5 z-20 h-16 w-16 rounded-bl-2xl border-b-4 border-l-4 border-accent md:bottom-[125px]" />

                  <div className="group relative aspect-[5/4] overflow-hidden rounded-[21px] bg-[#EEF5FC]">
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt={`${vc.name} - ${designation}`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 360px, (min-width: 768px) 330px, 90vw"
                        className="object-contain object-top transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-5 text-center text-sm text-slate-400">
                        Photo unavailable
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082F67]/15 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-30 -mt-6 ml-5 rounded-2xl bg-primary px-4 py-4 shadow-[0_12px_35px_rgba(8,47,103,0.13)] sm:px-4">
                    <h3 className="font-heading text-xs font-bold leading-snug text-white sm:text-[13px]">
                      {vc.name}
                    </h3>

                    {vc.designation && (
                      <p className="mt-1 text-xs text-accent font-bold leading-relaxed tracking-wide text-accent ">
                        {vc.designation}
                      </p>
                    )}
                  </div>

                  {profileLinks.length > 0 && (
                    <nav
                      aria-label={`${vc.name} profile links`}
                      className="relative z-30 flex justify-center gap-3 pt-3 sm:gap-4 sm:pt-3"
                    >
                      {profileLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${vc.name} on ${label}`}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[#0A4A94] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0A4A94] hover:bg-[#0A4A94] hover:text-white hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4A94] focus-visible:ring-offset-2 motion-reduce:transition-none sm:h-11 sm:w-11"
                        >
                          <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                        </Link>
                      ))}
                    </nav>
                  )}
                </div>

                {educationEntries.length > 0 && (
                  <div className="relative z-10  rounded-b-2xl border-b border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(8,47,103,0.08)] sm:p-6">
                    <div className="border border-slate-200 mb-2"></div>
                    <div className=" border-l-4 rounded-xl  border-slate-500 p-2 ">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Academic background
                      </p>
                      <h3 className="text-lg font-bold text-primary">
                        Education
                      </h3>
                    </div>
                    <div className="border border-slate-200 mb-2 mt-2 "></div>

                    <ul className="space-y-4">
                      {educationEntries.map((entry, index) => (
                        <li
                          key={`${entry.degree}-${entry.institution ?? "institution"}-${index}`}
                          className="relative border-l border-slate-400  pb-1 pl-4 last:border-l-transparent"
                        >
                          <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-slate-400 " />
                          <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                            <p className="text-sm font-semibold leading-snug text-slate-900">
                              {entry.degree}
                            </p>
                            {entry.educationYear && (
                              <span className="shrink-0 rounded-full bg-primary/5 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-primary">
                                {renderEducationYear(entry.educationYear)}
                              </span>
                            )}

                            <p className="mt-1 text-sm leading-relaxed text-slate-600">
                              {entry.institution || "Institution not available"}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="relative min-w-0 text-center md:text-left">
              <div className="mx-auto mb-6 mt-3 h-1 w-34 rounded-full bg-gradient-to-r from-[#082F67] via-accent to-accent shadow-[0_3px_10px_rgba(217,154,0,0.18)] md:mx-0" />

              {bioHtml ? (
                <div
                  className="mt-7 max-w-3xl space-y-5 text-base leading-[1.9] text-muted-foreground md:text-[15px] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: bioHtml }}
                />
              ) : null}

              <div className="mt-8 border-l-4 border-accent rounded-xl  py-2 pl-2 text-left ">
                <p className="text-[15px] md:text-xl font-bold leading-snug text-foreground">
                  {vc.name}
                </p>
                {vc.designation && (
                  <p className="mt-1 text-[14px] text-primary/70  font-bold leading-relaxed tracking-wide  ">
                    {vc.designation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
