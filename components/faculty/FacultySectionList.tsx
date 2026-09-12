import type { RowSectionKey } from "./FacultyProfileProvider";
import LiveSectionList from "./section-list/LiveSectionList";
import DemoSectionList from "./section-list/DemoSectionList";

export interface FacultySectionListProps {
  section: RowSectionKey;
  source?: "live" | "demo";
}

export default function FacultySectionList({ section, source = "demo" }: FacultySectionListProps) {
  return source === "live" ? (
    <LiveSectionList key={section} section={section} />
  ) : (
    <DemoSectionList key={section} section={section} />
  );
}
