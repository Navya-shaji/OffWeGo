import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),

  email: z
    .string()
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter")
    .regex(/[0-9]/, "Password must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must include at least one special character"),

  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export type SignupFormData = z.infer<typeof signupSchema>;
