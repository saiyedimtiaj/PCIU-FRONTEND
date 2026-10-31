import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Calendar, Mail, MapPin, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JournalHero from "../_ui/JournalHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TOPICS = [
  "Business",
  "Engineering",
  "Science & Technology",
  "Humanities",
  "Social Science",
  "Law",
  "English",
  "Journalism",
  "Short Communications",
  "Invited Reviews",
];

export const metadata: Metadata = {
  title: "Call For Paper | Port City International University",
  description: "Call for paper submissions to the Port City Journal, Volume 13, Issue (1+2). ISSN: 2311-3146.",
};

export default function CallForPaperPage() {
  return (
    <div className="min-h-screen bg-background">
      <JournalHero
        active="call-for-paper"
        icon={FileText}
        title="Call for Paper"
        subtitle="Submit your original research to the Port City Journal."
        chips={["ISSN 2311-3146", "Volume 13", "Issue (1+2)"]}
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-6 sm:py-12">
        <Card className="bg-linear-to-r from-destructive/10 to-accent/10 border-l-4 border-l-destructive">
          <CardContent className="flex items-center gap-3 sm:gap-4">
            <Calendar className="size-7 text-destructive shrink-0 sm:size-8" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground sm:text-sm">Last Date of Submission</p>
              <p className="font-heading font-bold text-lg text-foreground whitespace-nowrap sm:text-xl">31 March, 2027</p>
            </div>
            <Badge variant="destructive">Open Now</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">Announcement</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Port City International University invites original and unpublished research
                articles, case studies, and short communications for publication in the Port City
                Journal (ISSN: 2311-3146), Volume 13, Issue (1+2).
              </p>
              <p>
                Manuscripts are welcome from all disciplines including Business, Engineering,
                Science &amp; Technology, Humanities, Social Science, Law, English and Journalism.
                All submissions undergo a rigorous double-blind peer review process before
                acceptance.
              </p>
              <p>The submission deadline for this issue is 31 March, 2027.</p>
            </div>
            <Button
              className="mt-6 gap-2"
              render={<Link href="/research/call-for-paper-guidelines" />}
              nativeButton={false}
            >
              Read Submission Guidelines
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-heading font-bold text-xl text-foreground mb-4">
              Accepted Subject Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((topic) => (
                <Badge key={topic} variant="secondary" className="px-3 py-1">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardContent>
            <h2 className="font-heading font-bold text-xl mb-4">Submit To</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Prof. Dr. Engr. Mafzal Ahmed</p>
                  <p className="text-sm text-primary-foreground/70">Executive Editor</p>
                  <p className="text-sm text-primary-foreground/70">
                    Port City International University Journal
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary-foreground/70">
                    Address
                  </p>
                  <p className="text-sm">
                    Port City International University
                    <br />
                    7-14, Nikunja Housing Society, South Khulshi,
                    <br />
                    Chittagong, Bangladesh
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <Mail className="size-5 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary-foreground/70">
                    Email
                  </p>
                  <a href="mailto:pciujournal@portcity.edu.bd" className="text-sm underline">
                    pciujournal@portcity.edu.bd
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
