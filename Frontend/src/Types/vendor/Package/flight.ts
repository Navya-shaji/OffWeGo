import { z } from "zod";

export const flightSchema = z.object({
  date: z.string().min(1, "Date is Required"),
  fromLocation: z.string().min(1, "from location is required"),
  toLocation: z.string().min(1, "To location is required"),
  airLine: z.string().min(1, "Airline name is required"),
  price: z
    .number("Price must be a number")
    .min(1, "Price must be greater than 0"),
});

export type FlightFormData = z.infer<typeof flightSchema>;