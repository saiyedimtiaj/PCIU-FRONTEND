import { z } from "zod";
import { Building } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const buildingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  status: z.boolean().default(true),
});

export const buildingEntity: EntitySchema<typeof buildingSchema> = {
  slug: "building",
  title: "Building",
  description: "Add a campus building.",
  icon: Building,
  group: "Scheduling",
  zodSchema: buildingSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Building",
      fields: [
        { name: "name", label: "Building Name", type: "text", required: true, colSpan: 2, placeholder: "Admin Building" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
