import { z } from "zod";
import { DoorOpen } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const roomSchema = z.object({
  building_id: z.string().min(1, "Building is required"),
  name: z.string().min(1, "Name is required").max(100),
  status: z.boolean().default(true),
});

export const roomEntity: EntitySchema<typeof roomSchema> = {
  slug: "room",
  title: "Room",
  description: "Add a room within a building.",
  icon: DoorOpen,
  group: "Scheduling",
  zodSchema: roomSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Room",
      fields: [
        { name: "name", label: "Room Name", type: "text", required: true, placeholder: "Room 301" },
        { name: "building_id", label: "Building", type: "relation", required: true, relationTo: "building", options: [] },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
