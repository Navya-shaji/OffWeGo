import { z } from "zod";

export const ActivitySchema = z.object({
  title: z.string().min(1, "Title is required").max(10,"Tiltle is too long"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.any().optional(), 
});

export type ActivityFormData = z.infer<typeof ActivitySchema>;