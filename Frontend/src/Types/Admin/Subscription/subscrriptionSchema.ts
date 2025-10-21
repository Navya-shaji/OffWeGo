import { z } from "zod";

export const SubscriptionSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  commissionRate: z
    .number("Commission rate must be a number")
    .min(0, "Commission rate cannot be negative")
    .max(100, "Commission rate cannot exceed 100"),
  price: z.number("Price must be a number").min(0, "Price cannot be negative"),
  durationInDays: z
    .number("Duration must be a number")
    .min(1, "Duration must be at least 1 day"),
  maxPackages: z
    .number("Max packages must be a number")
    .min(1, "Max packages must be at least 1"),
  features: z
    .string()
    .min(1, "At least one feature is required")
    .transform((val) => val.split(",").map((f) => f.trim())),
});

export type SubscriptionFormData = z.infer<typeof SubscriptionSchema>;
