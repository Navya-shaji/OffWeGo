import { z } from 'zod';

export const buddyTravelSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  
  categoryId: z
    .string()
    .min(1, 'Please select a category'),
  
  location: z
    .string()
    .min(1, 'Location is required')
    .min(3, 'Location must be at least 3 characters'),
  
  destination: z
    .string()
    .min(1, 'Please select a destination'),
  
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)), {
      message: 'Please enter a valid price',
    })
    .refine((val) => parseFloat(val) > 0, {
      message: 'Price must be greater than 0',
    }),
  
  maxPeople: z
    .string()
    .min(1, 'Maximum people is required')
    .refine((val) => !isNaN(parseInt(val)), {
      message: 'Please enter a valid number',
    })
    .refine((val) => parseInt(val) >= 1, {
      message: 'Maximum people must be at least 1',
    })
    .refine((val) => parseInt(val) <= 50, {
      message: 'Maximum people cannot exceed 50',
    }),
  
  startDate: z
    .string()
    .min(1, 'Start date is required')
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, {
      message: 'Start date cannot be in the past',
    }),
  
  endDate: z
    .string()
    .min(1, 'End date is required'),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export type BuddyTravelFormData = z.infer<typeof buddyTravelSchema>;