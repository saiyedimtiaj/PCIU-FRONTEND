"use client";

import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import FormSelect, { type FormSelectOption } from "./FormSelect";
import { BOARD_OPTIONS } from "../_lib/schema";

const BOARD_SELECT_OPTIONS: FormSelectOption[] = BOARD_OPTIONS.map((board) => ({
  label: board,
  value: board,
}));

interface SscHscRowProps<T extends FieldValues> {
  legend: string;
  namePrefix: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  boardValue: string;
  onBoardChange: (value: string) => void;
  boardError?: string;
}

function fieldName<T extends FieldValues>(prefix: Path<T>, suffix: string): Path<T> {
  return `${prefix}.${suffix}` as Path<T>;
}

export function SscHscRow<T extends FieldValues>({
  legend,
  namePrefix,
  register,
  errors,
  boardValue,
  onBoardChange,
  boardError,
}: SscHscRowProps<T>) {
  const prefixErrors = (errors as Record<string, Record<string, { message?: string }> | undefined>)[
    namePrefix as string
  ];

  return (
    <fieldset className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
      <legend className="float-left mb-5 flex w-full items-center gap-3 font-heading text-base font-semibold text-foreground">
        <span className="h-5 w-1 rounded-full bg-accent" />
        {legend}
      </legend>
      {/* 3 + 2 on wide screens: five fields in one row left each too narrow
          for "Registration Number" and the 11-digit numbers people type. */}
      <div className="clear-both grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <FormSelect
          label="Board"
          required
          className="lg:col-span-2"
          value={boardValue}
          onValueChange={onBoardChange}
          options={BOARD_SELECT_OPTIONS}
          error={boardError}
        />
        <FormInput
          label="Group"
          required
          className="lg:col-span-2"
          placeholder="Business Studies"
          registration={register(fieldName(namePrefix, "group"))}
          error={prefixErrors?.group?.message}
        />
        <FormInput
          label="Passing Year"
          required
          className="sm:col-span-2 lg:col-span-2"
          placeholder="2017"
          registration={register(fieldName(namePrefix, "passingYear"))}
          error={prefixErrors?.passingYear?.message}
        />
        <FormInput
          label="Roll Number"
          required
          className="lg:col-span-3"
          placeholder="234567"
          registration={register(fieldName(namePrefix, "rollNumber"))}
          error={prefixErrors?.rollNumber?.message}
        />
        <FormInput
          label="Registration Number"
          required
          className="lg:col-span-3"
          placeholder="2012131415"
          registration={register(fieldName(namePrefix, "registrationNumber"))}
          error={prefixErrors?.registrationNumber?.message}
        />
      </div>
    </fieldset>
  );
}

interface DegreeRowProps<T extends FieldValues> {
  legend: string;
  namePrefix: Path<T>;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  note?: string;
}

export function DegreeRow<T extends FieldValues>({
  legend,
  namePrefix,
  register,
  errors,
  required = true,
  note,
}: DegreeRowProps<T>) {
  const prefixErrors = (errors as Record<string, Record<string, { message?: string }> | undefined>)[
    namePrefix as string
  ];

  return (
    <fieldset className="rounded-2xl border border-border bg-muted/30 p-5 sm:p-6">
      <legend className="float-left mb-5 flex w-full items-center gap-3 font-heading text-base font-semibold text-foreground">
        <span className="h-5 w-1 rounded-full bg-accent" />
        {legend}
      </legend>
      {note && <p className="clear-both -mt-2 mb-5 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-foreground">{note}</p>}
      <div className="clear-both grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <FormInput
          label="Degree Name"
          required={required}
          className="sm:col-span-2 lg:col-span-3"
          placeholder="Bachelor of Business Administration"
          registration={register(fieldName(namePrefix, "degreeName"))}
          error={prefixErrors?.degreeName?.message}
        />
        <FormInput
          label="University"
          required={required}
          className="sm:col-span-2 lg:col-span-3"
          placeholder="University of Chittagong"
          registration={register(fieldName(namePrefix, "university"))}
          error={prefixErrors?.university?.message}
        />
        <FormInput
          label="Subject"
          required={required}
          className="lg:col-span-2"
          placeholder="Finance"
          registration={register(fieldName(namePrefix, "subject"))}
          error={prefixErrors?.subject?.message}
        />
        <FormInput
          label="Passing Year"
          required={required}
          className="lg:col-span-2"
          placeholder="2022"
          registration={register(fieldName(namePrefix, "passingYear"))}
          error={prefixErrors?.passingYear?.message}
        />
        <FormInput
          label="GPA / CGPA"
          required={required}
          className="sm:col-span-2 lg:col-span-2"
          placeholder="3.68"
          registration={register(fieldName(namePrefix, "gpa"))}
          error={prefixErrors?.gpa?.message}
        />
      </div>
    </fieldset>
  );
}
