"use client";

import { User } from "lucide-react";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import FormSelect, { type FormSelectOption } from "./FormSelect";
import FormSectionCard from "./FormSectionCard";
import { TITLE_OPTIONS } from "../_lib/schema";

const TITLE_SELECT_OPTIONS: FormSelectOption[] = TITLE_OPTIONS.map((title) => ({
  label: title,
  value: title,
}));

interface PersonalInfoSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  titleValue: string;
  onTitleChange: (value: string) => void;
}

export default function PersonalInfoSection<T extends FieldValues>({
  register,
  errors,
  titleValue,
  onTitleChange,
}: PersonalInfoSectionProps<T>) {
  const fieldErrors = errors as Record<string, { message?: string } | undefined>;

  return (
    <FormSectionCard
      id="personal"
      step={2}
      icon={User}
      title="Personal Information"
      subtitle="Enter your details exactly as they appear on your certificates."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormSelect
          label="Title"
          required
          className="lg:col-span-1"
          value={titleValue}
          onValueChange={onTitleChange}
          options={TITLE_SELECT_OPTIONS}
          error={fieldErrors.title?.message}
        />
        <FormInput
          label="First Name"
          required
          className="lg:col-span-1"
          registration={register("firstName" as Path<T>)}
          error={fieldErrors.firstName?.message}
        />
        <FormInput
          label="Middle Name"
          className="lg:col-span-1"
          registration={register("middleName" as Path<T>)}
          error={fieldErrors.middleName?.message}
        />
        <FormInput
          label="Last Name"
          required
          className="lg:col-span-1"
          registration={register("lastName" as Path<T>)}
          error={fieldErrors.lastName?.message}
        />
        <FormInput
          label="Father's Name"
          required
          className="sm:col-span-2"
          registration={register("fatherName" as Path<T>)}
          error={fieldErrors.fatherName?.message}
        />
        <FormInput
          label="Mother's Name"
          required
          className="sm:col-span-2"
          registration={register("motherName" as Path<T>)}
          error={fieldErrors.motherName?.message}
        />
        <FormInput
          label="Mobile Number"
          required
          placeholder="8801XXXXXXXXX"
          registration={register("mobileNumber" as Path<T>)}
          error={fieldErrors.mobileNumber?.message}
        />
        <FormInput
          label="Date of Birth"
          required
          type="date"
          registration={register("dateOfBirth" as Path<T>)}
          error={fieldErrors.dateOfBirth?.message}
        />
        <FormInput
          label="Email"
          required
          type="email"
          className="sm:col-span-2"
          placeholder="address@example.com"
          registration={register("email" as Path<T>)}
          error={fieldErrors.email?.message}
        />
      </div>
    </FormSectionCard>
  );
}
