import { z } from "zod";

export const SubscriptionSchema = z.object({
  name: z.string().min(2, "Plan name must be at least 2 characters"),
  
  price: z.number().min(0, "Price cannot be negative"),

  duration: z
    .number()
    .min(1, "Duration must be at least 1 day"),

  features: z
    .string()
    .min(1, "Enter at least one feature")
    .transform((val) =>
      val.split(",").map((f) => f.trim()).filter(Boolean)
    ),
});

export type SubscriptionFormData = z.infer<typeof SubscriptionSchema>;
