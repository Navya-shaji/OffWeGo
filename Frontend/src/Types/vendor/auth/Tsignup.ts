import { z } from "zod";

export const vendorSignupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.string().trim().email("Please enter a valid email address").min(1, "Email is required"),
    phone: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Phone must be a valid 10-digit number starting with 6-9"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),

    document: z
      .any()
      .refine((file) => file instanceof File || (file && typeof file === 'object'), "Document is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type VendorSignupSchema = z.infer<typeof vendorSignupSchema>;
