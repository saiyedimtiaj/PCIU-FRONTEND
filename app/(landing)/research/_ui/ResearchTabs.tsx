"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Microscope, Beaker, BookOpen, Handshake, FileText, Search, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconMap } from "@/lib/icons";
import { RESEARCH_SECTION_IDS, type ResearchPageContent, type ResearchSectionId } from "@/types/research";

const TAB_META: { id: ResearchSectionId; label: string; icon: typeof Microscope }[] = [
  { id: "centres", label: "Research Centres", icon: Microscope },
  { id: "areas", label: "Research Areas", icon: Beaker },
  { id: "publications", label: "Research & Publications", icon: BookOpen },
  { id: "partnerships", label: "Partnerships", icon: Handshake },
  { id: "mous", label: "MoUs", icon: FileText },
];

export default function ResearchTabs({ content }: { content: ResearchPageContent }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const requested = searchParams.get("section");
  const activeTab: ResearchSectionId = RESEARCH_SECTION_IDS.includes(requested as ResearchSectionId)
    ? (requested as ResearchSectionId)
    : "centres";

  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const [dept, setDept] = useState("all");

  const years = useMemo(
    () =>
      Array.from(new Set(content.publications.map((p) => String(p.year)))).sort((a, b) =>
        b.localeCompare(a)
      ),
    [content.publications]
  );
  const types = useMemo(
    () => Array.from(new Set(content.publications.map((p) => p.type))),
    [content.publications]
  );
  const depts = useMemo(
    () => Array.from(new Set(content.publications.map((p) => p.department))),
    [content.publications]
  );

  const filteredPubs = content.publications.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q);
    const matchesYear = year === "all" || String(p.year) === year;
    const matchesType = type === "all" || p.type === type;
    const matchesDept = dept === "all" || p.department === dept;
    return matchesQuery && matchesYear && matchesType && matchesDept;
  });

  function handleTab(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("section", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => handleTab(value as string)}>
      <TabsList className="justify-center mb-8">
        {TAB_META.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <Icon className="size-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="centres">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.centres.map((centre) => (
            <Card key={centre.name} className="border-l-4 border-l-accent">
              <CardContent>
                <h3 className="font-semibold text-foreground mb-1">{centre.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{centre.lead}</p>
                <p className="text-sm text-muted-foreground mb-4">{centre.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {centre.focus.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="areas">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.areas.map((area) => {
            const Icon = iconMap[area.icon];
            return (
              <Card key={area.title} className="group overflow-hidden">
                <div
                  className={`h-24 bg-linear-to-br ${area.color} flex items-center justify-center`}
                >
                  <Icon className="size-8 text-white" />
                </div>
                <CardContent>
                  <h3 className="font-semibold text-foreground text-sm">{area.title}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="publications">
        <Card className="mb-6">
          <CardContent className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search publications..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={year} onValueChange={(v) => setYear(v ?? "all")}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dept} onValueChange={(v) => setDept(v ?? "all")}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {depts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredPubs.map((pub) => (
            <Card key={pub.title}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm">{pub.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pub.authors} &middot; {pub.venue} &middot; {pub.year}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline">{pub.type}</Badge>
                    <Badge variant="secondary">{pub.department}</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                  <ExternalLink className="size-4" />
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
          {filteredPubs.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No publications found.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="partnerships">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.partnerships.map((partner) => (
            <Card key={partner.name} className="text-center">
              <CardContent>
                <Handshake className="size-6 text-accent mx-auto mb-3" />
                <h3 className="font-semibold text-foreground text-sm">{partner.name}</h3>
                <p className="text-xs text-muted-foreground">{partner.country}</p>
                <Badge variant="secondary" className="mt-2">
                  {partner.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="mous">
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3 w-32">Date</th>
                  <th className="px-4 py-3">Scope</th>
                </tr>
              </thead>
              <tbody>
                {content.mous.map((mou) => (
                  <tr key={mou.partner} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{mou.partner}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{mou.date}</td>
                    <td className="px-4 py-3 text-muted-foreground">{mou.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
