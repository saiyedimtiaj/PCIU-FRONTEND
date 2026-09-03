import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Calendar, Mail, MapPin, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden bg-linear-to-br from-accent via-accent/90 to-primary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <FileText className="size-8 text-white" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mb-2">
            Call For Paper
          </h1>
          <p className="text-white/80">
            The Port City Journal &middot; ISSN: 2311-3146 &middot; Volume 13, Issue (1+2)
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-6">
        <Card className="bg-linear-to-r from-destructive/10 to-accent/10 border-l-4 border-l-destructive">
          <CardContent className="flex items-center gap-4">
            <Calendar className="size-8 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Last Date of Submission</p>
              <p className="font-heading font-bold text-xl text-foreground">31 March, 2027</p>
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
