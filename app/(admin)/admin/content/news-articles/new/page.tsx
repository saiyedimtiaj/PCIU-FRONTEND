import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add News Article | Admin | Port City International University",
};

export default function NewNewsArticlePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="news-articles" cancelHref="/admin/content/news-articles" />
    </div>
  );
}
