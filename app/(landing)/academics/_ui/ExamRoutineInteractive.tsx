"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { parseISO, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
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

export default function ExamRoutineInteractive({
  routines,
}: {
  routines: ExamRoutine[];
}) {
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const departments = useMemo(
    () => Array.from(new Set(routines.map((r) => r.department))).sort(),
    [routines],
  );

  // Static Sections
  const sections = useMemo(() => ["A", "B", "C"], []);

  // Automatic Batch sliding window: 8 batches total.
  // In 2026, latest is 37. Increments every year.
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
        departmentFilter === "all" || r.department === departmentFilter;
      const matchesBatch =
        batchFilter === "all" || parseInt(r.batch) === parseInt(batchFilter);
      const matchesSection =
        sectionFilter === "all" || r.section === sectionFilter;

      const matchesSearch =
        searchQuery === "" ||
        r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.room.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesDate = true;
      if (dateFilter) {
        try {
          const selectedDate = parseISO(dateFilter);
          const routineDate = parseISO(r.date);
          matchesDate = isSameDay(routineDate, selectedDate);
        } catch {
          matchesDate = false;
        }
      }

      return (
        matchesDept &&
        matchesBatch &&
        matchesSection &&
        matchesSearch &&
        matchesDate
      );
    });
  }, [
    routines,
    departmentFilter,
    batchFilter,
    sectionFilter,
    searchQuery,
    dateFilter,
  ]);

  if (routines.length === 0) {
    return (
      <Card className="shadow-none border border-border/50">
        <CardContent className="py-12 text-center text-muted-foreground">
          No routine available for this examination yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border border-border/50 bg-card overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/20 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-4">
          <CardTitle className="text-lg font-semibold">
            Routine Details
          </CardTitle>
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
                onValueChange={(val) => setDepartmentFilter(val || "all")}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Depts</SelectItem>
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
                onValueChange={(val) => setBatchFilter(val || "all")}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
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
                onValueChange={(val) => setSectionFilter(val || "all")}
              >
                <SelectTrigger className="w-30 h-9 bg-background">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
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
                  <TableCell className="font-medium whitespace-nowrap">
                    {row.date}
                  </TableCell>
                  <TableCell className="text-muted-foreground whitespace-nowrap">
                    {row.timeSlot}
                  </TableCell>
                  <TableCell className="max-w-50 truncate" title={row.course}>
                    {row.course}
                  </TableCell>
                  <TableCell>
                    {row.department} - {row.batch} ({row.section})
                  </TableCell>
                  <TableCell>{row.room}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.studentRange}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
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
