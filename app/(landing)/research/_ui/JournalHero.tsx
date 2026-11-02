import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { BookOpen, FileText, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";

const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "24px 24px",
};

const JOURNAL_PAGES = [
  { id: "journal", label: "Port City Journal", short: "Journal", href: "/research/port-city-journal", icon: BookOpen },
  { id: "call-for-paper", label: "Call for Paper", short: "Call for Paper", href: "/research/call-for-paper", icon: FileText },
  { id: "guidelines", label: "Author Guidelines", short: "Guidelines", href: "/research/call-for-paper-guidelines", icon: ScrollText },
] as const;

export type JournalPageId = (typeof JOURNAL_PAGES)[number]["id"];

/**
 * Shared banner for the three journal pages, with a link bar overlapping its
 * bottom edge so readers can move between them. One navy gradient for all
 * three — the earlier per-page navy↔yellow blends went muddy in the middle.
 */
export default function JournalHero({
  active,
  icon: Icon,
  title,
  subtitle,
  chips = [],
}: {
  active: JournalPageId;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  chips?: string[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-secondary">
        <div className="absolute inset-0 opacity-10" style={DOT_PATTERN} />
        <div className="pointer-events-none absolute -left-24 top-6 size-72 rounded-full bg-accent/20 blur-3xl transform-gpu motion-safe:animate-drift" />
        <div
          className="pointer-events-none absolute -right-20 -bottom-10 size-80 rounded-full bg-secondary/40 blur-3xl transform-gpu motion-safe:animate-drift"
          style={{ animationDelay: "-7s" }}
        />

        <div className="container relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-20 text-center sm:px-6 md:pt-16 md:pb-24 lg:px-8">
          <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm md:size-16">
            <Icon className="size-7 text-accent md:size-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-white md:text-5xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">{subtitle}</p>
          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm md:text-xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <nav aria-label="Journal pages" className="container relative z-10 mx-auto -mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-lg sm:w-fit">
          {JOURNAL_PAGES.map(({ id, label, short, href, icon: TabIcon }) => (
            <Link
              key={id}
              href={href}
              aria-current={id === active ? "page" : undefined}
              className={cn(
                "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-2 py-2 text-xs font-medium transition-colors sm:flex-none sm:px-4 sm:text-sm",
                id === active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <TabIcon className="hidden size-4 sm:block" />
              <span className="sm:hidden">{short}</span>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
