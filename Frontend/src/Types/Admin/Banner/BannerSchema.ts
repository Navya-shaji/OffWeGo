import { z } from "zod";

export const BannerSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(30, { message: "Title must not exceed 30 characters" }),
  video: z.instanceof(File, { message: "Video file is required" }),
  action: z.boolean(),
});

export type BannerFormData = z.infer<typeof BannerSchema>;
