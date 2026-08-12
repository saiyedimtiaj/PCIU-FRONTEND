"use client";

import Link from "next/link";
import { FileText, CheckCircle2, PencilLine, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Meter, MeterTrack, MeterIndicator, MeterLabel } from "@/components/ui/meter";
import StatCard from "@/components/admin/stats/StatCard";
import { generateSeries } from "@/components/admin/list/sample-data";

export interface GroupCount {
  group: string;
  segment: string;
  count: number;
}

export interface DashboardTabsProps {
  groupCounts: GroupCount[];
}

// Deterministic sparkline series, one per stat card — see sample-data.ts
// for why this must stay seeded rather than random.
const PAGES_SERIES = generateSeries("dashboard-pages", 12, 8, 16);
const PUBLISHED_SERIES = generateSeries("dashboard-published", 12, 8, 16);
const SECTIONS_SERIES = generateSeries("dashboard-sections", 12, 20, 40);
const FACULTY_SERIES = generateSeries("dashboard-faculty", 12, 12, 24);

function ContentByGroup({ groupCounts }: { groupCounts: GroupCount[] }) {
  const max = Math.max(...groupCounts.map((g) => g.count), 1);
  return (
    <div className="space-y-4">
      {groupCounts.map((g) => (
        <Link key={g.group} href={`/admin/${g.segment}`} className="block space-y-1.5 group">
          <Meter value={g.count} max={max} aria-label={`${g.group} entities`}>
            <div className="flex items-center justify-between">
              <MeterLabel className="text-sm text-foreground group-hover:text-primary transition-colors">
                {g.group}
              </MeterLabel>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">{g.count}</span>
            </div>
            <MeterTrack>
              <MeterIndicator />
            </MeterTrack>
          </Meter>
        </Link>
      ))}
    </div>
  );
}

export default function DashboardTabs({ groupCounts }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="overview" variant="underline">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Pages"
            value="12"
            icon={FileText}
            tone="primary"
            delta={{ value: "+8.3%", direction: "up" }}
            sparkline={PAGES_SERIES}
          />
          <StatCard
            label="Published"
            value="12"
            icon={CheckCircle2}
            tone="success"
            delta={{ value: "+8.3%", direction: "up" }}
            sparkline={PUBLISHED_SERIES}
          />
          <StatCard
            label="Content Sections"
            value="34"
            icon={PencilLine}
            tone="violet"
            delta={{ value: "+4.1%", direction: "up" }}
            sparkline={SECTIONS_SERIES}
          />
          <StatCard
            label="Faculty Profiles"
            value="20"
            icon={Users}
            tone="info"
            delta={{ value: "0%", direction: "flat" }}
            sparkline={FACULTY_SERIES}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-heading font-semibold text-foreground">Content by Group</h3>
          <ContentByGroup groupCounts={groupCounts} />
        </div>
      </TabsContent>

      <TabsContent value="content">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-heading font-semibold text-foreground">Content Entities</h3>
          <ContentByGroup
            groupCounts={groupCounts.filter((g) => ["Content", "Journal", "Research"].includes(g.group))}
          />
        </div>
      </TabsContent>

      <TabsContent value="people">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-heading font-semibold text-foreground">People &amp; Academics</h3>
          <ContentByGroup
            groupCounts={groupCounts.filter((g) => ["Academics", "People", "Scheduling"].includes(g.group))}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
