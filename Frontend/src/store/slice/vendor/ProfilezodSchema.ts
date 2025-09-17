
import { z } from "zod";

export const vendorEditSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only digits"),
});

export type VendorEditSchema = z.infer<typeof vendorEditSchema>;
