import type { IconName } from "@/lib/icons";

export type DashboardTone = "primary" | "success" | "info" | "violet" | "warning";
export type DashboardStatTone = "dark" | "violet" | "blue" | "gold";

export interface DashboardAction {
  label: string;
  href: string;
}

export interface AdminDashboardContent {
  intro: {
    eyebrow: string;
    title: string;
    description: string;
    dataLabel: string;
    primaryAction: DashboardAction;
    secondaryAction: DashboardAction;
  };
  stats: Array<{
    label: string;
    value: string;
    caption: string;
    meta: string;
    icon: IconName;
    tone: DashboardStatTone;
    href: string;
  }>;
  workspace: {
    title: string;
    description: string;
    totalModules: number;
    connectedModules: number;
    connectionRate: number;
    groups: Array<{ label: string; count: number; icon: IconName; href: string }>;
    unconnected: Array<{ label: string; group: string; href: string }>;
  };
  recentUpdates: Array<{
    title: string;
    path: string;
    category: string;
    status: "Published" | "In review" | "Scheduled";
    updated: string;
    icon: IconName;
    href: string;
  }>;
  admissions: {
    eyebrow: string;
    term: string;
    title: string;
    description: string;
    applicationTotal: string;
    change: string;
    stages: Array<{ label: string; value: string }>;
    weekly: Array<{ label: string; value: number }>;
    primaryAction: DashboardAction;
    secondaryAction: DashboardAction;
  };
  inventory: {
    title: string;
    description: string;
    items: Array<{ label: string; value: string; detail: string; icon: IconName }>;
  };
  facultySnapshot: {
    title: string;
    description: string;
    total: number;
    groups: Array<{ label: string; count: number }>;
    action: DashboardAction;
  };
  quickActions: Array<{
    title: string;
    description: string;
    icon: IconName;
    href: string;
    tone: DashboardTone;
  }>;
  upcoming: {
    title: string;
    description: string;
    items: Array<{ month: string; day: string; title: string; meta: string; category: string }>;
    action: DashboardAction;
  };
}
