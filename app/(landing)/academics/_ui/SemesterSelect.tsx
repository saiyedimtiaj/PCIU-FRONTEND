"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Semester } from "@/types/academics";

export const ALL_SEMESTERS = "all";

/**
 * Semester picker shared by the exam and class schedules. Options come from
 * the live /academic/semesters list, so a semester added in the admin
 * dashboard (Spring/Summer/Fall 2026, ...) shows up here with no code change.
 */
export default function SemesterSelect({
  semesters,
  value,
  onValueChange,
  className,
}: {
  semesters: Semester[];
  /** A semester id as a string, or ALL_SEMESTERS. */
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}) {
  const items = [
    { label: "All Semesters", value: ALL_SEMESTERS },
    ...semesters.map((s) => ({ label: s.title, value: String(s.id) })),
  ];

  return (
    <Select
      items={items}
      value={value}
      onValueChange={(next) => onValueChange(next ?? ALL_SEMESTERS)}
    >
      <SelectTrigger className={cn("h-9 bg-background whitespace-nowrap", className)}>
        <SelectValue placeholder="Semester" className="truncate" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
