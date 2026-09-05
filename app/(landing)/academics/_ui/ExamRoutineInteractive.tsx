"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { parseISO, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamRoutine } from "@/types/academics";
import {
  downloadRoutinePdf,
  filenameSegment,
  batchFilenamePart,
  sectionFilenamePart,
} from "@/lib/academics/export-pdf";
import { timeRangeSortKey } from "@/lib/academics/time-sort";

const DEFAULT_FILTER = { department: "Department", batch: "Batch", section: "Section" };

function courseLabel(r: ExamRoutine): string {
  return r.courseCode && r.courseName
    ? `${r.courseCode} – ${r.courseName}`
    : r.courseCode || r.courseName;
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function dedupeById(items: ExamRoutine[]): ExamRoutine[] {
  return Array.from(new Map(items.map((r) => [r.id, r])).values());
}

export default function ExamRoutineInteractive({
  routines,
  examId,
  examName,
}: {
  /** All exam routines across every exam — used so the Department/Batch/Section
   *  dropdowns aren't limited to whatever this one exam happens to have. */
  routines: ExamRoutine[];
  examId: number;
  examName?: string;
}) {
  const [departmentFilter, setDepartmentFilter] = useState(DEFAULT_FILTER.department);
  const [batchFilter, setBatchFilter] = useState(DEFAULT_FILTER.batch);
  const [sectionFilter, setSectionFilter] = useState(DEFAULT_FILTER.section);
  const [dateFilter, setDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const examRoutines = useMemo(
    () => routines.filter((r) => r.examId === examId),
    [routines, examId],
  );

  // Cascading option pools: Batch narrows to the selected Department, Section
  // narrows to the selected Department + Batch. Sourced from all exams (not
  // just this one) so switching exams doesn't hide a department/batch/section
  // combo that simply has no paper under the currently active exam.
  const departments = useMemo(() => uniqueSorted(routines.map((r) => r.department)), [routines]);

  const batches = useMemo(
    () =>
      uniqueSorted(
        routines
          .filter((r) => departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter)
          .map((r) => r.batch),
      ),
    [routines, departmentFilter],
  );

  const sections = useMemo(
    () =>
      uniqueSorted(
        routines
          .filter(
            (r) =>
              (departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter) &&
              (batchFilter === DEFAULT_FILTER.batch || r.batch === batchFilter),
          )
          .map((r) => r.section),
      ),
    [routines, departmentFilter, batchFilter],
  );

  const filteredRoutines = useMemo(() => {
    return dedupeById(examRoutines).filter((r) => {
      const matchesDept = departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter;
      const matchesBatch = batchFilter === DEFAULT_FILTER.batch || r.batch === batchFilter;
      const matchesSection = sectionFilter === DEFAULT_FILTER.section || r.section === sectionFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        r.courseCode.toLowerCase().includes(query) ||
        r.courseName.toLowerCase().includes(query) ||
        r.room.toLowerCase().includes(query);

      let matchesDate = true;
      if (dateFilter) {
        try {
          matchesDate = isSameDay(parseISO(r.date), parseISO(dateFilter));
        } catch {
          matchesDate = false;
        }
      }

      return matchesDept && matchesBatch && matchesSection && matchesSearch && matchesDate;
    }).sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        timeRangeSortKey(a.timeSlot) - timeRangeSortKey(b.timeSlot) ||
        a.id - b.id,
    );
  }, [examRoutines, departmentFilter, batchFilter, sectionFilter, searchQuery, dateFilter]);

  if (examRoutines.length === 0) {
    return (
      <Card className="shadow-none border border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          No routine available for this examination yet.
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async () => {
    const parts = [
      departmentFilter !== DEFAULT_FILTER.department ? filenameSegment(departmentFilter) : null,
      batchFilter !== DEFAULT_FILTER.batch ? batchFilenamePart(batchFilter) : null,
      sectionFilter !== DEFAULT_FILTER.section ? sectionFilenamePart(sectionFilter) : null,
    ].filter((v): v is string => Boolean(v));

    await downloadRoutinePdf({
      routineType: "Exam Routine",
      examName,
      filters: {
        department: departmentFilter !== DEFAULT_FILTER.department ? departmentFilter : undefined,
        batch: batchFilter !== DEFAULT_FILTER.batch ? batchFilter : undefined,
        section: sectionFilter !== DEFAULT_FILTER.section ? sectionFilter : undefined,
      },
      columns: ["Date", "Time", "Course", "Dept / Batch", "Room", "Student Range"],
      rows: filteredRoutines.map((r) => [
        r.date,
        r.timeSlot,
        courseLabel(r),
        `${r.department} - ${r.batch} (${r.section})`,
        r.room,
        r.studentRange,
      ]),
      emptyMessage: "No routine found for the selected filters.",
      filename: `${(parts.length ? parts : ["All"]).join("_")}_Exam_Routine.pdf`,
    });
  };

  return (
    <Card className="shadow-none border border-border/50 bg-card overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold">Routine Details</CardTitle>
            <Button variant="outlineSecondary" size="sm" onClick={handleDownload}>
              <Download className="size-4 mr-1.5" />
              Download Exam Routine
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search course title/code or room..."
                className="pl-8 h-9 w-full bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Input
              type="date"
              className="h-9 w-auto bg-background"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              title="Filter by Date"
            />

            {departments.length > 0 && (
              <Select
                value={departmentFilter}
                onValueChange={(val) => {
                  setDepartmentFilter(val || DEFAULT_FILTER.department);
                  setBatchFilter(DEFAULT_FILTER.batch);
                  setSectionFilter(DEFAULT_FILTER.section);
                }}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_FILTER.department}>Department</SelectItem>
                  {departments.map((dep) => (
                    <SelectItem key={dep} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {batches.length > 0 && (
              <Select
                value={batchFilter}
                onValueChange={(val) => {
                  setBatchFilter(val || DEFAULT_FILTER.batch);
                  setSectionFilter(DEFAULT_FILTER.section);
                }}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_FILTER.batch}>Batch</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {sections.length > 0 && (
              <Select
                value={sectionFilter}
                onValueChange={(val) => setSectionFilter(val || DEFAULT_FILTER.section)}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_FILTER.section}>Section</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-30">Date</TableHead>
              <TableHead className="w-35">Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Dept / Batch</TableHead>
              <TableHead className="w-25">Room</TableHead>
              <TableHead>Student Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoutines.length > 0 ? (
              filteredRoutines.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium whitespace-nowrap">{row.date}</TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {row.timeSlot}
                  </TableCell>
                  <TableCell className="max-w-50 truncate" title={courseLabel(row)}>
                    {courseLabel(row)}
                  </TableCell>
                  <TableCell>
                    {row.department} - {row.batch} ({row.section})
                  </TableCell>
                  <TableCell>{[row.room, row.building].filter(Boolean).join(", ")}</TableCell>
                  <TableCell className="text-muted-foreground">{row.studentRange}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No routines found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
