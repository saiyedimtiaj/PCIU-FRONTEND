import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const STAT_ICON_RULES: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /student/i, icon: Users },
  { pattern: /program/i, icon: BookOpen },
  { pattern: /alumni/i, icon: GraduationCap },
  { pattern: /faculty/i, icon: Award },
];

const DEFAULT_STAT_ICON = Sparkles;

export function getStatIcon(key: string): LucideIcon {
  return (
    STAT_ICON_RULES.find((rule) => rule.pattern.test(key))?.icon ??
    DEFAULT_STAT_ICON
  );
}
