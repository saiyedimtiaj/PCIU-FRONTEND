import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";
import type { IconName } from "@/lib/icons";
import pageData from "@/content/management/page.json";
import type {
  ManagementApiMember,
  ManagementPageContent,
  ManagementTab,
} from "@/types/management";

const content = pageData as ManagementPageContent;

/** Icons for known bodies; any other type the API adds gets `building`. */
const TYPE_ICONS: Record<string, IconName> = {
  syndicate: "shield",
  "academic-council": "scale",
  "proctorial-body": "users",
  "proctorial-bodies": "users",
};

/** The static JSON the page shipped with, used only if the API is unreachable. */
function fallbackTabs(): ManagementTab[] {
  return content.tabs.map((tab) => ({ ...tab, members: content[tab.members] }));
}

/** "member" → "Member", "member secretary" → "Member Secretary". */
function titleCase(value: string) {
  return value.trim().replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Groups `GET /management/public` into one tab per management body
 * (`type`), in the order each body first appears in the response.
 */
export async function getManagementTabs(): Promise<ManagementTab[]> {
  try {
    const res = await publicFetch.get("/management/public", {
      next: { revalidate: 300, tags: ["management"] },
    });
    if (!res.ok) throw new Error(`Management request failed (${res.status})`);

    const payload = await res.json();
    if (!payload?.success || !Array.isArray(payload.data)) {
      throw new Error("Management API returned an invalid response");
    }

    const tabs = new Map<string, ManagementTab>();
    for (const member of payload.data as ManagementApiMember[]) {
      const slug = member.type?.slug ?? "other";
      let tab = tabs.get(slug);
      if (!tab) {
        tab = {
          id: slug,
          label: member.type?.name ?? "Other",
          icon: TYPE_ICONS[slug] ?? "building",
          description: member.type?.description ?? "",
          members: [],
        };
        tabs.set(slug, tab);
      }
      tab.members.push({
        serial: tab.members.length + 1,
        name: member.name,
        designation: member.designation,
        role: titleCase(member.managementRole || "Member"),
        img: getMediaUrl(member.img),
      });
    }

    return [...tabs.values()];
  } catch (error) {
    console.error("[Management] Falling back to static content:", error);
    return fallbackTabs();
  }
}
