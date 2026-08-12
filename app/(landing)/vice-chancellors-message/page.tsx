import type { Metadata } from "next";
import Image from "next/image";
import PageBanner from "@/components/shared/PageBanner";
import Breadcrumb from "@/components/shared/Breadcrumb";
import pageData from "@/content/vc-message/page.json";
import type { VCMessagePageContent } from "@/types/vc-message";

const content = pageData as VCMessagePageContent;

export const metadata: Metadata = {
  title: "Vice Chancellor's Message | Port City International University",
  description:
    "A message from the Vice Chancellor of Port City International University (PCIU), Chattogram.",
};

export default function VCMessagePage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBanner
        title="Vice Chancellor's Message"
        subtitle="Port City International University"
        variant="solid"
      />
      <Breadcrumb items={[{ label: "Vice Chancellor's Message" }]} />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Left: photo + info */}
            <div className="md:w-1/3">
              <div className="w-48 h-56 rounded-xl overflow-hidden shadow-lg mb-4 border border-border relative">
                <Image
                  src={content.photo}
                  alt={`${content.name}, ${content.title}, ${content.institution}`}
                  fill
                  sizes="192px"
                  className="object-cover object-top"
                />
              </div>
              <h2 className="font-heading font-bold text-lg text-foreground">
                {content.name}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">{content.title}</p>

              <h4 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
                Education
              </h4>
              <ul className="space-y-2">
                {content.education.map((entry) => (
                  <li
                    key={entry.degree + entry.field}
                    className="border-l-2 border-highlight pl-3 text-sm"
                  >
                    <span className="font-semibold text-foreground">{entry.degree}</span>
                    <br />
                    <span className="text-muted-foreground">{entry.field}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: message */}
            <div className="md:w-2/3 space-y-5 text-muted-foreground leading-[1.85] text-[15px]">
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p className="text-foreground pt-2">
                <span className="font-bold">{content.name}</span>
                <br />
                <span className="text-muted-foreground">
                  {content.title}, {content.institution}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
