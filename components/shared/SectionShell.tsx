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

export default function SectionShell({ title, items, activeId, basePath, routingMode = "query", children }: SectionShellProps) {
  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
          <div className="bg-primary px-4 py-3 text-primary-foreground">
            <h3 className="font-heading font-semibold text-sm">{title}</h3>
          </div>
          <nav
            aria-label={title}
            className="scrollbar-thin flex max-h-[164px] touch-pan-y flex-col gap-1 overflow-y-auto overscroll-y-contain p-1.5 lg:max-h-[268px]"
          >
            {items.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = item.id === activeId;
              const href = routingMode === "path" ? `${basePath}/${item.id}` : `${basePath}?section=${item.id}`;
              return (
                <Link
                  key={item.id}
                  href={href}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-12 shrink-0 items-center gap-2.5 overflow-hidden rounded-xl px-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                    isActive
                      ? "border-l-[5px] border-primary bg-primary/20 font-medium text-primary"
                      : "border-l-[5px] border-transparent text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
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
