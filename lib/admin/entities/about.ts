import { z } from "zod";
import { Info } from "lucide-react";
import { requiredUpload } from "./_upload";
import type { EntitySchema } from "@/components/admin/form/form-types";

/**
 * The About the University page (`/about`) — one record holding every
 * section of the public page. Field names are the API's own camelCase, so
 * they pass through `services/case.ts` untouched.
 */

// Lucide names the public page can render (they map onto lib/icons.ts keys).
const ICON_SUGGESTIONS = [
  "GraduationCap",
  "Users",
  "BookOpen",
  "Globe",
  "Award",
  "Trophy",
  "Microscope",
  "TrendingUp",
  "Library",
  "Calendar",
  "Heart",
  "Lightbulb",
  "Target",
  "Handshake",
  "Shield",
  "Sparkles",
].map((icon) => ({ label: icon, value: icon }));

const text = z.string().max(255).optional().or(z.literal(""));
const longText = z.string().optional().or(z.literal(""));

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  badge: text,
  subtitle: text,
  bannerImage: requiredUpload,

  heading: text,
  description: z.string().min(1, "Description is required"),
  highlightQuote: longText,
  quickFacts: z
    .array(
      z.object({
        icon: z.string().min(1, "Icon is required"),
        value: z.string().min(1, "Value is required"),
        label: z.string().min(1, "Label is required"),
      }),
    )
    .min(1, "Add at least one quick fact"),

  campusImage: requiredUpload,
  campusLocation: text,

  ctaTitle: text,
  ctaSubtitle: text,
  ctaButtonText: text,
  ctaButtonLink: text,

  visionTitle: text,
  vision: longText,
  missionTitle: text,
  mission: longText,
  strategyTitle: text,
  strategy: longText,
  valuesTitle: text,
  valuesDescription: longText,
  valuesPoints: z.array(z.string().min(1, "Remove empty points")).min(1, "Add at least one value"),

  bottomBannerImage: requiredUpload,
  bottomBannerText: longText,
});

export const aboutEntity: EntitySchema<typeof aboutSchema> = {
  slug: "about",
  title: "About the University",
  pluralTitle: "About the University",
  description: "Edit every section of the public About the University page.",
  icon: Info,
  group: "Content",
  zodSchema: aboutSchema,
  defaultValues: { quickFacts: [], valuesPoints: [] },
  sections: [
    {
      title: "Hero",
      description: "The banner at the top of the page.",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, placeholder: "About PCIU", helper: "The last word is highlighted in gold." },
        { name: "badge", label: "Badge", type: "text", placeholder: "The University" },
        { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
        { name: "bannerImage", label: "Banner Image", type: "image", required: true, colSpan: 2 },
      ],
    },
    {
      title: "Main Content",
      fields: [
        { name: "heading", label: "Heading", type: "text", placeholder: "About the University", colSpan: 2 },
        { name: "description", label: "Description", type: "textarea", required: true, colSpan: 2, helper: "Leave a blank line between paragraphs." },
        { name: "highlightQuote", label: "Highlight Quote", type: "textarea", colSpan: 2 },
        { name: "quickFacts", label: "Quick Facts", type: "stat-list", required: true, colSpan: 2, options: ICON_SUGGESTIONS, helper: "Icon is a lucide icon name — pick one from the suggestions." },
      ],
    },
    {
      title: "Sidebar",
      fields: [
        { name: "campusImage", label: "Campus Image", type: "image", required: true, colSpan: 2 },
        { name: "campusLocation", label: "Campus Location", type: "text", placeholder: "Main Campus, Chittagong", colSpan: 2 },
        { name: "ctaTitle", label: "CTA Title", type: "text", placeholder: "Ready to Join PCIU?" },
        { name: "ctaSubtitle", label: "CTA Subtitle", type: "text" },
        { name: "ctaButtonText", label: "CTA Button Text", type: "text", placeholder: "Apply Now" },
        { name: "ctaButtonLink", label: "CTA Button Link", type: "text", placeholder: "/admission" },
      ],
    },
    {
      title: "Vision, Mission & Values",
      fields: [
        { name: "visionTitle", label: "Vision Title", type: "text", placeholder: "Our Vision" },
        { name: "missionTitle", label: "Mission Title", type: "text", placeholder: "Our Mission" },
        { name: "vision", label: "Vision", type: "textarea" },
        { name: "mission", label: "Mission", type: "textarea" },
        { name: "strategyTitle", label: "Strategy Title", type: "text", placeholder: "Strategy" },
        { name: "valuesTitle", label: "Values Title", type: "text", placeholder: "Guiding Values" },
        { name: "strategy", label: "Strategy", type: "textarea" },
        { name: "valuesDescription", label: "Values Description", type: "textarea" },
        { name: "valuesPoints", label: "Values Points", type: "json-list", required: true, colSpan: 2, placeholder: "Aim at excellence in higher education and research" },
      ],
    },
    {
      title: "Bottom Banner",
      fields: [
        { name: "bottomBannerImage", label: "Bottom Banner Image", type: "image", required: true, colSpan: 2 },
        { name: "bottomBannerText", label: "Bottom Banner Text", type: "textarea", colSpan: 2 },
      ],
    },
  ],
};
