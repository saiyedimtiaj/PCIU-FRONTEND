"use client";

import { useState } from "react";
import { Info, Users, FileText, Mail, ChevronRight, BookOpen, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { JournalTabId, PortCityNewsPageContent } from "@/types/port-city-news";

const TAB_META: { id: JournalTabId; label: string; icon: typeof Info }[] = [
  { id: "about", label: "About Us", icon: Info },
  { id: "advisory", label: "Advisory Board", icon: Users },
  { id: "editorial", label: "Editorial Board", icon: Users },
  { id: "author", label: "Author Instructions", icon: FileText },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function JournalTabs({ content }: { content: PortCityNewsPageContent }) {
  const [activeTab, setActiveTab] = useState<JournalTabId>("about");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-1 order-2 lg:order-1 space-y-6">
        <Card>
          <CardContent>
            <h3 className="font-semibold text-foreground mb-3">Menu</h3>
            <nav className="flex flex-col gap-1">
              {content.sidebarLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between text-sm text-muted-foreground hover:text-primary py-1.5"
                >
                  {link.label}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </nav>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="font-semibold text-foreground mb-1">
              Journal <span className="text-accent">Archives</span>
            </h3>
            <Separator className="my-3" />
            <div className="flex flex-col gap-3">
              {content.archives.map((item) => (
                <a
                  key={item.id}
                  href={item.pdfUrl}
                  target={item.pdfUrl !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                      {item.volumeName} ({item.year})
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Download PDF
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main content */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <div className="flex flex-wrap gap-2 mb-6">
          {TAB_META.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <Card>
          <CardContent>
            {activeTab === "about" && <AboutTab content={content.tabs.about} />}
            {activeTab === "advisory" && <BoardTab members={content.tabs.advisory.members} field="title" />}
            {activeTab === "editorial" && <BoardTab members={content.tabs.editorial.members} field="dept" />}
            {activeTab === "author" && <AuthorTab content={content.tabs.author} />}
            {activeTab === "contact" && <ContactTab content={content.tabs.contact} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AboutTab({ content }: { content: PortCityNewsPageContent["tabs"]["about"] }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground">{content.title}</h2>
      <p className="text-muted-foreground italic mb-4">{content.subtitle}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{content.description}</p>
      <div className="bg-muted rounded-lg px-4 py-3 text-sm mb-4">
        <span className="font-semibold text-foreground">{content.issn}</span>
        {content.issnNote && <span className="text-muted-foreground"> — {content.issnNote}</span>}
      </div>
      {content.chiefEditor && (
        <>
          <Separator className="my-4" />
          <p className="text-sm">
            <span className="font-semibold text-foreground">Chief Editor: </span>
            {content.chiefEditor.name}, {content.chiefEditor.designation}
          </p>
        </>
      )}
      {content.associateEditors && content.associateEditors.length > 0 && (
        <>
          <Separator className="my-4" />
          <p className="text-sm font-semibold text-foreground mb-1">Associate Editors</p>
          {content.associateEditors.map((editor) => (
            <p key={editor.name} className="text-sm text-muted-foreground">
              {editor.name}
            </p>
          ))}
        </>
      )}
    </div>
  );
}

function BoardTab({
  members,
  field,
}: {
  members: PortCityNewsPageContent["tabs"]["advisory"]["members"];
  field: "title" | "dept";
}) {
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-1">Board Members</h2>
      <Separator className="my-4" />
      <div className="grid sm:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.name}>
            <CardContent>
              <p className="font-semibold text-foreground text-sm">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member[field]}</p>
              {member.role && (
                <Badge className="mt-2 bg-accent text-accent-foreground">{member.role}</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AuthorTab({ content }: { content: PortCityNewsPageContent["tabs"]["author"] }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-xl text-foreground mb-1">
        Author Instructions
      </h2>
      <Separator className="my-4" />
      <div className="space-y-6">
        {content.sections.map((section) => (
          <div key={section.heading}>
            <h3 className="font-semibold text-foreground mb-2">{section.heading}</h3>
            {section.items ? (
              <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">{section.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab({ content }: { content: PortCityNewsPageContent["tabs"]["contact"] }) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <p className="font-semibold text-foreground">{content.officeName}</p>
        <p className="text-sm text-muted-foreground">{content.journalName}</p>
        <p className="text-sm text-muted-foreground">{content.university}</p>
        <p className="text-sm text-muted-foreground">{content.address}</p>
        <p className="text-sm text-muted-foreground">{content.city}</p>
        <Separator className="my-4" />
        <p className="text-sm text-foreground">{content.email}</p>
        <p className="text-sm text-foreground">{content.phone}</p>
        <p className="text-sm text-foreground">{content.website}</p>
      </CardContent>
    </Card>
  );
}
