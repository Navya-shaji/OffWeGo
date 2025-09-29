import { z } from "zod";

export const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required").max(10,"Hotel name is too long"),
  address: z.string().min(1, "Address is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be more than 5"),
});

export type HotelFormData = z.infer<typeof hotelSchema>;
