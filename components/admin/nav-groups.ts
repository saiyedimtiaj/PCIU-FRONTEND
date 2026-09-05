import {
  BookOpen,
  UsersRound,
  CalendarClock,
  LayoutGrid,
  Microscope,
  BookMarked,
  GraduationCap,
  ScrollText,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { ENTITY_REGISTRY, ENTITY_GROUP_ORDER } from "@/lib/admin/entities";

export interface NavGroupItem {
  title: string;
  href: string;
}

export interface NavGroup {
  key: string;
  title: string;
  icon: LucideIcon;
  routeSegment: string;
  items: NavGroupItem[];
}

const GROUP_META: Record<(typeof ENTITY_GROUP_ORDER)[number], { icon: LucideIcon; routeSegment: string }> = {
  Academics: { icon: BookOpen, routeSegment: "academics" },
  People: { icon: UsersRound, routeSegment: "people" },
  Scheduling: { icon: CalendarClock, routeSegment: "scheduling" },
  Content: { icon: LayoutGrid, routeSegment: "content" },
  Research: { icon: Microscope, routeSegment: "research" },
  Journal: { icon: BookMarked, routeSegment: "journal" },
  Admission: { icon: GraduationCap, routeSegment: "admission" },
  IQAC: { icon: ScrollText, routeSegment: "iqac" },
  System: { icon: Settings2, routeSegment: "system" },
};

export function groupRouteSegment(group: string): string {
  return GROUP_META[group as keyof typeof GROUP_META]?.routeSegment ?? "system";
}

export function pluralize(title: string): string {
  if (/[sxz]$|[cs]h$/i.test(title)) return `${title}es`;
  if (/[^aeiou]y$/i.test(title)) return `${title.slice(0, -1)}ies`;
  return `${title}s`;
}

export const NAV_GROUPS: NavGroup[] = ENTITY_GROUP_ORDER.map((group) => {
  const meta = GROUP_META[group];
  const items = Object.values(ENTITY_REGISTRY)
    .filter((entity) => entity.group === group)
    .map((entity) => ({
      title: entity.title,
      href: `/admin/${meta.routeSegment}/${entity.slug}`,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  // Permissions is a custom matrix page, not a schema-driven entity, so it
  // isn't in ENTITY_REGISTRY and has to be appended by hand.
  if (group === "System") {
    items.push({ title: "Permissions", href: "/admin/system/permissions" });
    items.sort((a, b) => a.title.localeCompare(b.title));
  }

  return { key: group, title: group, icon: meta.icon, routeSegment: meta.routeSegment, items };
});
