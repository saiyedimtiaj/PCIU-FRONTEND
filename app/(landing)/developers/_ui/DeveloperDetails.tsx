"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { CircleCheck, Globe, IdCard, X } from "lucide-react";
import { FacebookIcon, GithubIcon, LinkedinIcon } from "@/components/shared/social-icons";
import type { Developer } from "@/types/developers";
import { DOT_PATTERN, githubProfile, initials } from "./developer-utils";

const LINK =
  "inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground";

/**
 * Makes the whole card a button (stretched over it; the card's own links
 * sit above it) that opens the developer's profile and the work they did.
 */
export default function DeveloperDetails({ dev }: { dev: Developer }) {
  const github = dev.github ? githubProfile(dev.github) : null;
  const links = [
    github && { href: github.href, label: "GitHub", Icon: GithubIcon },
    dev.linkedin && { href: dev.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    dev.facebook && { href: dev.facebook, label: "Facebook", Icon: FacebookIcon },
    dev.portfolio && { href: dev.portfolio, label: "Portfolio", Icon: Globe },
  ].filter((link) => !!link);

  return (
    <Dialog.Root>
      <Dialog.Trigger
        aria-label={`View ${dev.name}'s profile and work`}
        className="absolute inset-0 z-1 cursor-pointer rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <Dialog.Popup className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl transition-all duration-300 data-ending-style:translate-y-6 data-ending-style:opacity-0 data-starting-style:translate-y-6 data-starting-style:opacity-0 sm:rounded-3xl">
            {/* Header band */}
            <div className="relative h-24 shrink-0 bg-linear-to-r from-primary to-secondary">
              <div className="absolute inset-0 opacity-15" style={DOT_PATTERN} />
              <Dialog.Close
                aria-label="Close"
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-black/25 text-white transition-colors hover:bg-white hover:text-primary"
              >
                <X className="size-4" />
              </Dialog.Close>
            </div>

            <div className="overflow-y-auto px-6 pb-6 sm:px-8 sm:pb-8">
              {/* Identity */}
              <div className="-mt-12 flex flex-col items-center text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-primary to-secondary shadow-lg ring-4 ring-card">
                  {dev.image ? (
                    <Image src={dev.image} alt={dev.name} fill sizes="96px" className="object-cover object-top" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-heading text-3xl font-bold text-white">
                      {initials(dev.name)}
                    </span>
                  )}
                </div>
                <div className="mt-3 min-w-0 sm:mt-0 sm:pb-1">
                  <Dialog.Title className="font-heading text-xl font-bold leading-snug text-foreground sm:text-2xl">
                    {dev.name}
                  </Dialog.Title>
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-semibold text-foreground">
                      <span className="size-1.5 rounded-full bg-accent-hover" />
                      {dev.role}
                    </span>
                    {dev.studentId && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
                        <IdCard className="size-3.5 text-accent-hover" />
                        {dev.studentId}
                      </span>
                    )}
                    {github && (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <GithubIcon className="size-3.5" />@{github.handle}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {dev.about && (
                <Dialog.Description className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {dev.about}
                </Dialog.Description>
              )}

              {/* Work */}
              <section className="mt-6">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent-hover">
                  What they worked on
                </h3>
                {dev.contributions.length > 0 ? (
                  <ol className="mt-3 space-y-2">
                    {dev.contributions.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground/85"
                      >
                        <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                    Contributions will be listed soon.
                  </p>
                )}
              </section>

              {links.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2 border-t border-dashed border-border pt-5">
                  {links.map(({ href, label, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
                      <Icon className="size-4" />
                      {label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
