"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { SectionNavItem } from "@/components/shared/SectionShell";

/** Items always visible on mobile before "See more" (the active item is always shown too). */
const MOBILE_VISIBLE_COUNT = 3;

/**
 * Client component that renders the academics sidebar navigation.
 * Uses `useSelectedLayoutSegment()` to automatically detect the
 * active route segment — no prop drilling needed from every page.
 *
 * Below `lg` the list collapses behind a "See more / See less" toggle so the
 * menu doesn't push the page content off the first screen. Hidden items use
 * `hidden lg:flex`, so the desktop sidebar is unaffected.
 */
export default function AcademicsNav({ items }: { items: SectionNavItem[] }) {
  const segment = useSelectedLayoutSegment();
  const [expanded, setExpanded] = useState(false);
  const hasMore = items.length > MOBILE_VISIBLE_COUNT;

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <h3 className="font-heading font-semibold text-sm">Academic Menu</h3>
        </div>
        <nav className="flex flex-col p-2">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon];
            const isActive = segment === item.id;
            const collapsedOnMobile = !expanded && !isActive && index >= MOBILE_VISIBLE_COUNT;
            return (
              <Link
                key={item.id}
                href={`/academics/${item.id}`}
                scroll={false}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary border-l-4 border-primary font-medium"
                    : "text-muted-foreground hover:bg-muted",
                  collapsedOnMobile && "hidden lg:flex",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          {hasMore && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="lg:hidden mt-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted transition-colors"
            >
              {expanded ? "See less" : "See more"}
              <ChevronDown
                className={cn("size-4 transition-transform", expanded && "rotate-180")}
              />
            </button>
          )}
        </nav>
      </div>
    </aside>
  );
}
