"use client";

import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { PortCityJournalContent } from "@/types/port-city-journal";

export default function JournalArchive({ content }: { content: PortCityJournalContent }) {
  const [query, setQuery] = useState("");

  const filtered = content.volumes
    .map((volume) => {
      if (!query) return volume;
      const q = query.toLowerCase();
      const sections = volume.sections
        .map((section) => ({
          ...section,
          articles: section.articles.filter(
            (a) => a.title.toLowerCase().includes(q) || a.authors.toLowerCase().includes(q)
          ),
        }))
        .filter((section) => section.articles.length > 0);
      return { ...volume, sections };
    })
    .filter((volume) => volume.sections.length > 0 || !query);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading font-bold text-2xl text-foreground">Journal Archive</h2>
          <p className="text-sm text-muted-foreground">
            Browse published volumes and search articles by title or author.
          </p>
        </div>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Accordion defaultValue={["v9"]} className="space-y-3">
        {filtered.map((volume) => (
          <AccordionItem key={volume.id} value={volume.id}>
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                {volume.title}
                {volume.year && (
                  <span className="text-xs text-muted-foreground font-normal">
                    Published {volume.year}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {volume.intro && (
                <p className="italic text-sm text-muted-foreground border-l-2 border-accent pl-4 mb-4">
                  {volume.intro}
                </p>
              )}
              <div className="space-y-4">
                {volume.sections.map((section) => (
                  <div key={section.name}>
                    <Badge className="bg-primary text-primary-foreground mb-2">
                      {section.name}
                    </Badge>
                    <ul className="divide-y divide-border border border-border rounded-lg overflow-hidden">
                      {section.articles.map((article) => (
                        <li key={article.title} className="px-4 py-2.5 text-sm">
                          <p className="text-foreground">{article.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {article.authors} &middot; p. {article.page}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-center text-sm text-muted-foreground italic mt-8">
        For copies of individual articles, please contact {content.contactEmail} or call{" "}
        {content.contactPhone}.
      </p>
    </div>
  );
}
