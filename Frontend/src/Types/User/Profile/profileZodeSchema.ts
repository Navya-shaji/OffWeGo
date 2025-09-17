import { z } from "zod";


export const usernameSchema = z.string().min(1, "Username is required");


export const phoneSchema = z
  .string()
  .regex(/^\d{10}$/, "Phone must be 10 digits")
  .min(1, "Phone is required");

