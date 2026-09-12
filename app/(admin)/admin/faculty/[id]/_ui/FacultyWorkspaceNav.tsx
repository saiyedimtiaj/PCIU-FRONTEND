"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceNavItem {
  label: string;
  segment: string;
  icon: LucideIcon;
}

const NAV_ITEMS: WorkspaceNavItem[] = [
  { label: "Overview", segment: "", icon: LayoutDashboard },
  { label: "Profile", segment: "/profile", icon: UserRound },
  { label: "Education", segment: "/education", icon: GraduationCap },
  { label: "Publications", segment: "/publications", icon: BookOpen },
  { label: "Experience", segment: "/experience", icon: Briefcase },
  { label: "Awards", segment: "/awards", icon: Award },
  { label: "Memberships", segment: "/memberships", icon: Users },
];

export default function FacultyWorkspaceNav({ teacherId }: { teacherId: string }) {
  const pathname = usePathname();
  const base = `/admin/faculty/${teacherId}`;

  return (
    <nav className="scrollbar-thin flex gap-1 overflow-x-auto border-b border-border pb-3">
      {NAV_ITEMS.map((item) => {
        const href = `${base}${item.segment}`;
        const active = pathname === href;
        const Icon = item.icon;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
