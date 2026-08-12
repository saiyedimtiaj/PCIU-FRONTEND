import type { ReactNode } from "react";
import Link from "next/link";
import { iconMap, type IconName } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface SectionShellProps {
  title: string;
  items: SectionNavItem[];
  activeId: string;
  basePath: string;
  children: ReactNode;
}

/**
 * Sidebar-nav + content layout shared by the `?section=` query-param pages
 * (Academics, Admission). Server component — active section comes from the
 * URL via a prop, links are real `next/link`s to `?section=x` so navigation
 * needs zero client JS.
 */
export default function SectionShell({ title, items, activeId, basePath, children }: SectionShellProps) {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-24 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-3">
            <h3 className="font-heading font-semibold text-sm">{title}</h3>
          </div>
          <nav className="flex flex-col p-2">
            {items.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = item.id === activeId;
              return (
                <Link
                  key={item.id}
                  href={`${basePath}?section=${item.id}`}
                  scroll={false}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent border-l-4 border-accent font-medium"
                      : "text-muted-foreground hover:bg-muted"
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
      <div className="lg:col-span-3 min-w-0">{children}</div>
    </div>
  );
}
