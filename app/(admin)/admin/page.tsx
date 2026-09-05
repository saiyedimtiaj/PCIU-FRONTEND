import type { Metadata } from "next";
import Link from "next/link";
import { Users, PencilLine, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/admin/PageHeader";
import { ENTITY_REGISTRY, ENTITY_GROUP_ORDER } from "@/lib/admin/entities";
import { groupRouteSegment } from "@/components/admin/nav-groups";
import RecentPagesTable from "./_ui/RecentPagesTable";
import DashboardTabs from "./_ui/DashboardTabs";

export const metadata: Metadata = {
  title: "Admin Dashboard | Port City International University",
};

const QUICK_LINKS = [
  { label: "Add Teacher", href: "/admin/people/teacher/new", icon: Users },
  { label: "Manage Faculty", href: "/admin/faculty", icon: Users },
  { label: "All Pages", href: "/admin/pages", icon: PencilLine },
];

export default function AdminDashboardPage() {
  const groupCounts = ENTITY_GROUP_ORDER.map((group) => ({
    group,
    segment: groupRouteSegment(group),
    count: Object.values(ENTITY_REGISTRY).filter((entity) => entity.group === group).length,
  }));

  return (
    <div className="w-full space-y-6 p-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your site's content and recent activity."
      />

      <DashboardTabs groupCounts={groupCounts} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-foreground">Recent Pages</h2>
            <Button
              variant="ghostAccent"
              size="sm"
              render={<Link href="/admin/pages" />}
              nativeButton={false}
            >
              View All
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <RecentPagesTable />
        </div>

        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-lg text-foreground">Quick Actions</h2>
          <Card>
            <CardContent className="space-y-1">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Icon className="size-4 text-primary" />
                    {link.label}
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
