"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, User, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ClassRoutineItem, ClassTimeSlot } from "@/types/academics";

export default function ClassRoutineInteractive({
  routines,
  timeSlots,
}: {
  routines: ClassRoutineItem[];
  timeSlots: ClassTimeSlot[];
}) {
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const [departmentFilter, setDepartmentFilter] =
    useState<string>("Department");
  const [batchFilter, setBatchFilter] = useState<string>("Batch");
  const [sectionFilter, setSectionFilter] = useState<string>("Section");
  const [searchQuery, setSearchQuery] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(routines.map((r) => r.department))).sort(),
    [routines],
  );

  const sections = useMemo(() => ["A", "B", "C"], []);

  const days = useMemo(
    () => ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    [],
  );

  const [activeDay, setActiveDay] = useState(days[0]);

  // Automatic Batch sliding window: 8 batches total.
  const batches = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const latestBatch = 37 + (currentYear - 2026);
    const windowSize = 8;
    return Array.from({ length: windowSize }, (_, i) =>
      String(latestBatch - i),
    );
  }, []);

  const filteredRoutines = useMemo(() => {
    return routines.filter((r) => {
      const matchesDept =
        departmentFilter === "Department" || r.department === departmentFilter;
      const matchesBatch =
        batchFilter === "Batch" || parseInt(r.batch) === parseInt(batchFilter);
      const matchesSection =
        sectionFilter === "Section" || r.section === sectionFilter;

      const matchesSearch =
        searchQuery === "" ||
        r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.room.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDept && matchesBatch && matchesSection && matchesSearch;
    });
  }, [routines, departmentFilter, batchFilter, sectionFilter, searchQuery]);

  if (routines.length === 0) {
    return (
      <Card className="shadow-none border border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          No class routine available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Filter Controls */}
      <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search course title, teacher, or room..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {departments.length > 0 && (
            <Select
              value={departmentFilter}
              onValueChange={(val) => setDepartmentFilter(val || "Department")}
            >
              <SelectTrigger className="w-32 bg-background">
                <SelectValue placeholder="Dept" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Department">Department</SelectItem>
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
              onValueChange={(val) => setBatchFilter(val || "Batch")}
            >
              <SelectTrigger className="w-32 bg-background">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batch">Batch</SelectItem>
                {batches.map((b) => (
                  <SelectItem key={b} value={b}>
                    {getOrdinal(Number(b))} Batch
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {sections.length > 0 && (
            <Select
              value={sectionFilter}
              onValueChange={(val) => setSectionFilter(val || "Section")}
            >
              <SelectTrigger className="w-32 bg-background">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Section">Section</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s} value={s}>
                    Section {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Routine Display */}
      <Tabs
        value={activeDay}
        onValueChange={(v: string) => setActiveDay(v)}
        variant="underline"
        className="w-full"
      >
        <TabsList className="mb-4 overflow-x-auto max-w-full flex-nowrap w-full justify-start sm:justify-center">
          {days.map((day) => (
            <TabsTrigger key={day} value={day} className="whitespace-nowrap">
              {day}
            </TabsTrigger>
          ))}
        </TabsList>

        {days.map((day) => {
          const dayRoutines = filteredRoutines.filter(
            (r) => r.day.toLowerCase() === day.toLowerCase(),
          );

          return (
            <TabsContent
              key={day}
              value={day}
              className="space-y-0 p-0 sm:p-0 bg-transparent border-0 rounded-none"
            >
              <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6 shadow-sm">
                {timeSlots.map((slot) => {
                  // Find routines matching exactly this time slot string (e.g. "8:30 AM – 9:55 AM")
                  const slotRoutines = dayRoutines.filter(
                    (r) => r.timeSlot === slot.time,
                  );

                  return (
                    <div key={slot.slot} className="mb-8 last:mb-0">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge
                          variant="secondary"
                          className="px-2 py-1 rounded font-mono"
                        >
                          Slot {slot.slot}
                        </Badge>
                        <h4 className="font-semibold text-foreground/90">
                          {slot.time}
                        </h4>
                        <div className="h-px bg-border flex-1 ml-2" />
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {slotRoutines.length > 0 ? (
                          slotRoutines.map((routine) => (
                            <Card
                              key={routine.id}
                              className="shadow-none border-border/60 hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                            >
                              <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                                <h5 className="font-bold text-foreground line-clamp-2 leading-tight mb-2">
                                  {routine.course}
                                </h5>

                                <div className="space-y-2 text-sm text-muted-foreground mt-2 mb-4 flex-1">
                                  <div className="flex items-start gap-2">
                                    <User className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                                    <span>{routine.teacher}</span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                                    <span>
                                      {routine.room}, {routine.building}
                                    </span>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <Users className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                                    <span>{routine.studentRange}</span>
                                  </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border/50">
                                  <Badge
                                    variant="outline"
                                    className="bg-primary/5 text-primary border-primary/20"
                                  >
                                    {routine.department} •{" "}
                                    {getOrdinal(Number(routine.batch))} Batch (
                                    {routine.section})
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full py-8 text-center bg-muted/30 rounded-xl border border-dashed border-border/60 text-muted-foreground text-sm">
                            No classes scheduled for this slot.
                          </div>
                        )}
                      </div>

                      {/* Break section after Slot C */}
                      {slot.slot === "C" && (
                        <div className="mt-8 mb-4 rounded-xl bg-accent/5 border border-accent/20 p-4 text-center shadow-inner">
                          <p className="font-medium text-accent flex items-center justify-center gap-2">
                            ☕ 1:00 PM – 1:30 PM (Break)
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
