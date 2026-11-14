"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Collapse the message once it runs past roughly this many visible characters. */
const COLLAPSE_THRESHOLD = 420;

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function ChairmanMessage({ bio }: { bio: string }) {
  const [expanded, setExpanded] = React.useState(false);

  const isLong = React.useMemo(
    () => stripHtml(bio).length > COLLAPSE_THRESHOLD,
    [bio],
  );

  return (
    <div>
      <div className="relative">
        <div
          className={cn(
            "space-y-4 text-base leading-relaxed text-muted-foreground transition-[max-height] duration-500",
            "[&_p]:mb-4 [&_p:last-child]:mb-0",
            isLong && !expanded && "max-h-60 overflow-hidden",
          )}
          dangerouslySetInnerHTML={{ __html: bio }}
        />

        {/* Soft fade so the collapsed copy doesn't end on a hard cut */}
        {isLong && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-50 via-slate-50/80 to-transparent" />
        )}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="group mt-5 inline-flex items-center gap-2 rounded-full border border-[#0ea5e9]/40 bg-white px-4 py-2 text-sm font-semibold text-[#1e3a8a] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0ea5e9] hover:bg-[#0ea5e9]/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]/40 focus-visible:ring-offset-2"
        >
          {expanded ? "Read Less" : "Read More"}
          <ChevronDown
            className={cn(
              "size-4 text-[#0ea5e9] transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </button>
      )}
    </div>
  );
}
