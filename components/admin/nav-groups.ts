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

/**
 * Grouped sidebar nav, derived from the entity registry so the sidebar and
 * the 49 "Add" form routes can never drift out of sync with each other.
 */
export const NAV_GROUPS: NavGroup[] = ENTITY_GROUP_ORDER.map((group) => {
  const meta = GROUP_META[group];
  const items = Object.values(ENTITY_REGISTRY)
    .filter((entity) => entity.group === group)
    .map((entity) => ({
      title: entity.title,
      href: `/admin/${meta.routeSegment}/${entity.slug}/new`,
    }));

  return { key: group, title: group, icon: meta.icon, routeSegment: meta.routeSegment, items };
});
