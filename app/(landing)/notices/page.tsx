import type { Metadata } from "next";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import NoticesBoard from "./_ui/NoticesBoard";
import { getPublicNotices } from "@/lib/api/notices";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { NoticeApiRecord, NoticesPageContent } from "@/types/notices";

const title = "Notice Board";

function formatDateLabel(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function inferCategory(value: string | null | undefined): string {
  const normalized = (value ?? "").trim();
  return normalized || "General";
}

function buildNoticeRecord(
  item: NoticeApiRecord,
): NoticesPageContent["notices"][number] {
  const department = item.department ?? null;
  const departmentName = department?.name ?? "";
  const departmentShortName = department?.shortName ?? departmentName;
  const noticeDate = item.noticeDate ?? item.createdAt ?? null;

  const normalizedPdfUrl = resolveUploadUrl(item.pdfUrl ?? null);

  return {
    id: item.id,
    title: item.title ?? "Untitled notice",
    category: inferCategory(item.category),
    departmentName: departmentName || "General",
    departmentShortName: departmentShortName || "General",
    date: noticeDate ?? "",
    dateLabel: formatDateLabel(noticeDate),
    fileUrl: normalizedPdfUrl || "#",
    pdfUrl: normalizedPdfUrl || null,
    isNew: Boolean(item.isHome),
    fileSize: "PDF",
    badgeLabel: item.badgeLabel ?? null,
    badgeColor: item.badgeColor ?? null,
    noticeDate: item.noticeDate ?? null,
    createdAt: item.createdAt ?? null,
  };
}

export const metadata: Metadata = {
  title: `${title} | Port City International University`,
  description:
    "Stay updated with the latest announcements, circulars, and important notifications from Port City International University.",
};

export default async function NoticesPage() {
  const notices = await getPublicNotices();
  const content: NoticesPageContent = {
    categories: [
      "All",
      "Academic",
      "Admission",
      "Examination",
      "Administrative",
      "Event",
      "Scholarship",
      "General",
    ],
    notices: notices.map(buildNoticeRecord),
  };

  return (
    <div className="min-h-screen bg-background ">
      <PageBanner
        title={title}
        subtitle="Stay updated with the latest university announcements, academic notices, events, examination schedules, and important information."
        align="center"
        variant="gradient"
      />

      {/* <div className="px-8 md:px-60 py-4">
        <h1 className="text-center font-extrabold text-primary text-2xl">
          Notice Board
        </h1>
        <p className="text-center font-medium text-primary-glow">
          Stay updated with the latest university announcements, academic
          notices, events, examination schedules, and important information.
        </p>
      </div> */}

      <Breadcrumb items={[{ label: title }]} />

      <div className="container mx-auto px-4 md:px-8 py-6">
        <NoticesBoard content={content} />
      </div>
    </div>
  );
}
