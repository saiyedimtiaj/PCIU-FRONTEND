import type { ExamRoutine } from "@/types/academics";
import { courseLabel, formatIsoDate } from "@/lib/academics/routine-grid";
import { timeRangeSortKey } from "@/lib/academics/time-sort";
import RoutineInfoBar from "./RoutineInfoBar";

export default function ExamScheduleGrid({
  routines,
  department,
  batch,
  section,
}: {
  routines: ExamRoutine[];
  department: string;
  batch: string;
  section: string;
}) {
  const sorted = [...routines].sort(
    (a, b) => a.date.localeCompare(b.date) || timeRangeSortKey(a.timeSlot) - timeRangeSortKey(b.timeSlot),
  );

  return (
    <div className="bg-white">
      <RoutineInfoBar title="Exam Routine" department={department} batch={batch} section={section} />

      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="bg-[#0D2B45] text-white">
              <th className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold">
                Date
              </th>
              <th className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold">
                Time
              </th>
              <th className="border border-white/10 px-3 py-2.5 text-left font-semibold">Course</th>
              <th className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold">
                Room
              </th>
              <th className="whitespace-nowrap border border-white/10 px-3 py-2.5 text-left font-semibold">
                Roll
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, rowIndex) => {
              const rowBg = rowIndex % 2 === 0 ? "bg-white" : "bg-[#F6FAFF]";
              const room = [r.room, r.building].filter(Boolean).join(", ");
              return (
                <tr key={r.id} className={rowBg}>
                  <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 font-semibold text-[#0D2B45]">
                    {formatIsoDate(r.date)}
                  </td>
                  <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 text-[#0D2B45]">
                    {r.timeSlot}
                  </td>
                  <td className="border border-[#0D2B45]/10 px-3 py-3 font-semibold text-[#0D2B45]" title={courseLabel(r)}>
                    {courseLabel(r)}
                  </td>
                  <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 font-medium text-[#059669]">
                    {room}
                  </td>
                  <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 text-muted-foreground">
                    {r.studentRange}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
