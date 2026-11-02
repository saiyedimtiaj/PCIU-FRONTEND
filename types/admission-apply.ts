export interface PublicProgramItem {
  id: number;
  title: string;
  programType: "UNDERGRADUATE" | "GRADUATE";
  duration: string;
  status: boolean;
}

export interface ActiveAdmissionSchedule {
  semesterName: string;
  year: number;
}

/** `GET /admissioncycle/active` — the intake applications are open for. */
export interface ActiveAdmissionCycle {
  id: number;
  semester: string;
  isActive: boolean;
  applicationStart: string | null;
  applicationEnd: string | null;
}
