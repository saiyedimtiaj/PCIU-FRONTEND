"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
}

export function DepartmentNav({ sections }: { sections: Section[] }) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");

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
      }
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
    <nav className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <h3 className="font-heading font-bold text-[#1e3a8a] mb-4 px-2 uppercase text-sm tracking-wider">
        On this page
      </h3>
      <ul className="space-y-1">
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={cn(
                "block px-3 py-2 text-sm rounded-lg transition-colors",
                activeSection === id
                  ? "bg-accent text-black font-semibold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
