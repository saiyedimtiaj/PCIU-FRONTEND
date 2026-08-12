import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import ResearchTabs from "./_ui/ResearchTabs";
import pageData from "@/content/research/page.json";
import type { ResearchPageContent } from "@/types/research";

const content = pageData as ResearchPageContent;

export const metadata: Metadata = {
  title: "Research Wing | Port City International University",
  description:
    "Advancing knowledge, innovation and impact — research centres, areas, publications, partnerships and MoUs at PCIU.",
};

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[340px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/research-lab.jpg"
          alt="PCIU Research Laboratory"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/70" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
            Research Wing
          </h1>
          <p className="text-white/80 text-lg">
            Advancing knowledge, innovation and impact — from coast to campus.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={null}>
          <ResearchTabs content={content} />
        </Suspense>
      </div>
    </div>
  );
}
