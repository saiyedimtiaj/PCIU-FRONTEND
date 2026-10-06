"use client";

import { useMemo, useRef, useState } from "react";
import { Search, Building2 } from "lucide-react";
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
import type { FreeRoom, TimeSlotOption } from "@/types/academics";
import { CLASS_DAYS } from "@/lib/academics/routine-grid";

const ALL_BUILDINGS = "All Buildings";

function uniqueBuildings(rooms: FreeRoom[]): string[] {
  return Array.from(new Set(rooms.map((r) => r.buildingName).filter(Boolean))).sort();
}

/** API names are inconsistent ("A Building", "C") — normalize to "Building A". */
function buildingLabel(name: string): string {
  const code = name.replace(/building/i, "").trim();
  return code ? `Building ${code}` : "Other";
}

/** Rooms grouped under their building, buildings sorted by name. */
function groupByBuilding(rooms: FreeRoom[]): [string, FreeRoom[]][] {
  const groups = new Map<string, FreeRoom[]>();
  for (const room of rooms) {
    const key = buildingLabel(room.buildingName);
    groups.set(key, [...(groups.get(key) ?? []), room]);
  }
  return Array.from(groups).sort(([a], [b]) => a.localeCompare(b));
}

/**
 * `rooms[dayIndex][slotIndex]` is the whole week, fetched once on the server
 * (see `getFreeRoomsWeek`) — the day overview and the search result are just
 * slices of it, so nothing here hits the network.
 */
export default function FreeRoomsSection({
  timeSlots,
  rooms,
}: {
  timeSlots: TimeSlotOption[];
  rooms: FreeRoom[][][];
}) {
  const [day, setDay] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [buildingFilter, setBuildingFilter] = useState(ALL_BUILDINGS);

  const week = useMemo(
    () => CLASS_DAYS.map((d, i) => ({ dayKey: d.key, dayLabel: d.label, cells: rooms[i] ?? [] })),
    [rooms],
  );

  const dayIndex = CLASS_DAYS.findIndex((d) => d.key.toUpperCase() === day);

  const selectedSlot = timeSlots.find((s) => String(s.id) === timeSlotId);

  // The selected day's slots — narrowed to just the chosen slot once one is picked.
  const dayOverview = useMemo(
    () =>
      dayIndex === -1
        ? null
        : timeSlots
            .map((slot, i) => ({ slot, rooms: week[dayIndex].cells[i] ?? [] }))
            .filter(({ slot }) => !timeSlotId || String(slot.id) === timeSlotId),
    [dayIndex, timeSlots, week, timeSlotId],
  );

  const resultsRef = useRef<HTMLDivElement>(null);

  // Filtering is already live; Search just brings the result into view
  // (useful on mobile, where the filters stack above it).
  const handleSearch = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const dayItems = CLASS_DAYS.map((d) => ({ value: d.key.toUpperCase(), label: d.label }));
  const timeSlotItems = timeSlots.map((s) => ({ value: String(s.id), label: s.time }));

  const buildingOptions = useMemo(
    () => uniqueBuildings(week.flatMap((row) => row.cells.flat())),
    [week],
  );

  const byBuilding = (list: FreeRoom[]) =>
    buildingFilter === ALL_BUILDINGS ? list : list.filter((r) => r.buildingName === buildingFilter);

  const filteredDayOverview = dayOverview?.map((row) => ({ ...row, rooms: byBuilding(row.rooms) }));
  const filteredWeek = week.map((row) => ({ ...row, cells: row.cells.map(byBuilding) }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Check Free Rooms</h2>
        <p className="text-sm text-muted-foreground">
          Find available classrooms by day and time slot.
        </p>
      </div>

      <Card className="shadow-none border border-border/50 bg-card overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-4">
            <CardTitle className="text-lg font-semibold">Room Availability</CardTitle>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Select
                items={dayItems}
                value={day}
                onValueChange={(val) => {
                  setDay(val ?? "");
                  setTimeSlotId("");
                }}
              >
                <SelectTrigger className="w-full sm:w-30 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Day" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_DAYS.map((d) => (
                    <SelectItem key={d.key} value={d.key.toUpperCase()}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                items={timeSlotItems}
                value={timeSlotId}
                onValueChange={(val) => setTimeSlotId(val ?? "")}
              >
                <SelectTrigger className="w-full sm:w-48 h-9 bg-background whitespace-nowrap">
                  <SelectValue placeholder="Time Slot" className="truncate" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {buildingOptions.length > 0 && (
                <Select
                  items={[
                    { value: ALL_BUILDINGS, label: ALL_BUILDINGS },
                    ...buildingOptions.map((b) => ({ value: b, label: b })),
                  ]}
                  value={buildingFilter}
                  onValueChange={(val) => setBuildingFilter(val ?? ALL_BUILDINGS)}
                >
                  <SelectTrigger className="w-full sm:w-40 h-9 bg-background whitespace-nowrap">
                    <SelectValue placeholder="Building" className="truncate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_BUILDINGS}>{ALL_BUILDINGS}</SelectItem>
                    {buildingOptions.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                className="h-9 w-full sm:w-auto"
                onClick={handleSearch}
                disabled={!day || !timeSlotId}
              >
                <Search className="size-4 mr-1.5" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>

        {day && (
          <CardContent ref={resultsRef} className="scroll-mt-24 space-y-3 p-4 sm:p-6">
            <h3 className="text-base font-semibold text-foreground">
              {CLASS_DAYS[dayIndex]?.label} — {selectedSlot ? selectedSlot.time : "All Time Slots"}
            </h3>

            {selectedSlot ? (
              (filteredDayOverview?.[0]?.rooms ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No free rooms found for the selected filters.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredDayOverview?.[0]?.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
                    >
                      <Building2 className="size-4 text-primary/70 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{room.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {buildingLabel(room.buildingName)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDayOverview?.map(({ slot, rooms: slotRooms }) => (
                  <div key={slot.id} className="rounded-lg border border-border/50 bg-muted/10 p-3">
                    <p className="text-sm font-medium text-foreground mb-2">{slot.time}</p>
                    {slotRooms.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No free rooms</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {slotRooms.map((room) => (
                          <span
                            key={room.id}
                            className="inline-flex items-center gap-1 rounded-md bg-background border border-border/50 px-2 py-1 text-sm"
                          >
                            <Building2 className="size-3.5 text-primary/70" />
                            {room.name} ({buildingLabel(room.buildingName)})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}

        {!day && (
          <div className="overflow-x-auto">
            <Table className="min-w-max">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="w-25">Day</TableHead>
                  {timeSlots.map((s) => (
                    <TableHead key={s.id} className="whitespace-nowrap">
                      {s.time}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWeek?.map((row) => (
                  <TableRow key={row.dayKey}>
                    <TableCell className="font-medium whitespace-nowrap">{row.dayLabel}</TableCell>
                    {row.cells.map((cell, i) => (
                      <TableCell
                        key={i}
                        className="min-w-48 align-top text-muted-foreground whitespace-normal"
                      >
                        {cell.length === 0 ? (
                          "None"
                        ) : (
                          <div className="space-y-1.5">
                            {groupByBuilding(cell).map(([building, list]) => (
                              <p key={building}>
                                <span className="font-medium text-foreground">{building}:</span>{" "}
                                {list.map((r) => r.name).join(", ")}
                              </p>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
