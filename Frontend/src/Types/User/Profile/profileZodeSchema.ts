import { z } from "zod";

// Comprehensive profile edit schema
export const profileEditSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine((val) => {
      const trimmed = val.trim();
      return trimmed.length >= 2;
    }, {
      message: "Name must be at least 2 characters and cannot be empty",
    })
    .refine((val) => {
      const trimmed = val.trim();
      return trimmed.length <= 50;
    }, {
      message: "Name must not exceed 50 characters",
    })
    .refine((val) => {
      const trimmed = val.trim();
      return /^[a-zA-Z\s'-]+$/.test(trimmed);
    }, {
      message: "Name can only contain letters, spaces, hyphens, and apostrophes",
    }),
  
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => {
      const trimmed = val.trim();
      // Phone is required, cannot be empty
      if (trimmed === "") {
        return false;
      }
      // Must be exactly 10 digits
      return /^\d{10}$/.test(trimmed);
    }, {
      message: "Phone number must be exactly 10 digits",
    }),
  
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

// Individual field schemas for real-time validation
export const usernameSchema = z
  .string()
  .min(1, "Name is required")
  .refine((val) => {
    const trimmed = val.trim();
    return trimmed.length >= 2;
  }, {
    message: "Name must be at least 2 characters and cannot be empty",
  })
  .refine((val) => {
    const trimmed = val.trim();
    return trimmed.length <= 50;
  }, {
    message: "Name must not exceed 50 characters",
  })
  .refine((val) => {
    const trimmed = val.trim();
    return /^[a-zA-Z\s'-]+$/.test(trimmed);
  }, {
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
  });

export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine((val) => {
    const trimmed = val.trim();
    // Phone is required, cannot be empty
    if (trimmed === "") {
      return false;
    }
    // Must be exactly 10 digits
    return /^\d{10}$/.test(trimmed);
  }, {
    message: "Phone number must be exactly 10 digits",
  });

// Image file validation schema
export const imageFileSchema = z
  .instanceof(File, { message: "Must be a file" })
  .refine((file) => {
    // Check file size (max 5MB)
    return file.size <= 5 * 1024 * 1024;
  }, {
    message: "Image size must be less than 5MB",
  })
  .refine((file) => {
    // Check file type
    return file.type.startsWith("image/");
  }, {
    message: "File must be an image (JPG, PNG, GIF, or WebP)",
  });

export type ProfileEditFormData = z.infer<typeof profileEditSchema>;


