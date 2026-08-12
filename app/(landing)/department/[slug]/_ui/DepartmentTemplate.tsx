import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, Clock, Users, Award, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import type { DepartmentContent } from "@/types/department";

export default function DepartmentTemplate({ content }: { content: DepartmentContent }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-accent/20 text-accent text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full mb-4">
            {content.hero.badge}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-4">
            {content.hero.title}
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            {content.hero.subtitle}
          </p>
          {content.hero.buttonText && content.hero.buttonLink && (
            <Button
              variant="highlight"
              size="cta"
              className="mt-6"
              render={<Link href={content.hero.buttonLink} />}
            >
              {content.hero.buttonText}
            </Button>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                Welcome to {content.hero.title}
              </h2>
              <div
                className={
                  content.overview.hasImage ? "grid md:grid-cols-2 gap-6 items-center" : ""
                }
              >
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {content.overview.content.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {content.overview.hasImage && (
                  <div className="rounded-2xl bg-primary/10 h-56 flex items-center justify-center">
                    <GraduationCap className="size-16 text-primary/40" />
                  </div>
                )}
              </div>
            </section>

            {/* Chairman message */}
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                {content.chairmanHeading}
              </h2>
              <Card>
                <CardContent className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 text-primary font-heading font-bold text-2xl flex items-center justify-center shrink-0">
                    {content.chairman.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/g, "")[0]}
                  </div>
                  <div>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed mb-4">
                      {content.chairman.message.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                    <p className="font-semibold text-foreground">{content.chairman.name}</p>
                    <p className="text-xs text-muted-foreground">{content.chairman.designation}</p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Facilities */}
            {content.facilitiesHeading && content.facilities.length > 0 && (
              <section>
                <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                  {content.facilitiesHeading}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {content.facilities.map((facility) => {
                    const Icon = iconMap[facility.icon];
                    return (
                      <Card key={facility.name}>
                        <CardContent className="text-center py-6">
                          <Icon className="size-6 text-accent mx-auto mb-2" />
                          <p className="text-xs font-medium text-foreground">{facility.name}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Programs */}
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                Programs Offered
              </h2>
              <div className="space-y-4">
                {content.programs.map((program) => (
                  <Card key={program.name}>
                    <CardContent>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{program.name}</h3>
                        <Badge variant="secondary">{program.credits}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Duration: {program.duration}
                      </p>
                      {program.concentrations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {program.concentrations.map((c) => (
                            <Badge key={c} variant="outline">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Faculty members */}
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center justify-between">
                Faculty Members
                <Button
                  variant="ghostAccent"
                  size="sm"
                  render={<Link href={`/faculty?department=${encodeURIComponent(content.facultyQueryParam)}`} />}
                >
                  View All
                  <ChevronRight className="size-4" />
                </Button>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.facultyMembers.map((member) => (
                  <Card key={member.name}>
                    <CardContent className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-heading font-bold flex items-center justify-center mx-auto mb-3">
                        {member.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.)\s*/g, "")[0]}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.designation}</p>
                      <p className="text-xs text-accent mt-1">{member.specialization}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Research activities */}
            <section>
              <h2 className="font-heading font-bold text-xl text-foreground mb-4">
                Research Activities
              </h2>
              <div className="space-y-4">
                {content.researchAreas.map((area) => (
                  <Card key={area.title}>
                    <CardContent>
                      <h3 className="font-semibold text-foreground text-sm mb-1">{area.title}</h3>
                      <p className="text-xs text-accent mb-2">{area.author}</p>
                      <p className="text-sm text-muted-foreground">{area.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {content.industryPartners && content.industryPartners.length > 0 && (
                <Card className="mt-4">
                  <CardContent>
                    <h3 className="font-semibold text-foreground text-sm mb-3">
                      Industry Partnerships
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {content.industryPartners.map((partner) => (
                        <Badge key={partner} variant="secondary">
                          {partner}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="bg-primary text-primary-foreground">
              <CardContent>
                <h3 className="font-heading font-bold mb-4">Latest Notices</h3>
                <ul className="space-y-3">
                  {content.notices.map((notice) => (
                    <li key={notice.title} className="border-l-2 border-accent pl-3">
                      <p className="text-sm">{notice.title}</p>
                      <p className="text-xs text-primary-foreground/60">{notice.date}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4 pb-2 border-b-2 border-accent inline-block">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {content.quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.url}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4 pb-2 border-b-2 border-secondary inline-block">
                  Contact Us
                </h3>
                <div className="space-y-3 text-sm">
                  <p className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="size-4 shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{content.contact.address}</span>
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4 shrink-0" />
                    {content.contact.phone}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4 shrink-0" />
                    {content.contact.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="size-4 shrink-0" />
                    {content.contact.hours}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h3 className="font-heading font-bold text-foreground mb-4">Achievements</h3>
                <div className="grid grid-cols-3 gap-2">
                  {content.achievements.map((achievement, i) => {
                    const Icon = [Users, Award, BookOpen][i % 3];
                    return (
                      <div key={achievement.label} className="text-center">
                        <Icon className="size-5 text-accent mx-auto mb-1" />
                        <p className="font-heading font-bold text-foreground">
                          {achievement.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{achievement.label}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
