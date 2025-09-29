import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(15, { message: "Category name must not exceed 15 letters" })
    .regex(/^[A-Za-z]+$/, { message: "Category name must contain only letters" }),
  description: z.string().min(1, { message: "Description is required" }),
  image: z
    .instanceof(File)
    .refine((file) => file instanceof File, {
      message: "Category image is required",
    }),
  typeMain: z.string().min(1, { message: "Main category is required" }),
  typeSub: z.array(z.string()).optional(),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;
