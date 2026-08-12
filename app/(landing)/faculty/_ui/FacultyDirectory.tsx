"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, GraduationCap } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import type { FacultyProfile } from "@/types/faculty-directory";

export default function FacultyDirectory({ profiles }: { profiles: FacultyProfile[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const uniqueFaculties = useMemo(
    () => Array.from(new Set(profiles.map((p) => p.faculty).filter(Boolean))),
    [profiles]
  );

  const uniqueDepartments = useMemo(() => {
    const scoped =
      selectedFaculty === "all" ? profiles : profiles.filter((p) => p.faculty === selectedFaculty);
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
      const matchesFaculty = selectedFaculty === "all" || p.faculty === selectedFaculty;
      const matchesDepartment = selectedDepartment === "all" || p.department === selectedDepartment;
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
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">Our Faculty</h1>
            <p className="text-lg md:text-xl text-white/90">
              Meet our distinguished faculty members driving excellence in teaching and research.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-muted/30 border-b border-border">
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
          Showing {filtered.length} faculty member{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground font-medium mb-1">
              No faculty members found matching your criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((faculty) => (
              <Card key={faculty.id} className="group overflow-hidden">
                <div className="h-40 bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-heading font-bold text-primary">
                    {faculty.name
                      .replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/g, "")[0]}
                  </span>
                </div>
                <CardContent>
                  <h3 className="font-semibold text-foreground">{faculty.name}</h3>
                  <p className="text-sm text-muted-foreground">{faculty.designation}</p>
                  <p className="text-sm text-muted-foreground">{faculty.department}</p>
                  {faculty.education[0] && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {faculty.education[0].degree} from {faculty.education[0].institution}
                    </p>
                  )}
                  {faculty.teachingAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {faculty.teachingAreas.slice(0, 3).map((area) => (
                        <Badge key={area} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    render={<Link href={`/faculty/${faculty.id}`} />}
                    nativeButton={false}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
