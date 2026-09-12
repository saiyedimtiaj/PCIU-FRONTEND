"use client";

import Link from "next/link";
import { LayoutDashboard, BookOpen, Briefcase, Award, Sparkles, GraduationCap, Users, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Meter, MeterTrack, MeterIndicator, MeterLabel } from "@/components/ui/meter";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/stats/StatCard";
import { Alert } from "@/components/shared/Aleart";
import { useFacultyPortalData } from "./FacultyPortalDataProvider";
import type { FacultyPortalProfile } from "@/app/(faculty)/profile-mapping";

function initials(name: string): string {
  const cleaned = name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/gi, "");
  return cleaned.charAt(0).toUpperCase() || "?";
}

function completeness(profile: FacultyPortalProfile): number {
  const checks = [
    !!profile.office,
    !!profile.shortBio,
    !!profile.bio,
    profile.teachingAreas.length > 0,
    profile.counts.education > 0,
    profile.counts.publications > 0,
    profile.counts.experience > 0,
    profile.counts.awards > 0 || profile.counts.memberships > 0,
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
];

/**
 * The teacher portal's live dashboard — reads the real signed-in teacher's
 * profile via FacultyPortalDataProvider, rather than FacultyDashboard's
 * FacultyProfileProvider (in-memory demo state, still used by the admin's
 * per-teacher preview workspace). No sparklines here: the API has no
 * time-series endpoint for these counts, and inventing fake trend lines
 * next to genuinely live numbers would be actively misleading.
 */
export default function LiveFacultyDashboard() {
  const { profile, isLoading, error } = useFacultyPortalData();

  if (error) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title="Dashboard" description="Overview of your profile and recent activity." icon={LayoutDashboard} />
        <Alert variant="error" message={error} />
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title="Dashboard" description="Overview of your profile and recent activity." icon={LayoutDashboard} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Publications" value={0} icon={BookOpen} tone="primary" loading />
          <StatCard label="Experience Entries" value={0} icon={Briefcase} tone="info" loading />
          <StatCard label="Awards" value={0} icon={Award} tone="success" loading />
          <StatCard label="Teaching Areas" value={0} icon={Sparkles} tone="violet" loading />
        </div>
      </div>
    );
  }

  const pct = completeness(profile);

  return (
    // No self-padding — the caller's page.tsx wraps this in "w-full p-6".
    <div className="w-full space-y-6">
      <PageHeader title="Dashboard" description="Overview of your profile and recent activity." icon={LayoutDashboard} />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-2xl font-bold text-primary">
            {initials(profile.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.designation}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {profile.faculty && <Badge variant="secondary">{profile.faculty}</Badge>}
              {profile.department && <Badge variant="outline">{profile.department}</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Publications" value={profile.counts.publications} icon={BookOpen} tone="primary" />
        <StatCard label="Experience Entries" value={profile.counts.experience} icon={Briefcase} tone="info" />
        <StatCard label="Awards" value={profile.counts.awards} icon={Award} tone="success" />
        <StatCard label="Teaching Areas" value={profile.teachingAreas.length} icon={Sparkles} tone="violet" />
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
  );
}
