"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import type { ClassRoutineItem, ClassTimeSlot, Semester } from "@/types/academics";
import {
  downloadRoutinePdf,
  downloadRoutineGridPdf,
  filenameSegment,
  batchFilenamePart,
  sectionFilenamePart,
  shiftFilenamePart,
  type RoutineGridRow,
} from "@/lib/academics/export-pdf";
import { timeRangeSortKey } from "@/lib/academics/time-sort";
import {
  CLASS_DAYS,
  buildClassGridColumns,
  classCellText,
  courseLabel,
} from "@/lib/academics/routine-grid";
import ClassScheduleGrid from "./ClassScheduleGrid";
import SemesterSelect, { ALL_SEMESTERS } from "./SemesterSelect";

const DEFAULT_FILTER = {
  department: "Department",
  batch: "Batch",
  section: "Section",
  shift: "Shift",
};
const DAY_ORDER = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

/** Raw API values are "DAY" / "EVENING" — shown title-cased in the UI. */
function shiftLabel(raw: string): string {
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

function dedupeById(items: ClassRoutineItem[]): ClassRoutineItem[] {
  return Array.from(new Map(items.map((r) => [r.id, r])).values());
}

function dayOrderKey(day: string): number {
  const idx = DAY_ORDER.indexOf(day.toLowerCase());
  return idx === -1 ? DAY_ORDER.length : idx;
}

export default function ClassRoutineInteractive({
  routines: allRoutines,
  timeSlots,
  semesters,
  currentSemesterId,
}: {
  routines: ClassRoutineItem[];
  timeSlots: ClassTimeSlot[];
  semesters: Semester[];
  /** Today's semester — selected by default, and where routines with no semester land. */
  currentSemesterId?: number;
}) {
  const [semesterFilter, setSemesterFilter] = useState(
    currentSemesterId ? String(currentSemesterId) : ALL_SEMESTERS,
  );
  const [shiftFilter, setShiftFilter] = useState(DEFAULT_FILTER.shift);
  const [departmentFilter, setDepartmentFilter] = useState(DEFAULT_FILTER.department);
  const [batchFilter, setBatchFilter] = useState(DEFAULT_FILTER.batch);
  const [sectionFilter, setSectionFilter] = useState(DEFAULT_FILTER.section);
  const [searchQuery, setSearchQuery] = useState("");

  // Semester wraps every other filter. The class-routine API doesn't return a
  // semester yet, so a routine without one is treated as part of the current
  // semester (a published class routine is, by nature, the running one). Once
  // the API sends semesterId, each routine lands in its real semester instead.
  const hasSemesters = semesters.length > 0;
  const activeSemester = semesters.find((s) => String(s.id) === semesterFilter);
  const routines = useMemo(
    () =>
      activeSemester
        ? allRoutines.filter(
            (r) => (r.semesterId ?? currentSemesterId) === activeSemester.id,
          )
        : allRoutines,
    [allRoutines, activeSemester, currentSemesterId],
  );

  // Shift (Day/Evening) is the outermost split — the same department/batch/
  // section combo can exist under both shifts, so it narrows every pool below
  // it the same way Department narrows Batch and Section.
  const shifts = useMemo(
    () => uniqueSorted(routines.map((r) => r.shift ?? "")),
    [routines],
  );

  // Cascading option pools: Batch narrows to the selected Department, Section
  // narrows to the selected Department + Batch.
  const departments = useMemo(
    () =>
      uniqueSorted(
        routines
          .filter((r) => shiftFilter === DEFAULT_FILTER.shift || r.shift === shiftFilter)
          .map((r) => r.department),
      ),
    [routines, shiftFilter],
  );

  const batches = useMemo(
    () =>
      uniqueSorted(
        routines
          .filter(
            (r) =>
              (shiftFilter === DEFAULT_FILTER.shift || r.shift === shiftFilter) &&
              (departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter),
          )
          .map((r) => r.batch),
      ),
    [routines, shiftFilter, departmentFilter],
  );

  const sections = useMemo(
    () =>
      uniqueSorted(
        routines
          .filter(
            (r) =>
              (shiftFilter === DEFAULT_FILTER.shift || r.shift === shiftFilter) &&
              (departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter) &&
              (batchFilter === DEFAULT_FILTER.batch || r.batch === batchFilter),
          )
          .map((r) => r.section),
      ),
    [routines, shiftFilter, departmentFilter, batchFilter],
  );

  const filteredRoutines = useMemo(() => {
    return dedupeById(routines).filter((r) => {
      const matchesShift = shiftFilter === DEFAULT_FILTER.shift || r.shift === shiftFilter;
      const matchesDept = departmentFilter === DEFAULT_FILTER.department || r.department === departmentFilter;
      const matchesBatch = batchFilter === DEFAULT_FILTER.batch || r.batch === batchFilter;
      const matchesSection = sectionFilter === DEFAULT_FILTER.section || r.section === sectionFilter;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        r.courseCode.toLowerCase().includes(query) ||
        r.courseName.toLowerCase().includes(query) ||
        r.teacher.toLowerCase().includes(query) ||
        r.room.toLowerCase().includes(query);

      return matchesShift && matchesDept && matchesBatch && matchesSection && matchesSearch;
    }).sort(
      (a, b) =>
        dayOrderKey(a.day) - dayOrderKey(b.day) ||
        timeRangeSortKey(a.timeSlot) - timeRangeSortKey(b.timeSlot) ||
        a.id - b.id,
    );
  }, [routines, shiftFilter, departmentFilter, batchFilter, sectionFilter, searchQuery]);

  const showGrid =
    (shifts.length === 0 || shiftFilter !== DEFAULT_FILTER.shift) &&
    departmentFilter !== DEFAULT_FILTER.department &&
    batchFilter !== DEFAULT_FILTER.batch &&
    sectionFilter !== DEFAULT_FILTER.section &&
    searchQuery.trim() === "";

  if (allRoutines.length === 0) {
    return (
      <Card className="shadow-none border border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          No class routine available.
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async () => {
    const filenameParts = [
      activeSemester ? filenameSegment(activeSemester.title) : null,
      shiftFilter !== DEFAULT_FILTER.shift ? shiftFilenamePart(shiftFilter) : null,
      departmentFilter !== DEFAULT_FILTER.department ? filenameSegment(departmentFilter) : null,
      batchFilter !== DEFAULT_FILTER.batch ? batchFilenamePart(batchFilter) : null,
      sectionFilter !== DEFAULT_FILTER.section ? sectionFilenamePart(sectionFilter) : null,
    ].filter((v): v is string => Boolean(v));

    const filters = {
      department: departmentFilter !== DEFAULT_FILTER.department ? departmentFilter : undefined,
      batch: batchFilter !== DEFAULT_FILTER.batch ? batchFilter : undefined,
      section: sectionFilter !== DEFAULT_FILTER.section ? sectionFilter : undefined,
      shift: shiftFilter !== DEFAULT_FILTER.shift ? shiftLabel(shiftFilter) : undefined,
    };
    const filename = `${(filenameParts.length ? filenameParts : ["All"]).join("_")}_Class_Routine.pdf`;

    if (showGrid) {
      const columns = buildClassGridColumns(filteredRoutines, timeSlots);
      const rows: RoutineGridRow[] = CLASS_DAYS.map(({ key, label }) => {
        const dayRows = filteredRoutines.filter((r) => r.day.toLowerCase() === key);
        if (dayRows.length === 0) return { label, isOff: true };
        return {
          label,
          cells: columns.map((col) =>
            dayRows
              .filter((r) => r.timeSlot === col)
              .map(classCellText)
              .join("\n\n"),
          ),
        };
      });

      await downloadRoutineGridPdf({
        routineType: "Class Routine",
        filters,
        columns,
        rowLabelHeader: "Day",
        rows,
        emptyMessage: "No classes scheduled for the selected filters.",
        filename,
      });
      return;
    }

    const hasShift = filteredRoutines.some((r) => r.shift);

    await downloadRoutinePdf({
      routineType: "Class Routine",
      filters,
      columns: [
        "Day",
        "Time",
        "Course",
        "Teacher",
        "Dept / Batch",
        "Room",
        "Student Range",
        ...(hasShift ? ["Shift"] : []),
      ],
      rows: filteredRoutines.map((r) => [
        r.day,
        r.timeSlot,
        courseLabel(r),
        r.teacher,
        `${r.department} - ${r.batch} (${r.section})`,
        r.room,
        r.studentRange,
        ...(hasShift ? [r.shift ? shiftLabel(r.shift) : ""] : []),
      ]),
      emptyMessage: "No classes scheduled for the selected filters.",
      filename,
    });
  };

  return (
    <Card className="shadow-none border border-border/50 bg-card overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3 sm:px-6 print:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-semibold">Routine Details</CardTitle>
            <Button variant="outlineSecondary" size="sm" className="w-full sm:w-auto" onClick={handleDownload}>
              <Download className="size-4 mr-1.5" />
              Download Routine
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="relative col-span-2 sm:flex-1 sm:min-w-50">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search course title, teacher, or room..."
                className="pl-8 h-9 w-full bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {hasSemesters && (
              <SemesterSelect
                semesters={semesters}
                value={semesterFilter}
                className="w-full min-w-0 px-3 sm:w-40"
                onValueChange={(val) => {
                  setSemesterFilter(val);
                  setShiftFilter(DEFAULT_FILTER.shift);
                  setDepartmentFilter(DEFAULT_FILTER.department);
                  setBatchFilter(DEFAULT_FILTER.batch);
                  setSectionFilter(DEFAULT_FILTER.section);
                }}
              />
            )}

            {shifts.length > 0 && (
              <Select
                value={shiftFilter}
                onValueChange={(val) => {
                  setShiftFilter(val || DEFAULT_FILTER.shift);
                  setDepartmentFilter(DEFAULT_FILTER.department);
                  setBatchFilter(DEFAULT_FILTER.batch);
                  setSectionFilter(DEFAULT_FILTER.section);
                }}
              >
                <SelectTrigger className="w-full min-w-0 px-3 sm:w-30 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Shift" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={DEFAULT_FILTER.shift}>Shift</SelectItem>
                  {shifts.map((s) => (
                    <SelectItem key={s} value={s}>
                      {shiftLabel(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {departments.length > 0 && (
              <Select
                value={departmentFilter}
                onValueChange={(val) => {
                  setDepartmentFilter(val || DEFAULT_FILTER.department);
                  setBatchFilter(DEFAULT_FILTER.batch);
                  setSectionFilter(DEFAULT_FILTER.section);
                }}
              >
                <SelectTrigger className="w-full min-w-0 px-3 sm:w-30 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Dept" className="truncate" />
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
                <SelectTrigger className="w-full min-w-0 px-3 sm:w-30 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Batch" className="truncate" />
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
                <SelectTrigger className="w-full min-w-0 px-3 sm:w-30 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Section" className="truncate" />
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
      {showGrid ? (
        <ClassScheduleGrid
          routines={filteredRoutines}
          timeSlots={timeSlots}
          department={departmentFilter}
          batch={batchFilter}
          section={sectionFilter}
          shift={shiftFilter !== DEFAULT_FILTER.shift ? shiftLabel(shiftFilter) : undefined}
        />
      ) : filteredRoutines.length === 0 ? (
        // Outside the 950px-wide table, so the message stays on-screen on phones.
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          {activeSemester && routines.length === 0
            ? `Class routine for ${activeSemester.title} has not been published yet.`
            : "No classes scheduled matching your filters."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-[950px]">
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-25">Day</TableHead>
                <TableHead className="w-35">Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Dept / Batch</TableHead>
                {shifts.length > 0 && <TableHead className="w-22">Shift</TableHead>}
                <TableHead className="w-25">Room</TableHead>
                <TableHead>Student Range</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutines.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium whitespace-nowrap">{row.day}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {row.timeSlot}
                    </TableCell>
                    <TableCell className="max-w-50 truncate" title={courseLabel(row)}>
                      {courseLabel(row)}
                    </TableCell>
                    <TableCell>{row.teacher}</TableCell>
                    <TableCell>
                      {row.department} - {row.batch} ({row.section})
                    </TableCell>
                    {shifts.length > 0 && (
                      <TableCell>
                        {row.shift && (
                          <Badge variant={row.shift === "DAY" ? "info" : "secondary"}>
                            {shiftLabel(row.shift)}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{[row.room, row.building].filter(Boolean).join(", ")}</TableCell>
                    <TableCell className="text-muted-foreground">{row.studentRange}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      )}
      {timeSlots.length === 0 && (
        <p className="px-4 py-2 text-xs text-muted-foreground border-t border-border/50">
          Time slots are not configured yet — showing routine times as provided.
        </p>
      )}
    </Card>
  );
}
