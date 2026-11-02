import type { Metadata } from "next";
import { Suspense } from "react";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { CIRCULAR_TYPES } from "@/lib/api/circulars";
import CircularsResults from "./_ui/CircularsResults";
import CircularsSkeleton from "./_ui/CircularsSkeleton";

const title = "University Circulars";

export const metadata: Metadata = {
  title: `Circulars | Port City International University`,
  description:
    "Explore the latest job, tender and official circulars from Port City International University.",
};

function toPositiveInt(
  value: string | string[] | undefined,
): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : undefined;
}

function toType(value: string | string[] | undefined): string | undefined {
  const raw = (Array.isArray(value) ? value[0] : value)?.toUpperCase();
  // Unknown types would 400 the API — drop them instead.
  return CIRCULAR_TYPES.find((t) => t === raw);
}

export default async function CircularsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = {
    page: toPositiveInt(params.page),
    type: toType(params.type),
    departmentId: toPositiveInt(params.department),
  };

  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title={title}
        subtitle="Explore the latest opportunities and official announcements."
        align="center"
        variant="gradient"
      />

      <Breadcrumb items={[{ label: "Circulars" }]} />

      <div className="container mx-auto px-4 py-8 md:px-8 md:py-12">
        <Suspense fallback={<CircularsSkeleton />}>
          <CircularsResults query={query} />
        </Suspense>
      </div>
    </div>
  );
}
