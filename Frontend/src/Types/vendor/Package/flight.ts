import { z } from "zod";

export const flightSchema = z.object({
  airLine: z.string().nonempty("Airline name is required"),
  price: z.object({
    economy: z.number().min(1, "Economy price must be greater than 0"),
    premium: z.number().optional(),
    business: z.number().optional(),
  }),
});

export type FlightFormData = z.infer<typeof flightSchema>;
