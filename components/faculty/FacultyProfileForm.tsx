"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";
import PageHeader from "@/components/admin/PageHeader";
import { useFacultyProfile } from "./FacultyProfileProvider";
import type { FacultyWorkspaceProfile } from "./faculty-profile-data";

const SOCIAL_FIELDS: { name: keyof FacultyWorkspaceProfile; label: string }[] = [
  { name: "googleScholarUrl", label: "Google Scholar" },
  { name: "researchgateUrl", label: "ResearchGate" },
  { name: "linkedinUrl", label: "LinkedIn" },
  { name: "facebookUrl", label: "Facebook" },
  { name: "twitterUrl", label: "Twitter / X" },
  { name: "websiteUrl", label: "Personal Website" },
];

/** Basic Info + Academic & Social Profiles — a plain, non-sticky-footer form
 * writing through FacultyProfileProvider. Local draft state so edits only
 * commit to the shared profile on Save, matching how a "my profile" page
 * usually behaves (not live-writing every keystroke into shared state). */
export default function FacultyProfileForm() {
  const { profile, updateProfile } = useFacultyProfile();
  const toast = useToastManager();
  const [draft, setDraft] = useState(profile);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof FacultyWorkspaceProfile>(key: K, value: FacultyWorkspaceProfile[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Design-only: no backend to persist against yet. Simulate a save.
    await new Promise((resolve) => setTimeout(resolve, 600));
    updateProfile(draft);
    setSubmitting(false);
    toast.add({
      type: "success",
      title: "Profile saved",
      description: "Your profile would be saved here once persistence exists.",
    });
  }

  return (
    // No self-padding — the caller's page.tsx wraps this in "w-full p-6".
    <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
      <PageHeader title="My Profile" description="Your public-facing contact details and biography." icon={UserRound} />

      <Card>
        <CardContent className="space-y-5">
          <h3 className="font-heading font-semibold text-foreground">Basic Information</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="Dr. Jane Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" value={draft.designation} onChange={(e) => set("designation", e.target.value)} placeholder="Associate Professor" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={draft.department} onChange={(e) => set("department", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="faculty">Faculty</Label>
              <Input id="faculty" value={draft.faculty} onChange={(e) => set("faculty", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={draft.phone} onChange={(e) => set("phone", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="office">Office</Label>
              <Input id="office" value={draft.office} onChange={(e) => set("office", e.target.value)} placeholder="Room 301, Academic Building" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input id="imageUrl" value={draft.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://example.com/photo.jpg" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="shortBio">Short Bio</Label>
              <Textarea id="shortBio" value={draft.shortBio} onChange={(e) => set("shortBio", e.target.value)} rows={2} placeholder="Brief summary shown on directory cards." />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bio">Full Biography</Label>
              <Textarea id="bio" value={draft.bio} onChange={(e) => set("bio", e.target.value)} rows={5} placeholder="Write a brief biography..." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5">
          <div>
            <h3 className="font-heading font-semibold text-foreground">Academic &amp; Social Profiles</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Shown as icon links on the public profile.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {SOCIAL_FIELDS.map((field) => (
              <div key={field.name} className="space-y-1.5">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  value={draft[field.name] as string}
                  onChange={(e) => set(field.name, e.target.value as never)}
                  placeholder="https://"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button type="submit" variant="highlight" size="admin" loading={submitting}>
          Save Profile
        </Button>
      </div>
    </form>
  );
}
