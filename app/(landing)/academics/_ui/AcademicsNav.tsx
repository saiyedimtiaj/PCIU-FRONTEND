"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { SectionNavItem } from "@/components/shared/SectionShell";

/**
 * Client component that renders the academics sidebar navigation.
 * Uses `useSelectedLayoutSegment()` to automatically detect the
 * active route segment — no prop drilling needed from every page.
 */
export default function AcademicsNav({ items }: { items: SectionNavItem[] }) {
  const segment = useSelectedLayoutSegment();

  return (
    <aside className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 rounded-xl border border-border bg-card overflow-hidden">
        <div className="bg-primary text-primary-foreground px-4 py-3">
          <h3 className="font-heading font-semibold text-sm">Academic Menu</h3>
        </div>
        <nav className="flex flex-col p-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = segment === item.id;
            return (
              <Link
                key={item.id}
                href={`/academics/${item.id}`}
                scroll={false}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent border-l-4 border-accent font-medium"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
