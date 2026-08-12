"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Users } from "lucide-react";
import { iconMap } from "@/lib/icons";
import MemberCard from "./MemberCard";
import MemberTable from "./MemberTable";
import type { ManagementPageContent } from "@/types/management";

const DEFAULT_TAB_ID = "syndicate";

export default function ManagementTabs({ content }: { content: ManagementPageContent }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const requestedTab = searchParams.get("tab");
  const activeTab = content.tabs.some((tab) => tab.id === requestedTab)
    ? requestedTab!
    : DEFAULT_TAB_ID;
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  function selectTab(tabId: string) {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const currentTab = content.tabs.find((tab) => tab.id === activeTab) ?? content.tabs[0];
  const members = content[currentTab.members];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-28 rounded-xl border border-border bg-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground px-2 mb-2">
            Management Bodies
          </h3>
          <nav className="flex flex-col gap-1">
            {content.tabs.map((tab) => {
              const Icon = iconMap[tab.icon];
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {(() => {
                const Icon = iconMap[currentTab.icon];
                return <Icon className="w-5 h-5 text-primary" />;
              })()}
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-foreground">
                {currentTab.label}
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {currentTab.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-border p-1 self-start">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "cards" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground mb-6">
          <Users className="w-3.5 h-3.5" />
          {members.length} Members
        </div>

        {viewMode === "cards" ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((member) => (
              <MemberCard key={member.serial} member={member} />
            ))}
          </div>
        ) : (
          <MemberTable members={members} />
        )}
      </div>
    </div>
  );
}
