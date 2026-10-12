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
