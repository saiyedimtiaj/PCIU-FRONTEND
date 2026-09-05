import type { ClassRoutineItem, ClassTimeSlot } from "@/types/academics";
import { CLASS_DAYS, buildClassGridColumns, courseLabel } from "@/lib/academics/routine-grid";
import RoutineInfoBar from "./RoutineInfoBar";

export default function ClassScheduleGrid({
  routines,
  timeSlots,
  department,
  batch,
  section,
}: {
  routines: ClassRoutineItem[];
  timeSlots: ClassTimeSlot[];
  department: string;
  batch: string;
  section: string;
}) {
  const columns = buildClassGridColumns(routines, timeSlots);

  return (
    <div className="bg-white">
      <RoutineInfoBar
        title="Class Schedule"
        department={department}
        batch={batch}
        section={section}
      />

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

              if (dayRows.length === 0) {
                return (
                  <tr key={key} className={rowBg}>
                    <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 font-semibold text-[#0D2B45]">
                      {label}
                    </td>
                    <td
                      colSpan={columns.length}
                      className="border border-[#0D2B45]/10 bg-[#F6FAFF] px-3 py-3 text-center font-semibold text-[#0D2B45]/70"
                    >
                      DAY OFF
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={key} className={rowBg}>
                  <td className="whitespace-nowrap border border-[#0D2B45]/10 px-3 py-3 font-semibold text-[#0D2B45]">
                    {label}
                  </td>
                  {columns.map((col) => {
                    const cellItems = dayRows.filter((r) => r.timeSlot === col);
                    return (
                      <td key={col} className="border border-[#0D2B45]/10 px-3 py-3 align-top">
                        {cellItems.length > 0 ? (
                          <div className="space-y-2">
                            {cellItems.map((item) => (
                              <div key={item.id}>
                                <p className="font-semibold text-[#0D2B45]" title={courseLabel(item)}>
                                  {courseLabel(item)}
                                </p>
                                {item.teacher && (
                                  <p className="text-xs text-muted-foreground">{item.teacher}</p>
                                )}
                                {(item.room || item.building) && (
                                  <p className="text-xs font-medium text-[#059669]">
                                    Room: {[item.room, item.building].filter(Boolean).join(", ")}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
