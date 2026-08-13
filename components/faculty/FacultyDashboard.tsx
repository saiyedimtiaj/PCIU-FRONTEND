"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Briefcase, Award, Sparkles, GraduationCap, Users, CalendarDays, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Meter, MeterTrack, MeterIndicator, MeterLabel } from "@/components/ui/meter";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/stats/StatCard";
import { generateSeries } from "@/components/admin/list/sample-data";
import { useFacultyProfile } from "./FacultyProfileProvider";
import type { FacultyWorkspaceProfile } from "./faculty-profile-data";

function initials(name: string): string {
  const cleaned = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/gi, "");
  return cleaned.charAt(0).toUpperCase() || "?";
}

function completeness(profile: FacultyWorkspaceProfile): number {
  const checks = [
    !!profile.email,
    !!profile.phone,
    !!profile.office,
    !!profile.shortBio,
    !!profile.bio,
    profile.teachingAreas.length > 0,
    profile.education.length > 0,
    profile.publications.length > 0,
    profile.experience.length > 0,
    profile.awards.length > 0 || profile.memberships.length > 0,
    !!profile.googleScholarUrl || !!profile.linkedinUrl || !!profile.websiteUrl,
  ];
  const done = checks.filter(Boolean).length;
  return Math.round((done / checks.length) * 100);
}

const QUICK_LINKS = [
  { label: "My Profile", href: "/faculty-portal/profile", icon: UserRound },
  { label: "Education", href: "/faculty-portal/education", icon: GraduationCap },
  { label: "Publications", href: "/faculty-portal/publications", icon: BookOpen },
  { label: "Experience", href: "/faculty-portal/experience", icon: Briefcase },
  { label: "Awards", href: "/faculty-portal/awards", icon: Award },
  { label: "Memberships", href: "/faculty-portal/memberships", icon: Users },
  { label: "Conferences", href: "/faculty-portal/conferences", icon: CalendarDays },
];

export interface FacultyDashboardProps {
  /** Prefix for quick-link hrefs — "/faculty-portal" for the portal, "/admin/faculty/<id>" for the admin workspace. */
  basePath: string;
  publicProfileHref?: string;
  /** Shown only by the self-service portal, which has no auth and so displays
   * a representative profile rather than a real signed-in teacher's. The
   * admin workspace views a specific, real directory entry and doesn't need it. */
  demoNotice?: string;
}

export default function FacultyDashboard({ basePath, publicProfileHref, demoNotice }: FacultyDashboardProps) {
  const { profile } = useFacultyProfile();
  const pct = completeness(profile);

  // Deterministic sparklines, seeded off the profile id — stable across
  // server/client render and rebuilds (no Math.random()/Date.now()).
  const pubSeries = generateSeries(`faculty-${profile.id}-publications`, 12, 2, 10);
  const expSeries = generateSeries(`faculty-${profile.id}-experience`, 12, 3, 12);
  const awardSeries = generateSeries(`faculty-${profile.id}-awards`, 12, 1, 8);
  const areaSeries = generateSeries(`faculty-${profile.id}-areas`, 12, 4, 14);

  const links = QUICK_LINKS.map((l) => ({ ...l, href: l.href.replace("/faculty-portal", basePath) }));

  return (
    // No self-padding — the caller's page.tsx wraps this in "w-full p-6".
    <div className="w-full space-y-6">
      <PageHeader title="Dashboard" description="Overview of your profile and recent activity." icon={LayoutDashboard} />

      {demoNotice && (
        <div className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
          {demoNotice}
        </div>
      )}

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
            {initials(profile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.designation}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="secondary">{profile.faculty}</Badge>
              <Badge variant="outline">{profile.department}</Badge>
            </div>
          </div>
          {publicProfileHref && (
            <a
              href={publicProfileHref}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              View public profile
            </a>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Publications" value={profile.publications.length} icon={BookOpen} tone="primary" sparkline={pubSeries} />
        <StatCard label="Experience Entries" value={profile.experience.length} icon={Briefcase} tone="info" sparkline={expSeries} />
        <StatCard label="Awards" value={profile.awards.length} icon={Award} tone="success" sparkline={awardSeries} />
        <StatCard label="Teaching Areas" value={profile.teachingAreas.length} icon={Sparkles} tone="violet" sparkline={areaSeries} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <Meter value={pct} max={100} aria-label="Profile completeness">
          <div className="mb-3 flex items-center justify-between">
            <MeterLabel className="font-heading font-semibold text-foreground">Profile Completeness</MeterLabel>
            <span className="text-sm font-semibold tabular-nums text-primary">{pct}%</span>
          </div>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
        <p className="mt-3 text-xs text-muted-foreground">
          Based on contact info, bio, teaching areas, and whether each section below has at least one entry.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-heading font-semibold text-lg text-foreground">Manage Your Profile</h2>
        <Card>
          <CardContent className="grid gap-1 sm:grid-cols-2">
            {links.map((link) => {
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
  );
}
