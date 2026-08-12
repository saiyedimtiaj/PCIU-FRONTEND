import type { Metadata } from "next";
import Link from "next/link";
import { FileText, CheckCircle2, PencilLine, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RecentPagesTable from "./_ui/RecentPagesTable";

export const metadata: Metadata = {
  title: "Admin Dashboard | Port City International University",
};

const STATS = [
  { label: "Total Pages", value: "12", icon: FileText, tint: "text-primary bg-primary/10" },
  { label: "Published", value: "12", icon: CheckCircle2, tint: "text-secondary bg-secondary-light" },
  { label: "Content Sections", value: "34", icon: PencilLine, tint: "text-accent bg-accent-light" },
  { label: "Faculty Profiles", value: "20", icon: Users, tint: "text-highlight bg-accent-light" },
];

const QUICK_LINKS = [
  { label: "Add Teacher", href: "/admin/people/teacher/new", icon: Users },
  { label: "Manage Faculty", href: "/admin/faculty", icon: Users },
  { label: "All Pages", href: "/admin/pages", icon: PencilLine },
];

export default function AdminDashboardPage() {
  return (
    <div className="w-full p-6 space-y-8">
      <p className="text-sm text-muted-foreground">
        Overview of your site&apos;s content and recent activity.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${stat.tint}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="font-heading font-bold text-2xl text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-foreground">Recent Pages</h2>
            <Button variant="ghostAccent" size="sm" render={<Link href="/admin/pages" />}>
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
