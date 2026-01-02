import { z } from "zod";

export const ActivitySchema = z.object({
  title: z.string().min(1, "Title is required").max(25,"Tiltle is too long"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.any().optional(),
  coordinates: z.object({
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }).optional(),
});

export type ActivityFormData = z.infer<typeof ActivitySchema>;