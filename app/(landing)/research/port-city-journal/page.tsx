import type { Metadata } from "next";
import { BookOpen, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JournalArchive from "./_ui/JournalArchive";
import pageData from "@/content/research/port-city-journal.json";
import type { PortCityJournalContent } from "@/types/port-city-journal";

const content = pageData as PortCityJournalContent;

export const metadata: Metadata = {
  title: "Port City Journal | Port City International University",
  description: "Peer-reviewed multidisciplinary journal of Port City International University — ISSN: 2311-3146.",
};

export default function PortCityJournalPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-linear-to-r from-primary via-primary/90 to-accent">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <BookOpen className="size-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
            Port City Journal
          </h1>
          <p className="text-white/80">Peer-Reviewed Multidisciplinary Journal &middot; ISSN: 2311-3146</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="border-l-4 border-l-accent max-w-4xl mx-auto">
            <CardContent>
              <h2 className="font-heading font-bold text-xl text-foreground mb-3">
                About the Journal
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{content.intro}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <JournalArchive content={content} />
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary-foreground/70">
                    Journal Email
                  </p>
                  <p className="font-medium">{content.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary-foreground/70">
                    Phone
                  </p>
                  <p className="font-medium">{content.contactPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
