"use client";

import { User } from "lucide-react";
import type { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import FormSectionCard from "./FormSectionCard";

interface PersonalInfoSectionProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

export default function PersonalInfoSection<T extends FieldValues>({
  register,
  errors,
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput
          label="Full Name"
          required
          className="sm:col-span-2"
          placeholder="As written on your SSC certificate"
          registration={register("name" as Path<T>)}
          error={fieldErrors.name?.message}
        />
        <FormInput
          label="Father's Name"
          required
          registration={register("fatherName" as Path<T>)}
          error={fieldErrors.fatherName?.message}
        />
        <FormInput
          label="Mother's Name"
          required
          registration={register("motherName" as Path<T>)}
          error={fieldErrors.motherName?.message}
        />
        <FormInput
          label="Mobile Number"
          required
          type="tel"
          placeholder="+8801XXXXXXXXX"
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
