import { z } from "zod";
import { optionalUpload } from "./_upload";
import { UserCog } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const userSchema = z.object({
  image: optionalUpload,
  full_name: z.string().min(2, "Full name is required").max(255),
  email: z.string().email("Must be a valid email").max(255),
  phone: z.string().max(255).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(255),
  role: z.enum(["ADMIN", "MODERATOR"]),
});

export const userEntity: EntitySchema<typeof userSchema> = {
  slug: "user",
  title: "User",
  description: "Add a system user with a login and role.",
  icon: UserCog,
  group: "People",
  zodSchema: userSchema,
  defaultValues: { role: "MODERATOR" },
  sections: [
    {
      title: "Account",
      fields: [
        { name: "full_name", label: "Full Name", type: "text", required: true, colSpan: 2 },
        { name: "email", label: "Email", type: "email", required: true, immutableOnEdit: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "password", label: "Password", type: "password", required: true, helper: "At least 8 characters." },
        {
          name: "image",
          label: "Profile Photo",
          type: "image",
          colSpan: 2,
        },
        {
          name: "role",
          label: "Role",
          type: "enum",
          required: true,
          options: [
            { label: "Admin", value: "ADMIN" },
            { label: "Moderator", value: "MODERATOR" },
          ],
        },
      ],
    },
  ],
};
