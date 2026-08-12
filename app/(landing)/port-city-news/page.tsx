import type { Metadata } from "next";
import Breadcrumb from "@/components/shared/Breadcrumb";
import JournalTabs from "./_ui/JournalTabs";
import pageData from "@/content/port-city-news/page.json";
import type { PortCityNewsPageContent } from "@/types/port-city-news";

const content = pageData as PortCityNewsPageContent;

export const metadata: Metadata = {
  title: "Port City News.com | Port City International University",
  description: "Academic journal of Port City International University — archives, editorial boards, and author guidelines.",
};

export default function PortCityNewsPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-r from-primary via-primary/90 to-accent/80 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-2">
            Port City News.com
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Academic Journal of Port City International University
          </p>
        </div>
      </section>
      <Breadcrumb items={[{ label: "Port City News" }]} />

      <div className="container mx-auto px-4 py-12">
        <JournalTabs content={content} />
      </div>
    </div>
  );
}
