"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Search, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FreeRoom, TimeSlotOption } from "@/types/academics";
import { CLASS_DAYS } from "@/lib/academics/routine-grid";
import { searchFreeRooms } from "../_actions/free-rooms";

const ALL_BUILDINGS = "All Buildings";

function uniqueBuildings(rooms: FreeRoom[]): string[] {
  return Array.from(new Set(rooms.map((r) => r.buildingName).filter(Boolean))).sort();
}

interface WeekRow {
  dayKey: string;
  dayLabel: string;
  cells: FreeRoom[][];
}

export default function FreeRoomsSection({
  timeSlots,
}: {
  timeSlots: TimeSlotOption[];
}) {
  const [day, setDay] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [buildingFilter, setBuildingFilter] = useState(ALL_BUILDINGS);

  const [rooms, setRooms] = useState<FreeRoom[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const [week, setWeek] = useState<WeekRow[] | null>(null);
  const [weekLoading, setWeekLoading] = useState(true);

  useEffect(() => {
    if (timeSlots.length === 0) {
      setWeekLoading(false);
      return;
    }
    let cancelled = false;
    setWeekLoading(true);

    Promise.all(
      CLASS_DAYS.map(async (d) => {
        const cells = await Promise.all(
          timeSlots.map((s) => searchFreeRooms({ day: d.key.toUpperCase(), timeSlotId: s.id })),
        );
        return { dayKey: d.key, dayLabel: d.label, cells };
      }),
    ).then((rowsResult) => {
      if (!cancelled) {
        setWeek(rowsResult);
        setWeekLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [timeSlots]);

  const [dayOverview, setDayOverview] = useState<{ slot: TimeSlotOption; rooms: FreeRoom[] }[] | null>(null);
  const [dayOverviewLoading, setDayOverviewLoading] = useState(false);

  useEffect(() => {
    if (!day || timeSlots.length === 0) {
      setDayOverview(null);
      return;
    }
    let cancelled = false;
    setDayOverviewLoading(true);
    setDayOverview(null);

    Promise.all(
      timeSlots.map(async (slot) => ({
        slot,
        rooms: await searchFreeRooms({ day, timeSlotId: slot.id }),
      })),
    ).then((result) => {
      if (!cancelled) {
        setDayOverview(result);
        setDayOverviewLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [day, timeSlots]);

  const handleSearch = () => {
    if (!day || !timeSlotId) return;
    startTransition(async () => {
      const result = await searchFreeRooms({ day, timeSlotId: Number(timeSlotId) });
      setRooms(result);
    });
  };

  const dayItems = CLASS_DAYS.map((d) => ({ value: d.key.toUpperCase(), label: d.label }));
  const timeSlotItems = timeSlots.map((s) => ({ value: String(s.id), label: s.time }));

  const buildingOptions = useMemo(() => {
    const pool =
      rooms ??
      dayOverview?.flatMap((row) => row.rooms) ??
      week?.flatMap((row) => row.cells.flat()) ??
      [];
    return uniqueBuildings(pool);
  }, [rooms, dayOverview, week]);

  const filteredRooms = useMemo(() => {
    if (!rooms) return null;
    if (buildingFilter === ALL_BUILDINGS) return rooms;
    return rooms.filter((r) => r.buildingName === buildingFilter);
  }, [rooms, buildingFilter]);

  const filteredDayOverview = useMemo(() => {
    if (!dayOverview) return null;
    if (buildingFilter === ALL_BUILDINGS) return dayOverview;
    return dayOverview.map((row) => ({
      slot: row.slot,
      rooms: row.rooms.filter((r) => r.buildingName === buildingFilter),
    }));
  }, [dayOverview, buildingFilter]);

  const filteredWeek = useMemo(() => {
    if (!week) return null;
    if (buildingFilter === ALL_BUILDINGS) return week;
    return week.map((row) => ({
      ...row,
      cells: row.cells.map((cell) => cell.filter((r) => r.buildingName === buildingFilter)),
    }));
  }, [week, buildingFilter]);

  return (
    <Card className="shadow-none border border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Check Free Rooms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            items={dayItems}
            value={day}
            onValueChange={(val) => {
              setDay(val);
              setTimeSlotId("");
              setRooms(null);
            }}
          >
            <SelectTrigger className="w-40 bg-background">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_DAYS.map((d) => (
                <SelectItem key={d.key} value={d.key.toUpperCase()}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select items={timeSlotItems} value={timeSlotId} onValueChange={setTimeSlotId}>
            <SelectTrigger className="w-48 bg-background">
              <SelectValue placeholder="Time Slot" />
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
              onValueChange={setBuildingFilter}
            >
              <SelectTrigger className="w-44 bg-background">
                <SelectValue placeholder="Building" />
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

          <Button onClick={handleSearch} disabled={!day || !timeSlotId || isPending}>
            <Search className="size-4 mr-1.5" />
            {isPending ? "Searching..." : "Search"}
          </Button>
        </div>

        {filteredRooms !== null &&
          (filteredRooms.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No free rooms found for the selected filters.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-4 py-3"
                >
                  <Building2 className="size-4 text-primary/70 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{room.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Building {room.buildingName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {day ? (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {CLASS_DAYS.find((d) => d.key.toUpperCase() === day)?.label} — All Time Slots
            </h4>
            {dayOverviewLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDayOverview?.map(({ slot, rooms: slotRooms }) => (
                  <div
                    key={slot.id}
                    className="rounded-lg border border-border/50 bg-muted/10 p-3"
                  >
                    <p className="text-sm font-medium text-foreground mb-2">{slot.time}</p>
                    {slotRooms.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No free rooms</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {slotRooms.map((room) => (
                          <span
                            key={room.id}
                            className="inline-flex items-center gap-1 rounded-md bg-background border border-border/50 px-2 py-1 text-xs"
                          >
                            <Building2 className="size-3 text-primary/70" />
                            {room.name} ({room.buildingName})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Full Week Overview</h4>
            {weekLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-max border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="whitespace-nowrap border border-border/50 px-3 py-2 text-left font-semibold">
                        Day
                      </th>
                      {timeSlots.map((s) => (
                        <th
                          key={s.id}
                          className="whitespace-nowrap border border-border/50 px-3 py-2 text-left font-semibold"
                        >
                          {s.time}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWeek?.map((row) => (
                      <tr key={row.dayKey}>
                        <td className="whitespace-nowrap border border-border/50 px-3 py-2 font-medium">
                          {row.dayLabel}
                        </td>
                        {row.cells.map((cell, i) => (
                          <td
                            key={i}
                            className="border border-border/50 px-3 py-2 text-muted-foreground"
                          >
                            {cell.length === 0 ? (
                              <span className="text-xs">None</span>
                            ) : (
                              cell.map((r) => r.name).join(", ")
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}