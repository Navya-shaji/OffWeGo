import { z } from "zod";

export const SubscriptionSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
 

  price: z.number("Price must be a number").min(0, "Price cannot be negative"),
  duration: z
    .number("Duration must be a number")
    .min(1, "Duration must be at least 1 day"),
  maxPackages: z
    .number("Max packages must be a number")
    .min(1, "Max packages must be at least 1"),
 
});

export type SubscriptionFormData = z.infer<typeof SubscriptionSchema>;
