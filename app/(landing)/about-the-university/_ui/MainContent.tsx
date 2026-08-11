import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, ChevronRight } from "lucide-react";
import { iconMap } from "@/lib/icons";
import mainContentData from "@/content/about/main-content.json";
import type { AboutMainContent } from "@/types/about";

const content = mainContentData as AboutMainContent;

export default function MainContent() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_340px] gap-12 items-start">
          {/* Left: Main content */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-10 bg-accent rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {content.heading}
              </h2>
            </div>

            <div className="space-y-5 text-muted-foreground leading-[1.85] text-[15px]">
              {content.paragraphs.map((paragraph, index) => (
                <Fragment key={index}>
                  <p>{paragraph}</p>
                  {index === 1 && (
                    <blockquote className="relative my-8 py-6 px-8 bg-primary/5 border-l-4 border-accent rounded-r-xl">
                      <Lightbulb className="absolute -top-3 -left-3 w-7 h-7 text-accent bg-background rounded-full p-1" />
                      <p className="text-foreground font-medium italic leading-relaxed">
                        &ldquo;{content.pullquote}&rdquo;
                      </p>
                    </blockquote>
                  )}
                </Fragment>
              ))}
            </div>
          </div>

          {/* Right: Sticky sidebar with quick facts */}
          <aside className="lg:sticky lg:top-28 space-y-6">
            {/* Quick Facts Card */}
            <div className="bg-primary rounded-2xl p-6 text-primary-foreground">
              <h3 className="text-sm font-bold uppercase tracking-widest text-accent mb-5">
                Quick Facts
              </h3>
              <div className="space-y-4">
                {content.quickFacts.map((stat) => {
                  const Icon = iconMap[stat.icon];
                  return (
                    <div key={stat.label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-lg font-bold leading-tight">{stat.value}</div>
                        <div className="text-xs text-primary-foreground/60">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campus Image Card */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-border">
              <div className="relative h-48">
                <Image
                  src={content.campusImage}
                  alt="PCIU Main Campus"
                  fill
                  sizes="340px"
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-card">
                <p className="text-xs font-medium text-muted-foreground">{content.campusCaption}</p>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 text-center">
              <h4 className="font-bold text-foreground mb-2">{content.ctaTitle}</h4>
              <p className="text-xs text-muted-foreground mb-4">{content.ctaDescription}</p>
              <Link
                href={content.ctaHref}
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-accent/90 transition-colors"
              >
                {content.ctaButtonText}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
