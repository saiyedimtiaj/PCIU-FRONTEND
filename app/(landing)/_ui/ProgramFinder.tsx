// "use client";

// import { useState } from "react";
// import { Search } from "lucide-react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import programsData from "@/content/home/programs.json";
// import type { Program } from "@/types/home";

// const programs = programsData as Program[];

// export default function ProgramFinder() {
//   const [search, setSearch] = useState("");
//   const [levelFilter, setLevelFilter] = useState("All Levels");
//   const [facultyFilter, setFacultyFilter] = useState("All Faculties");

//   const filtered = programs.filter((p) => {
//     const matchesSearch =
//       !search ||
//       p.title.toLowerCase().includes(search.toLowerCase()) ||
//       p.description.toLowerCase().includes(search.toLowerCase());
//     const matchesLevel = levelFilter === "All Levels" || p.level === levelFilter;
//     const matchesFaculty = facultyFilter === "All Faculties" || p.faculty === facultyFilter;
//     return matchesSearch && matchesLevel && matchesFaculty;
//   });

//   return (
//     <section
//       className="py-20 bg-linear-to-br from-secondary/5 via-primary/10 to-secondary/5"
//       id="academics"
//     >
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12 animate-fade-in">
//           <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
//             Find Your Program
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Find a program that fits your goals from our diverse range of undergraduate and
//             graduate offerings
//           </p>
//         </div>

//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search programs..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="pl-12"
//                 aria-label="Search programs"
//               />
//             </div>
//             <select
//               className="px-4 py-3 rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring"
//               aria-label="Filter by level"
//               value={levelFilter}
//               onChange={(e) => setLevelFilter(e.target.value)}
//             >
//               <option>All Levels</option>
//               <option>Undergraduate</option>
//               <option>Graduate</option>
//             </select>
//             <select
//               className="px-4 py-3 rounded-lg border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring"
//               aria-label="Filter by faculty"
//               value={facultyFilter}
//               onChange={(e) => setFacultyFilter(e.target.value)}
//             >
//               <option>All Faculties</option>
//               <option>Engineering & Technology</option>
//               <option>Business Studies</option>
//               <option>Arts & Social Sciences</option>
//               <option>Law</option>
//             </select>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filtered.map((program) => (
//             <Card
//               key={`${program.title}-${program.degree}`}
//               className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30"
//             >
//               <CardContent className="p-6">
//                 <Badge className="bg-primary text-primary-foreground mb-3">
//                   {program.degree}
//                 </Badge>
//                 <h3 className="font-heading font-semibold text-xl text-primary mb-2">
//                   {program.title}
//                 </h3>
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
//                   <span>{program.duration}</span>
//                   <span className="w-1 h-1 bg-muted-foreground rounded-full" />
//                   <span>{program.faculty}</span>
//                 </div>
//                 <p className="text-muted-foreground">{program.description}</p>
//               </CardContent>
//               <CardFooter className="p-6 pt-0">
//                 <Button
//                   variant="outlineAccent"
//                   className="w-full"
//                   nativeButton={false}
//                   render={<Link href={program.href} />}
//                 >
//                   Learn More
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div className="text-center py-12 text-muted-foreground">
//             No programs found matching your criteria.
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Button size="cta">View All Programs</Button>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import programsData from "@/content/home/programs.json";
import type { Program } from "@/types/home";

const programs = programsData as Program[];

export default function ProgramFinder() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [facultyFilter, setFacultyFilter] = useState("All Faculties");

  const filtered = programs.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "All Levels" || p.level === levelFilter;
    const matchesFaculty = facultyFilter === "All Faculties" || p.faculty === facultyFilter;
    return matchesSearch && matchesLevel && matchesFaculty;
  });

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24" id="academics">
      {/* Crescent-shaped glow behind the heading — matches Faculties section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-140px] h-[420px] w-[1100px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 550px 300px at center, hsl(210 80% 78% / 0.85), hsl(210 75% 85% / 0.5) 40%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-100px] h-[320px] w-[750px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 380px 200px at center, hsl(42 85% 78% / 0.7), transparent 68%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Find Your Program
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Find a program that fits your goals from our diverse range of undergraduate and
            graduate offerings
          </p>
        </div>

        {/* Search + filters */}
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="flex flex-col gap-3 sm:gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search programs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12"
                aria-label="Search programs"
              />
            </div>
            <select
              className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-base"
              aria-label="Filter by level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option>All Levels</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
            </select>
            <select
              className="rounded-lg border border-input bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring sm:text-base"
              aria-label="Filter by faculty"
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
            >
              <option>All Faculties</option>
              <option>Engineering & Technology</option>
              <option>Business Studies</option>
              <option>Arts & Social Sciences</option>
              <option>Law</option>
            </select>
          </div>
        </div>

        {/* Program cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
          {filtered.map((program) => (
            <div
              key={`${program.title}-${program.degree}`}
              className="group flex h-full flex-col rounded-2xl border-t-2 border-l-2 border-primary/25 bg-white p-6 shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:border-accent hover:shadow-2xl sm:p-7"
            >
              <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                {program.degree}
              </span>

              <h3 className="font-heading mb-2 text-lg font-bold text-primary sm:text-xl">
                {program.title}
              </h3>

              <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                <span>{program.duration}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{program.faculty}</span>
              </div>

              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {program.description}
              </p>

              <div className="mt-auto pt-2">
                <Link
                  href={program.href}
                  className="group/btn relative inline-flex w-full items-center justify-center overflow-hidden rounded-lg border-2 border-primary/20 px-4 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:border-accent hover:text-white"
                >
                  <span
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-primary to-primary/90 transition-transform duration-300 group-hover/btn:translate-x-0"
                    aria-hidden
                  />
                  <span className="relative">Learn More</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground sm:text-base">
            No programs found matching your criteria.
          </div>
        )}

        <div className="mt-12 text-center">
          <Button size="cta">View All Programs</Button>
        </div>
      </div>
    </section>
  );
}