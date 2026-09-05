"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENTITY_REGISTRY } from "@/lib/admin/entities";
import { pluralize } from "./nav-groups";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile } from "@/types/faculty-directory";

const FACULTY_PROFILES = profiles as FacultyProfile[];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "Pages",
  "/admin/faculty": "Faculty Directory",
  "/admin/settings": "Settings",
  "/admin/system/permissions": "Permissions",
  "/admin/system/popup": "Popup",
};

const FACULTY_SECTION_TITLES: Record<string, string> = {
  profile: "Profile",
  education: "Education",
  publications: "Publications",
  experience: "Experience",
  awards: "Awards",
  memberships: "Memberships",
};

function pageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  // "pages" is also reachable from this shorter top-level route
  // (/admin/pages/...) alongside its regular /admin/content/pages one.
  if (pathname === "/admin/pages/new") return "Add Page";
  const topLevelEditMatch = pathname.match(/^\/admin\/pages\/([^/]+)\/edit$/);
  if (topLevelEditMatch) return "Edit Page";

  const newMatch = pathname.match(/^\/admin\/[^/]+\/([^/]+)\/new$/)?.[1];
  if (newMatch && ENTITY_REGISTRY[newMatch]) {
    return `Add ${ENTITY_REGISTRY[newMatch].title}`;
  }

  const listMatch = pathname.match(/^\/admin\/[^/]+\/([^/]+)$/)?.[1];
  if (listMatch && ENTITY_REGISTRY[listMatch]) {
    const entity = ENTITY_REGISTRY[listMatch];
    return entity.pluralTitle ?? pluralize(entity.title);
  }

  const editMatch = pathname.match(/^\/admin\/[^/]+\/([^/]+)\/[^/]+\/edit$/)?.[1];
  if (editMatch && ENTITY_REGISTRY[editMatch]) {
    return `Edit ${ENTITY_REGISTRY[editMatch].title}`;
  }

  const facultyMatch = pathname.match(/^\/admin\/faculty\/([^/]+)(?:\/([^/]+))?$/);
  if (facultyMatch) {
    const [, id, section] = facultyMatch;
    const profile = FACULTY_PROFILES.find((p) => p.id === id);
    const name = profile ? profile.name : "Faculty Profile";
    return section ? `${name} — ${FACULTY_SECTION_TITLES[section] ?? section}` : name;
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
