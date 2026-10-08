"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookMarked, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bachelorApplicationSchema, type BachelorApplicationValues } from "../../_lib/schema";
import { submitBachelorApplication } from "../../_lib/submit-action";
import ProgramSelectionSection from "../../_ui/ProgramSelectionSection";
import PersonalInfoSection from "../../_ui/PersonalInfoSection";
import { SscHscRow } from "../../_ui/EducationRowFields";
import ApplicationSubmitted from "../../_ui/ApplicationSubmitted";
import FormSectionCard from "../../_ui/FormSectionCard";
import type { PublicProgramItem, ActiveAdmissionSchedule } from "@/types/admission-apply";

export default function BachelorApplicationForm({
  programs,
  schedule,
}: {
  programs: PublicProgramItem[];
  schedule: ActiveAdmissionSchedule | null;
}) {
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BachelorApplicationValues>({
    resolver: zodResolver(bachelorApplicationSchema),
    defaultValues: {
      programId: "",
      title: "Mr.",
      firstName: "",
      middleName: "",
      lastName: "",
      fatherName: "",
      motherName: "",
      mobileNumber: "",
      dateOfBirth: "",
      email: "",
      ssc: { board: "", group: "", passingYear: "", rollNumber: "", regNumber: "", gpa: "" },
      hsc: { board: "", group: "", passingYear: "", rollNumber: "", regNumber: "", gpa: "" },
    },
  });

  const onSubmit = async (values: BachelorApplicationValues) => {
    setSubmitError(null);
    const result = await submitBachelorApplication(values);
    if (result.ok && result.referenceId) {
      setReferenceId(result.referenceId);
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (referenceId) {
    return <ApplicationSubmitted referenceId={referenceId} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={control}
        name="programId"
        render={({ field }) => (
          <ProgramSelectionSection
            programs={programs}
            schedule={schedule}
            programId={field.value}
            onProgramChange={field.onChange}
            error={errors.programId?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="title"
        render={({ field }) => (
          <PersonalInfoSection
            register={register}
            errors={errors}
            titleValue={field.value}
            onTitleChange={(value) => field.onChange(value as BachelorApplicationValues["title"])}
          />
        )}
      />

      <FormSectionCard
        id="education"
        step={3}
        icon={BookMarked}
        title="Educational Qualifications"
        subtitle="Your SSC and HSC results."
      >
        <div className="space-y-5">
          <Controller
            control={control}
            name="ssc.board"
            render={({ field }) => (
              <SscHscRow
                legend="SSC / Equivalent"
                namePrefix="ssc"
                register={register}
                errors={errors}
                boardValue={field.value}
                onBoardChange={field.onChange}
                boardError={errors.ssc?.board?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="hsc.board"
            render={({ field }) => (
              <SscHscRow
                legend="HSC / Equivalent"
                namePrefix="hsc"
                register={register}
                errors={errors}
                boardValue={field.value}
                onBoardChange={field.onChange}
                boardError={errors.hsc?.board?.message}
              />
            )}
          />
        </div>
      </FormSectionCard>

      {submitError && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="flex items-start gap-3 text-sm text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
          By applying, you confirm that the information above is correct and matches your certificates.
        </p>
        <Button
          type="submit"
          variant="highlight"
          size="cta"
          className="h-12 w-full shrink-0 px-10 text-base sm:w-auto"
          loading={isSubmitting}
        >
          Submit Application
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
