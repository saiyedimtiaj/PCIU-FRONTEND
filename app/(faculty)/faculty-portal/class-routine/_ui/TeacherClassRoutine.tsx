"use client";

import { BookOpen, CalendarDays, Clock, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/stats/StatCard";
import { Alert } from "@/components/shared/Aleart";
import type { ClassRoutineItem, ClassTimeSlot } from "@/types/academics";
import { downloadRoutineGridPdf, filenameSegment, type RoutineGridRow } from "@/lib/academics/export-pdf";
import { CLASS_DAYS, buildClassGridColumns, courseLabel } from "@/lib/academics/routine-grid";

const TITLE = "Class Routine";
const DESCRIPTION = "Your weekly teaching schedule — which class, on which day, at what time.";

/** Raw API values are "DAY" / "EVENING" — shown title-cased in the UI. */
function shiftLabel(raw: string): string {
  return raw.charAt(0) + raw.slice(1).toLowerCase();
}

function groupLabel(r: ClassRoutineItem): string {
  const group = [r.batch, r.section && `Sec ${r.section}`].filter(Boolean).join(" · ");
  return [r.department, group].filter(Boolean).join(" – ");
}

function roomLabel(r: ClassRoutineItem): string {
  return [r.room, r.building].filter(Boolean).join(", ");
}

/** PDF cell text for one class — the teacher is the reader, so the batch/
 *  section they're teaching replaces the teacher line the public grid shows. */
function teacherCellText(r: ClassRoutineItem): string {
  return [
    courseLabel(r),
    groupLabel(r),
    roomLabel(r) && `Room: ${roomLabel(r)}`,
    r.shift && `${shiftLabel(r.shift)} shift`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function TeacherClassRoutine({
  routines,
  timeSlots,
  teacherName,
  error,
}: {
  routines: ClassRoutineItem[];
  timeSlots: ClassTimeSlot[];
  teacherName: string;
  error?: string;
}) {
  // Only show the slots this teacher actually uses — a full-university slot
  // list would leave most columns of a personal timetable empty.
  const usedSlots = new Set(routines.map((r) => r.timeSlot));
  const columns = buildClassGridColumns(routines, timeSlots).filter((c) => usedSlots.has(c));

  const courseCount = new Set(routines.map((r) => r.courseCode || r.courseName)).size;
  const groupCount = new Set(routines.map(groupLabel)).size;
  const dayCount = new Set(routines.map((r) => r.day.toLowerCase())).size;

  const handleDownload = async () => {
    const rows: RoutineGridRow[] = CLASS_DAYS.map(({ key, label }) => {
      const dayRows = routines.filter((r) => r.day.toLowerCase() === key);
      if (dayRows.length === 0) return { label, isOff: true };
      return {
        label,
        cells: columns.map((col) =>
          dayRows
            .filter((r) => r.timeSlot === col)
            .map(teacherCellText)
            .join("\n\n"),
        ),
      };
    });

    await downloadRoutineGridPdf({
      routineType: TITLE,
      filters: { teacher: teacherName || undefined },
      columns,
      rowLabelHeader: "Day",
      rows,
      emptyMessage: "No classes assigned.",
      filename: `${filenameSegment(teacherName, "My")}_Class_Routine.pdf`,
    });
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title={TITLE} description={DESCRIPTION} icon={CalendarDays} />
        <Alert variant="error" message={error} />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={TITLE}
        description={DESCRIPTION}
        icon={CalendarDays}
        actions={
          routines.length > 0 && (
            <Button variant="outlineSecondary" size="sm" onClick={handleDownload}>
              <Download className="mr-1.5 size-4" />
              Download PDF
            </Button>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Classes / Week" value={routines.length} icon={Clock} tone="primary" />
        <StatCard label="Courses" value={courseCount} icon={BookOpen} tone="info" />
        <StatCard label="Batches / Sections" value={groupCount} icon={Users} tone="success" />
        <StatCard label="Teaching Days" value={dayCount} icon={CalendarDays} tone="violet" />
      </div>

      {routines.length === 0 ? (
        <Card className="border border-border/50 shadow-none">
          <CardContent className="py-12 text-center text-muted-foreground">
            No classes have been assigned to you yet. Once the admin adds you to the class routine,
            your schedule will appear here.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden border border-border/50 p-0 shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-sm">
              <thead>
                <tr className="bg-[#0D2B45] text-white">
                  <th className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold">
                    Day / Time
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CLASS_DAYS.map(({ key, label }, rowIndex) => {
                  const dayRows = routines.filter((r) => r.day.toLowerCase() === key);
                  const rowBg = rowIndex % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]";

                  return (
                    <tr key={key} className={rowBg}>
                      <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 font-semibold text-[#0D2B45]">
                        {label}
                      </td>
                      {dayRows.length === 0 ? (
                        <td
                          colSpan={columns.length}
                          className="border border-[#0D2B45]/10 bg-[#F6FAFF] px-3 py-3 text-center font-semibold text-[#0D2B45]/70"
                        >
                          NO CLASS
                        </td>
                      ) : (
                        columns.map((col) => {
                          const cellItems = dayRows.filter((r) => r.timeSlot === col);
                          return (
                            <td key={col} className="border border-[#0D2B45]/10 px-3 py-3 align-top">
                              <div className="space-y-3">
                                {cellItems.map((item) => (
                                  <div key={item.id} className="space-y-0.5">
                                    <p className="font-semibold text-[#0D2B45]">{courseLabel(item)}</p>
                                    <p className="text-xs text-muted-foreground">{groupLabel(item)}</p>
                                    {roomLabel(item) && (
                                      <p className="text-xs font-medium text-[#059669]">
                                        Room: {roomLabel(item)}
                                      </p>
                                    )}
                                    {item.shift && (
                                      <Badge variant={item.shift === "DAY" ? "info" : "secondary"}>
                                        {shiftLabel(item.shift)}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
