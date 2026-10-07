"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Semester } from "@/types/academics";
import { ALL_EXAM_TYPES, EXAM_TYPES } from "@/lib/academics/exam-type";
import SemesterSelect, { ALL_SEMESTERS } from "./SemesterSelect";

const EXAM_TYPE_ITEMS = [
  { label: "All Exams", value: ALL_EXAM_TYPES },
  ...EXAM_TYPES.map((t) => ({ label: t.label, value: t.value })),
];

/** URL-driven (?semesterId=&type=) so the server renders only the matching exams. */
export default function ExamSemesterFilter({
  semesters,
  semester,
  examType,
}: {
  semesters: Semester[];
  semester: string;
  examType: string;
}) {
  const router = useRouter();

  // Drop examId: the previously active exam may not match the new filters.
  const navigate = (nextSemester: string, nextType: string) => {
    const params = new URLSearchParams();
    if (nextSemester !== ALL_SEMESTERS) params.set("semesterId", nextSemester);
    if (nextType !== ALL_EXAM_TYPES) params.set("type", nextType);
    const query = params.toString();
    router.push(`/academics/exam-schedule${query ? `?${query}` : ""}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:flex">
      {semesters.length > 0 && (
        <SemesterSelect
          semesters={semesters}
          value={semester}
          className="w-full sm:w-44"
          onValueChange={(next) => navigate(next, examType)}
        />
      )}
      <Select
        items={EXAM_TYPE_ITEMS}
        value={examType}
        onValueChange={(next) => navigate(semester, next ?? ALL_EXAM_TYPES)}
      >
        <SelectTrigger className="h-9 w-full bg-background whitespace-nowrap sm:w-40">
          <SelectValue placeholder="Exam Type" className="truncate" />
        </SelectTrigger>
        <SelectContent>
          {EXAM_TYPE_ITEMS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
