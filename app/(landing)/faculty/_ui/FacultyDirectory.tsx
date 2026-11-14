"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import type { FacultyProfile } from "@/types/faculty-directory";

export default function FacultyDirectory({
  profiles,
  initialFaculty = "all",
}: {
  profiles: FacultyProfile[];
  initialFaculty?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(initialFaculty);
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const uniqueFaculties = useMemo(
    () => Array.from(new Set(profiles.map((p) => p.faculty).filter(Boolean))),
    [profiles],
  );

  const uniqueDepartments = useMemo(() => {
    const scoped =
      selectedFaculty === "all"
        ? profiles
        : profiles.filter((p) => p.faculty === selectedFaculty);
    return Array.from(new Set(scoped.map((p) => p.department).filter(Boolean)));
  }, [profiles, selectedFaculty]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return profiles.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.teachingAreas.some((area) => area.toLowerCase().includes(q));
      const matchesFaculty =
        selectedFaculty === "all" || p.faculty === selectedFaculty;
      const matchesDepartment =
        selectedDepartment === "all" || p.department === selectedDepartment;
      return matchesSearch && matchesFaculty && matchesDepartment;
    });
  }, [profiles, searchQuery, selectedFaculty, selectedDepartment]);

  function clearFilters() {
    setSearchQuery("");
    setSelectedFaculty("all");
    setSelectedDepartment("all");
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-hero py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <GraduationCap className="w-16 h-16 mx-auto mb-6" />
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
              Our Faculty
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Meet our distinguished faculty members driving excellence in
              teaching and research.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-17.5 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, department, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedFaculty}
            onValueChange={(value) => setSelectedFaculty(value ?? "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Faculties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              {uniqueFaculties.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedDepartment}
            onValueChange={(value) => setSelectedDepartment(value ?? "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {uniqueDepartments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="container mx-auto px-4 pb-3 text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {filtered.length}
          </span>{" "}
          faculty member
          {filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-10 md:py-12">
        {filtered.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <SearchX className="size-6" />
            </div>
            <p className="text-foreground font-medium mb-1">
              No faculty members found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different name, faculty, or department.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-5">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((faculty) => {
              const photo = getMediaUrl(faculty.imageUrl);
              return (
                <Link
                  key={faculty.id}
                  href={`/faculty/${faculty.id}`}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0ea5e9]/50 hover:shadow-[0_14px_32px_-16px_rgba(30,58,138,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]/40 focus-visible:ring-offset-2"
                >
                  {/* Hover accent rail */}
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-linear-to-b from-[#1e3a8a] to-[#0ea5e9] transition-transform duration-300 group-hover:scale-y-100" />

                  {/* Portrait / monogram */}
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-[#1e3a8a] via-[#2B355A] to-[#0ea5e9] shadow-sm">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={faculty.name}
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center font-heading text-lg font-bold tracking-wide text-white">
                        {getInitials(faculty.name)}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-heading text-[15px] font-bold leading-snug text-[#1e3a8a] transition-colors group-hover:text-[#0c7bb3]">
                        {faculty.name}
                      </h3>
                      <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0ea5e9]" />
                    </div>

                    <p className="mt-0.5 truncate text-xs font-semibold text-[#0ea5e9]">
                      {faculty.designation}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {faculty.department}
                    </p>

                    {faculty.teachingAreas.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {faculty.teachingAreas.slice(0, 2).map((area) => (
                          <span
                            key={area}
                            className="max-w-32 truncate rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition-colors group-hover:bg-[#0ea5e9]/10 group-hover:text-[#0c7bb3]"
                          >
                            {area}
                          </span>
                        ))}
                        {faculty.teachingAreas.length > 2 && (
                          <span
                            className={cn(
                              "text-[11px] font-medium text-slate-400",
                              "group-hover:text-[#0ea5e9]",
                            )}
                          >
                            +{faculty.teachingAreas.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
