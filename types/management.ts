import type { IconName } from "@/lib/icons";

export interface ManagementMember {
  serial: number;
  name: string;
  designation: string;
  role: string;
  /** Absolute photo URL; null shows the name's initial instead. */
  img?: string | null;
}

export type ManagementMemberGroup = "syndicate" | "academicCouncil" | "proctorialBody";

/** Static JSON tab descriptor — `members` names the array to read. */
export interface ManagementTabContent {
  id: string;
  label: string;
  icon: IconName;
  description: string;
  members: ManagementMemberGroup;
}

export interface ManagementPageContent {
  tabs: ManagementTabContent[];
  syndicate: ManagementMember[];
  academicCouncil: ManagementMember[];
  proctorialBody: ManagementMember[];
}

/** One management body with its members resolved, as the page renders it. */
export interface ManagementTab {
  id: string;
  label: string;
  icon: IconName;
  description: string;
  members: ManagementMember[];
}

/** One row of `GET /management/public`. */
export interface ManagementApiMember {
  id: number;
  name: string;
  img: string | null;
  designation: string;
  managementRole: string;
  type: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
  } | null;
}
