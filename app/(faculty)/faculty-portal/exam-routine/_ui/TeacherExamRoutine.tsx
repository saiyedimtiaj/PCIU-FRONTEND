"use client";

import { useMemo, useState } from "react";
import { BookOpen, CalendarClock, CalendarDays, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/stats/StatCard";
import { Alert } from "@/components/shared/Aleart";
import type { ExamRoutine } from "@/types/academics";
import { downloadRoutinePdf, filenameSegment } from "@/lib/academics/export-pdf";
import { timeRangeSortKey } from "@/lib/academics/time-sort";
import { courseLabel, formatIsoDate } from "@/lib/academics/routine-grid";

const TITLE = "Exam Routine";
const DESCRIPTION = "Exam sittings for the courses, batches and sections you teach.";
const ALL_EXAMS = "all";

/** Raw API values are "DAY" / "EVENING" — shown title-cased in the UI. */
function shiftLabel(raw: string): string {
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

function groupLabel(r: ExamRoutine): string {
  const group = [r.batch, r.section && `Sec ${r.section}`].filter(Boolean).join(" · ");
  return [r.department, group].filter(Boolean).join(" – ");
}

function roomLabel(r: ExamRoutine): string {
  return [r.room, r.building].filter(Boolean).join(", ");
}

export default function TeacherExamRoutine({
  routines,
  teacherName,
  error,
}: {
  routines: ExamRoutine[];
  teacherName: string;
  error?: string;
}) {
  const exams = useMemo(
    () =>
      Array.from(new Map(routines.map((r) => [r.examId, r.examName || `Exam ${r.examId}`])).entries()),
    [routines],
  );
  const [examFilter, setExamFilter] = useState(ALL_EXAMS);

  const filtered = useMemo(
    () =>
      routines
        .filter((r) => examFilter === ALL_EXAMS || String(r.examId) === examFilter)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            timeRangeSortKey(a.timeSlot) - timeRangeSortKey(b.timeSlot) ||
            a.id - b.id,
        ),
    [routines, examFilter],
  );

  const showExamColumn = examFilter === ALL_EXAMS && exams.length > 1;
  const selectedExamName =
    examFilter === ALL_EXAMS ? undefined : exams.find(([id]) => String(id) === examFilter)?.[1];

  const courseCount = new Set(filtered.map((r) => r.courseCode || r.courseName)).size;
  const dayCount = new Set(filtered.map((r) => r.date)).size;

  const handleDownload = async () => {
    await downloadRoutinePdf({
      routineType: TITLE,
      examName: selectedExamName,
      filters: { teacher: teacherName || undefined },
      columns: [
        "Date",
        "Time",
        ...(showExamColumn ? ["Exam"] : []),
        "Course",
        "Batch / Section",
        "Room",
        "Shift",
        "Roll",
      ],
      rows: filtered.map((r) => [
        formatIsoDate(r.date),
        r.timeSlot,
        ...(showExamColumn ? [r.examName ?? ""] : []),
        courseLabel(r),
        groupLabel(r),
        roomLabel(r),
        r.shift ? shiftLabel(r.shift) : "",
        r.studentRange,
      ]),
      emptyMessage: "No exam sittings found.",
      filename: [
        filenameSegment(teacherName, "My"),
        selectedExamName ? filenameSegment(selectedExamName) : null,
        "Exam_Routine.pdf",
      ]
        .filter(Boolean)
        .join("_"),
    });
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title={TITLE} description={DESCRIPTION} icon={CalendarClock} />
        <Alert variant="error" message={error} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        icon={CalendarClock}
        actions={
          <>
            {exams.length > 1 && (
              <Select value={examFilter} onValueChange={(val) => setExamFilter(val || ALL_EXAMS)}>
                <SelectTrigger className="h-9 w-44 bg-background">
                  <SelectValue placeholder="All exams" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_EXAMS}>All exams</SelectItem>
                  {exams.map(([id, name]) => (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filtered.length > 0 && (
              <Button variant="outlineSecondary" size="sm" onClick={handleDownload}>
                <Download className="mr-1.5 size-4" />
                Download PDF
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Exam Sittings" value={filtered.length} icon={FileText} tone="primary" />
        <StatCard label="Courses" value={courseCount} icon={BookOpen} tone="info" />
        <StatCard label="Exam Days" value={dayCount} icon={CalendarDays} tone="violet" />
      </div>

      {routines.length === 0 ? (
        <Card className="border border-border/50 shadow-none">
          <CardContent className="py-12 text-center text-muted-foreground">
            No exams are scheduled for the courses you teach yet. Exam sittings appear here once
            they&apos;re added for a course, batch and section in your class routine.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/50 p-0 shadow-none">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-30">Date</TableHead>
                  <TableHead className="w-35">Time</TableHead>
                  {showExamColumn && <TableHead>Exam</TableHead>}
                  <TableHead>Course</TableHead>
                  <TableHead>Batch / Section</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead className="w-22">Shift</TableHead>
                  <TableHead>Roll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap font-medium">{formatIsoDate(row.date)}</TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">{row.timeSlot}</TableCell>
                    {showExamColumn && <TableCell>{row.examName}</TableCell>}
                    <TableCell className="font-medium text-[#0D2B45]">{courseLabel(row)}</TableCell>
                    <TableCell>{groupLabel(row)}</TableCell>
                    <TableCell className="text-[#059669]">{roomLabel(row)}</TableCell>
                    <TableCell>
                      {row.shift && (
                        <Badge variant={row.shift === "DAY" ? "info" : "secondary"}>
                          {shiftLabel(row.shift)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.studentRange}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
