"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { iconMap, type IconName } from "@/lib/icons";

interface Section {
  id: string;
  label: string;
  icon?: IconName;
}

export function DepartmentNav({
  sections,
  title = "On this page",
}: {
  sections: Section[];
  title?: string;
}) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || "",
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // We only care about entries that are currently intersecting
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // If multiple are visible, pick the first one (which is highest in the DOM usually)
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        // Adjust these margins so it triggers when the section header reaches the upper part of the viewport
        rootMargin: "-20% 0px -60% 0px",
      },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <div className="lg:sticky lg:top-24 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-primary text-primary-foreground px-4 py-3">
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
      </div>
      <nav className="flex flex-col p-2">
        {sections.map(({ id, label, icon }) => {
          const Icon = icon ? iconMap[icon] : null;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                activeSection === id
                  ? "bg-accent/40 text-black border-l-4 border-accent font-medium"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {label}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
