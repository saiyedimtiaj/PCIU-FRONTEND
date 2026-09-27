import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { getNewsArticles } from "@/lib/api/news";
import NewsGrid from "./_ui/NewsGrid";

export const metadata: Metadata = {
  title: "All News | Port City International University",
  description:
    "The latest news and updates from Port City International University.",
};

export default async function NewsPage() {
  const result = await getNewsArticles();
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-r from-primary via-primary/90 to-accent/80 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            All News
          </h1>
        </div>
      </section>
      <Breadcrumb items={[{ label: "News" }]} />
      <main className="container mx-auto px-4 py-12">
        <NewsGrid {...result} />
      </main>
    </div>
  );
}
