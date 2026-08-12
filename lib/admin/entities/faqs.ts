import { z } from "zod";
import { MessageCircleQuestionMark } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const faqsSchema = z.object({
  type: z.enum(["cfpg", "admission", "others"]),
  question: z.string().min(2, "Question is required").max(255),
  answer: z.string().min(2, "Answer is required").max(255),
  displayOrder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const faqsEntity: EntitySchema<typeof faqsSchema> = {
  slug: "faqs",
  title: "FAQ",
  description: "Add a frequently asked question and answer.",
  icon: MessageCircleQuestionMark,
  group: "Admission",
  zodSchema: faqsSchema,
  defaultValues: { type: "admission", displayOrder: 0, isActive: true },
  sections: [
    {
      title: "FAQ",
      fields: [
        {
          name: "type",
          label: "Category",
          type: "enum",
          required: true,
          options: [
            { label: "Admission", value: "admission" },
            { label: "Call for Paper Guidelines", value: "cfpg" },
            { label: "Others", value: "others" },
          ],
        },
        { name: "displayOrder", label: "Display Order", type: "number" },
        { name: "question", label: "Question", type: "textarea", required: true, colSpan: 2 },
        { name: "answer", label: "Answer", type: "richtext", required: true, colSpan: 2 },
        { name: "isActive", label: "Active", type: "switch" },
      ],
    },
  ],
};
