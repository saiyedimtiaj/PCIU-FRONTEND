import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/shared/Breadcrumb";
import IconHero from "@/components/shared/IconHero";
import { iconMap } from "@/lib/icons";
import pageData from "@/content/library/page.json";
import type { LibraryPageContent } from "@/types/library";

const content = pageData as LibraryPageContent;
const UsersIcon = iconMap.users;
const DatabaseIcon = iconMap.database;
const BookOpenIcon = iconMap["book-open"];

export const metadata: Metadata = {
  title: "Library | Port City International University",
  description:
    "PCIU Central Library — book lending, digital resources, study rooms, e-library and academic journal access.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb items={[{ label: "Library" }]} />

      <main className="container mx-auto px-4 py-12">
        <IconHero
          icon="library"
          title="PCIU Central Library"
          subtitle="Your gateway to knowledge, research, and academic excellence"
        />

        {/* Hours / Contact / Email */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {content.infoCards.map((card) => {
            const Icon = iconMap[card.icon];
            return (
              <Card key={card.title}>
                <CardContent className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{card.title}</h3>
                    {card.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Services */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
            Our Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service) => (
              <Card key={service.title}>
                <CardContent>
                  <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Committee */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6 flex items-center gap-3">
            <UsersIcon className="w-6 h-6 text-primary" />
            Library Committee
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.committeeMembers.map((member) => {
              const initials = member.name
                .split(" ")
                .filter((part) => /^[A-Z]/.test(part))
                .map((part) => part[0])
                .join("")
                .slice(0, 2);
              return (
                <Card key={member.email}>
                  <CardContent className="flex items-center gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{member.designation}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* E-Library resources */}
        <div className="bg-gradient-subtle rounded-2xl p-8 mb-16">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 flex items-center gap-3">
            <DatabaseIcon className="w-6 h-6 text-primary" />
            E-Library Resources
          </h2>
          <p className="text-muted-foreground mb-6">
            Access thousands of digital books, journals, and educational materials for your
            academic needs
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.eLibraryLinks.map((link) => {
              const Icon = link.icon ? iconMap[link.icon] : null;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Card className="h-full transition-colors hover:border-accent">
                    <CardContent>
                      {Icon && <Icon className="w-5 h-5 text-accent mb-2" />}
                      <h3 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1.5">
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </h3>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        </div>

        {/* Journals */}
        <div className="mb-16">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2 flex items-center gap-3">
            <BookOpenIcon className="w-6 h-6 text-primary" />
            Academic Journals &amp; Databases
          </h2>
          <p className="text-muted-foreground mb-6">
            Access world-renowned academic journals and research databases
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.journalLinks.map((link) => (
              <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                <Card className="h-full transition-colors hover:border-accent">
                  <CardContent>
                    <h3 className="font-semibold text-foreground text-sm mb-1 flex items-center gap-1.5">
                      {link.name}
                      <ExternalLink className="w-3 h-3" />
                    </h3>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-2xl p-8 text-center">
          <h2 className="font-heading font-bold text-2xl text-primary-foreground mb-2">
            Need Help Finding Resources?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our librarians are here to help you with research, finding materials, and using our
            digital resources.
          </p>
          <Button variant="highlight" size="cta">
            Contact Library Support
          </Button>
        </div>
      </main>
    </div>
  );
}
