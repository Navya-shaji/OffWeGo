import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, {
    message: "Title is required"
  }),
  description: z.string().min(1, {
    message: "Description is required"
  }),
  location: z.string().min(1, {
    message: "Location is required"
  }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  })

});

export type DestinationFormData = z.infer<typeof destinationSchema>;
