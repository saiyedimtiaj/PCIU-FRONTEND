import type { Metadata } from "next";
import { BookOpen, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JournalHero from "../_ui/JournalHero";
import JournalArchive from "./_ui/JournalArchive";
import { getJournalPage } from "@/lib/api/research";

export const metadata: Metadata = {
  title: "Port City Journal | Port City International University",
  description: "Peer-reviewed multidisciplinary journal of Port City International University — ISSN: 2311-3146.",
};

export default async function PortCityJournalPage() {
  const content = await getJournalPage();

  return (
    <div className="min-h-screen bg-background">
      <JournalHero
        active="journal"
        icon={BookOpen}
        title="Port City Journal"
        subtitle="Peer-reviewed multidisciplinary journal of Port City International University."
        chips={["ISSN 2311-3146", "Half-yearly", "Double-blind review"]}
      />

      <section className="py-6 bg-background sm:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <section className="py-6 bg-background sm:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <JournalArchive content={content} />
        </div>
      </section>

      <section className="py-6 bg-background sm:py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
