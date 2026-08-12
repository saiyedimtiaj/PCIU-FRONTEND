import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "News Articles | Admin | Port City International University",
};

export default function NewsArticlesListPage() {
  return <EntityListClient slug="news-articles" />;
}
