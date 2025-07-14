import { z } from "zod";

export const vendorSignupSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone must be 10 digits")
      .min(1, "Phone is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .min(1, "Password is required"),
    confirmPassword: z
      .string()
      .min(1, "Confirm Password is required"),

    documentUrl: z
      .string()
      .min(1, "Document is required")
      .url("Must be a valid URL")
      .optional(), 
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type VendorSignupSchema = z.infer<typeof vendorSignupSchema>;
