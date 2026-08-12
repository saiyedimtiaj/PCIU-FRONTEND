"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENTITY_REGISTRY } from "@/lib/admin/entities";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/faculty": "Faculty Directory",
  "/admin/settings": "Settings",
  "/admin/homepage": "Homepage",
  "/admin/journal": "News.com",
  "/admin/media": "Media",
  "/admin/templates": "Templates",
  "/admin/activity": "Activity",
  "/admin/users": "Users",
};

function pageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // "Add <Entity>" routes are derived from the entity registry — the single
  // source of truth also used to generate the sidebar — so titles can't
  // drift out of sync as entities are added.
  const entitySlug = pathname.match(/^\/admin\/[^/]+\/([^/]+)\/new$/)?.[1];
  if (entitySlug && ENTITY_REGISTRY[entitySlug]) {
    return `Add ${ENTITY_REGISTRY[entitySlug].title}`;
  }

  const match = Object.keys(PAGE_TITLES)
    .filter((path) => path !== "/admin" && pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0];
  return match ? PAGE_TITLES[match] : "Admin";
}

export interface AdminHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobileNav: () => void;
}

export default function AdminHeader({
  collapsed,
  onToggleCollapse,
  onOpenMobileNav,
}: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border bg-card px-4">
      <Button
        variant="ghost"
        size="icon-sm"
        className="hidden lg:inline-flex"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </Button>
      <h1 className="font-heading text-sm font-semibold text-foreground">{pageTitle(pathname)}</h1>
    </header>
  );
}
