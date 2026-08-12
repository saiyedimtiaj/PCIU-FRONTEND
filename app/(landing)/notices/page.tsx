import type { Metadata } from "next";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import NoticesBoard from "./_ui/NoticesBoard";
import pageData from "@/content/notices/page.json";
import type { NoticesPageContent } from "@/types/notices";

const content = pageData as NoticesPageContent;

export const metadata: Metadata = {
  title: "Notice Board | Port City International University",
  description:
    "Stay updated with the latest announcements, circulars, and important notifications from Port City International University.",
};

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Notice Board"
        subtitle="Stay updated with the latest announcements, circulars, and important notifications from Port City International University."
        align="left"
        variant="gradient"
      />
      <Breadcrumb items={[{ label: "Notices" }]} />

      <div className="container mx-auto px-4 py-12">
        <NoticesBoard content={content} />
      </div>
    </div>
  );
}
