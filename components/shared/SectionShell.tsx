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
  routingMode?: "query" | "path";
  children: ReactNode;
}

/**
 * Sidebar-nav + content layout shared by the `?section=` query-param pages
 * (Academics, Admission) and nested path pages. Server component.
 */
export default function SectionShell({ title, items, activeId, basePath, routingMode = "query", children }: SectionShellProps) {
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
              const href = routingMode === "path" ? `${basePath}/${item.id}` : `${basePath}?section=${item.id}`;
              return (
                <Link
                  key={item.id}
                  href={href}
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
