import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CircleCheck, Headset, House } from "lucide-react";

export interface ApplySidebarSection {
  id: string;
  label: string;
}

export default function ApplyFormShell({
  levelLabel,
  title,
  highlight,
  description,
  sections,
  checklist,
  helpPhone,
  children,
}: {
  levelLabel: string;
  title: string;
  highlight: string;
  description: string;
  sections: ApplySidebarSection[];
  checklist: string[];
  helpPhone: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/50 font-admin">
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero-campus.jpg"
          alt="Port City International University campus"
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-primary via-primary/90 to-primary/60" />

        <div className="container mx-auto max-w-7xl px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-heading text-sm font-semibold text-white/75 backdrop-blur-md sm:text-base"
          >
            <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-accent">
              <House className="size-4" />
              Home
            </Link>
            <ChevronRight className="size-4 text-white/40" />
            <Link href="/admission" className="transition-colors hover:text-accent">
              Admission
            </Link>
            <ChevronRight className="size-4 text-white/40" />
            <Link href="/admission/apply" className="transition-colors hover:text-accent">
              Online Application
            </Link>
            <ChevronRight className="size-4 text-white/40" />
            <span className="text-accent">{levelLabel}</span>
          </nav>

          <div className="mt-12 max-w-3xl sm:mt-14">
            <h1 className="font-heading text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
              {title} <span className="text-accent">{highlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Application Sections
              </p>
              <ol className="mt-4 space-y-1">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-foreground transition-colors hover:bg-secondary-light/60 hover:text-secondary"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {section.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Before You Start
              </p>
              <ul className="mt-4 space-y-3">
                {checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-white">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-black">
                <Headset className="size-6" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold">Need help?</p>
                <a
                  href={`tel:${helpPhone.replace(/[^\d+]/g, "")}`}
                  className="font-heading text-lg font-bold text-accent transition-colors hover:text-white"
                >
                  {helpPhone}
                </a>
              </div>
            </div>
          </aside>

          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
