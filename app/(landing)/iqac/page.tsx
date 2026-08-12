import type { Metadata } from "next";
import { Eye, Target, ClipboardCheck, GraduationCap, Users, FileText, BookOpen, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ActivitiesGallery from "./_ui/ActivitiesGallery";
import pageData from "@/content/iqac/page.json";
import type { IqacPageContent } from "@/types/iqac";

const content = pageData as IqacPageContent;

export const metadata: Metadata = {
  title: "IQAC | Port City International University",
  description:
    "Institutional Quality Assurance Cell — ensuring excellence in teaching, learning, and research at Port City International University.",
};

const NOTICE_BORDER: Record<string, string> = {
  accent: "border-l-accent",
  secondary: "border-l-secondary",
  highlight: "border-l-highlight",
};

export default function IqacPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-linear-to-br from-primary via-primary/95 to-secondary py-20 lg:py-28">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-accent text-accent-foreground mb-4">Quality Assurance</Badge>
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-4">
            Institutional Quality Assurance Cell
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Ensuring excellence in teaching, learning, and research through systematic quality
            enhancement initiatives at PCIU.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <Building2 className="size-5 text-primary" />
                About IQAC
              </h2>
              <Card>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {content.about.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </CardContent>
              </Card>
            </section>

            <section className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent>
                  <Eye className="size-6 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">{content.vision}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Target className="size-6 text-accent mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">{content.mission}</p>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <ClipboardCheck className="size-5 text-primary" />
                Objectives
              </h2>
              <Card>
                <CardContent>
                  <ol className="grid sm:grid-cols-2 gap-3">
                    {content.objectives.map((obj, i) => (
                      <li key={obj} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="font-heading font-bold text-accent shrink-0">{i + 1}.</span>
                        {obj}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <GraduationCap className="size-5 text-primary" />
                Message from Director
              </h2>
              <Card>
                <CardContent className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary font-heading font-bold text-2xl flex items-center justify-center shrink-0">
                    {content.directorMessage.name.replace(/^(Prof\.|Dr\.)\s*/g, "")[0]}
                  </div>
                  <div>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-4">
                      {content.directorMessage.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <p className="font-semibold text-foreground">{content.directorMessage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {content.directorMessage.designation} &middot; {content.directorMessage.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
                <Users className="size-5 text-primary" />
                IQAC Committee
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.committeeMembers.map((member) => (
                  <Card key={member.email}>
                    <CardContent className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center shrink-0">
                        {member.name.replace(/^(Prof\.|Dr\.)\s*/g, "")[0]}
                      </div>
                      <div className="min-w-0">
                        <Badge variant="secondary" className="mb-1">
                          {member.role}
                        </Badge>
                        <p className="text-sm font-semibold text-foreground truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{member.designation}</p>
                        <p className="text-xs text-muted-foreground">{member.department}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <ActivitiesGallery activities={content.activities} gallery={content.gallery} />
          </div>

          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground lg:sticky lg:top-24">
              <CardContent>
                <h3 className="font-heading font-bold mb-3">Contact IQAC</h3>
                <p className="text-sm whitespace-pre-line text-primary-foreground/80 mb-3 flex items-start gap-2">
                  <MapPin className="size-4 shrink-0 mt-0.5" />
                  {content.contact.address}
                </p>
                <p className="text-sm text-primary-foreground/80 mb-2 flex items-center gap-2">
                  <Phone className="size-4 shrink-0" />
                  {content.contact.phone}
                </p>
                <a
                  href={`mailto:${content.contact.email}`}
                  className="text-sm text-primary-foreground/80 flex items-center gap-2 hover:text-white"
                >
                  <Mail className="size-4 shrink-0" />
                  {content.contact.email}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Documents
                </h3>
                <ul className="space-y-2">
                  {content.documents.map((doc) => (
                    <li key={doc.name} className="text-sm">
                      <a href="#" className="text-foreground hover:text-primary block truncate">
                        {doc.name}
                      </a>
                      <span className="text-xs text-muted-foreground">
                        {doc.type} &middot; {doc.size}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {content.quickLinks.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target={link.url !== "#" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-subtle">
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4">Notice Board</h3>
                <ul className="space-y-3">
                  {content.notices.map((notice) => (
                    <li
                      key={notice.title}
                      className={`border-l-2 pl-3 ${NOTICE_BORDER[notice.color]}`}
                    >
                      <p className="text-sm text-foreground">{notice.title}</p>
                      <p className="text-xs text-muted-foreground">{notice.date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
