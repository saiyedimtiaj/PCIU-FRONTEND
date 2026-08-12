import type { Metadata } from "next";
import { Suspense } from "react";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ManagementTabs from "./_ui/ManagementTabs";
import pageData from "@/content/management/page.json";
import type { ManagementPageContent } from "@/types/management";

const content = pageData as ManagementPageContent;

export const metadata: Metadata = {
  title: "University Management | Port City International University",
  description:
    "Meet the distinguished members who govern and guide Port City International University — Syndicate, Academic Council, and Proctorial Bodies.",
};

export default function ManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="University Management"
        subtitle="Meet the distinguished members who govern and guide Port City International University towards academic excellence and institutional growth."
        variant="blobs"
      />
      <Breadcrumb items={[{ label: "Management" }]} />

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={null}>
          <ManagementTabs content={content} />
        </Suspense>
      </div>
    </div>
  );
}
