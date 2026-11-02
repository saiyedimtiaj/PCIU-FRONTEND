"use client";

import { BookOpenCheck } from "lucide-react";
import FormSelect, { type FormSelectOption } from "./FormSelect";
import FormSectionCard from "./FormSectionCard";
import type { PublicProgramItem, ActiveAdmissionCycle } from "@/types/admission-apply";

export default function ProgramSelectionSection({
  programs,
  cycle,
  programId,
  onProgramChange,
  error,
}: {
  programs: PublicProgramItem[];
  cycle: ActiveAdmissionCycle;
  programId: string;
  onProgramChange: (value: string) => void;
  error?: string;
}) {
  const options: FormSelectOption[] = programs.map((program) => ({
    label: program.title,
    value: String(program.id),
  }));

  const semesterLabel = cycle.semester || "Upcoming Semester";

  return (
    <FormSectionCard
      id="program"
      step={1}
      icon={BookOpenCheck}
      title="Program Selection"
      subtitle="Choose the program you want to study."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect
          label="Program"
          required
          value={programId}
          onValueChange={onProgramChange}
          options={options}
          placeholder="Please select a program"
          error={error}
        />
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Semester</label>
          <div className="flex h-11 w-full items-center rounded-lg border border-input bg-muted/40 px-4 text-sm text-muted-foreground">
            {semesterLabel}
          </div>
        </div>
      </div>
    </FormSectionCard>
  );
}
