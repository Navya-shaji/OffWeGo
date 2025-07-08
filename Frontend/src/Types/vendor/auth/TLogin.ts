import {z} from 'zod'
export const VendorloginSchema=z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type VendorLoginFormData=z.infer<typeof VendorloginSchema>