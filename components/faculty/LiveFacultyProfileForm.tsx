"use client";

import { useEffect, useMemo, useState } from "react";
import { ImageIcon, UserRound, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToastManager } from "@/components/ui/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert } from "@/components/shared/Aleart";
import PageHeader from "@/components/admin/PageHeader";
import { useFacultyPortalData } from "./FacultyPortalDataProvider";
import { useUpdateMyProfile } from "@/features/teacher-profile";
import type { FacultyPortalProfile } from "@/app/(faculty)/profile-mapping";

const SOCIAL_FIELDS: { name: keyof FacultyPortalProfile; label: string }[] = [
  { name: "googleScholarUrl", label: "Google Scholar" },
  { name: "researchgateUrl", label: "ResearchGate" },
  { name: "linkedinUrl", label: "LinkedIn" },
  { name: "facebookUrl", label: "Facebook" },
  { name: "twitterUrl", label: "Twitter / X" },
  { name: "websiteUrl", label: "Personal Website" },
];

type Draft = Omit<FacultyPortalProfile, "teachingAreas" | "counts" | "id" | "imageUrl"> & {
  teachingAreasText: string;
  image?: File;
};

function toDraft(profile: FacultyPortalProfile): Draft {
  const { teachingAreas, counts: _counts, id: _id, imageUrl: _imageUrl, ...rest } = profile;
  void _counts;
  void _id;
  void _imageUrl;
  return { ...rest, teachingAreasText: teachingAreas.join(", ") };
}

/**
 * The teacher portal's live "My Profile" form — reads/writes
 * PATCH /teachers/profile/me via useUpdateMyProfile. Keeps the same
 * local-draft-then-Save pattern as FacultyProfileForm (edits commit on
 * Save, not per keystroke), but that component stays on
 * FacultyProfileProvider for the admin's per-teacher preview workspace,
 * which has no live endpoint to write against.
 */
export default function LiveFacultyProfileForm() {
  const { profile, isLoading, error } = useFacultyPortalData();
  const toast = useToastManager();
  const updateProfile = useUpdateMyProfile();

  const [draft, setDraft] = useState<Draft | null>(profile ? toDraft(profile) : null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Seed the draft once the profile query resolves — it isn't available on
  // first render any more (was previously hardcoded demo data). Adjusting
  // state during render (React's documented pattern for this, rather than
  // an effect) so there's no extra render pass once the query settles.
  const [seededFor, setSeededFor] = useState<string | null>(null);
  if (profile && seededFor !== profile.id) {
    setDraft(toDraft(profile));
    setSeededFor(profile.id);
  }

  const pickedImage = draft?.image;
  const objectUrl = useMemo(
    () => (pickedImage ? URL.createObjectURL(pickedImage) : null),
    [pickedImage],
  );
  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const previewSrc = objectUrl ?? imagePreview ?? profile?.imageUrl ?? "";

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;

    try {
      await updateProfile.mutateAsync({
        name: draft.name,
        designation: draft.designation,
        office: draft.office,
        shortBio: draft.shortBio,
        bio: draft.bio,
        teachingAreas: draft.teachingAreasText.split(",").map((s) => s.trim()).filter(Boolean),
        googleScholarUrl: draft.googleScholarUrl,
        researchgateUrl: draft.researchgateUrl,
        linkedinUrl: draft.linkedinUrl,
        facebookUrl: draft.facebookUrl,
        twitterUrl: draft.twitterUrl,
        websiteUrl: draft.websiteUrl,
        image: draft.image,
      });
      setImagePreview(null);
      toast.add({ type: "success", title: "Profile saved" });
    } catch (err) {
      toast.add({
        type: "error",
        title: "Couldn't save your profile",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  if (error) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title="My Profile" description="Your public-facing contact details and biography." icon={UserRound} />
        <Alert variant="error" message={error} />
      </div>
    );
  }

  if (isLoading || !draft) {
    return (
      <div className="w-full space-y-6">
        <PageHeader title="My Profile" description="Your public-facing contact details and biography." icon={UserRound} />
        <Card>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
              <Label>Department</Label>
              <p className="flex h-9 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                {draft.department || "—"}
              </p>
              <p className="text-xs text-muted-foreground">Managed by the administration.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Faculty</Label>
              <p className="flex h-9 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                {draft.faculty || "—"}
              </p>
              <p className="text-xs text-muted-foreground">Managed by the administration.</p>
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <p className="flex h-9 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground">
                {draft.email || "—"}
              </p>
              <p className="text-xs text-muted-foreground">Managed by the administration.</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="office">Office</Label>
              <Input id="office" value={draft.office} onChange={(e) => set("office", e.target.value)} placeholder="Room 301, Academic Building" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="teachingAreas">Teaching Areas</Label>
              <Input
                id="teachingAreas"
                value={draft.teachingAreasText}
                onChange={(e) => set("teachingAreasText", e.target.value)}
                placeholder="Machine Learning, Databases, Software Engineering"
              />
              <p className="text-xs text-muted-foreground">Separate areas with commas.</p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Profile Photo</Label>
              <label
                htmlFor="image"
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input bg-muted/20 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-accent/40"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ImageIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {draft.image ? draft.image.name : "Choose a new photo"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {draft.image ? `${(draft.image.size / 1024).toFixed(0)} KB selected` : "JPG or PNG"}
                  </span>
                </span>
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const picked = e.target.files?.[0];
                  if (!picked) return;
                  set("image", picked);
                }}
              />
              {previewSrc && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewSrc} alt="" className="size-full object-cover" />
                  </div>
                  {draft.image && (
                    <button
                      type="button"
                      onClick={() => set("image", undefined)}
                      className="flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              )}
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
                  value={draft[field.name as keyof Draft] as string}
                  onChange={(e) => set(field.name as keyof Draft, e.target.value as never)}
                  placeholder="https://"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button type="submit" variant="highlight" size="admin" loading={updateProfile.isPending}>
          Save Profile
        </Button>
      </div>
    </form>
  );
}
