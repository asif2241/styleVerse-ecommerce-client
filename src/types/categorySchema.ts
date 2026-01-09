import { z } from "zod";

export const categoryFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    parent: z.string().optional(), // ObjectId as string
    isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;