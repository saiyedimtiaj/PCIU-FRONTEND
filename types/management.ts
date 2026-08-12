import type { IconName } from "@/lib/icons";

export interface ManagementMember {
  serial: number;
  name: string;
  designation: string;
  role: string;
}

export type ManagementMemberGroup = "syndicate" | "academicCouncil" | "proctorialBody";

export interface ManagementTab {
  id: string;
  label: string;
  icon: IconName;
  description: string;
  members: ManagementMemberGroup;
}

export interface ManagementPageContent {
  tabs: ManagementTab[];
  syndicate: ManagementMember[];
  academicCouncil: ManagementMember[];
  proctorialBody: ManagementMember[];
}
