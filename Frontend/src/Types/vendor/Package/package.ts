import { useState } from "react";

// Types for Hotels, Activities, and Itinerary
export interface Hotel {
  hotelId: string;
  name: string;
  address: string;
  rating: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  activities: { time: string; activity: string }[];
}

// Full form data type
export interface PackageFormData {
  packageName: string;
  description: string;
  price: number;
  duration: number;
  destinationId: string;
  checkInTime: string;
  checkOutTime: string;
  images: string[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  amenities: string[];
  selectedHotels: Hotel[];
  selectedActivities: Activity[];
}

// Field names
type FieldName = keyof PackageFormData;
// Field values
type FieldValue<F extends FieldName> = PackageFormData[F];

// Individual validators
export const validatePackageName = (name: string) => {
  if (!name.trim()) return "Package name is required";
  if (name.length < 3) return "Package name must be at least 3 characters";
  if (name.length > 100) return "Package name must not exceed 100 characters";
  return "";
};

export const validateDescription = (desc: string) => {
  if (!desc.trim()) return "Description is required";
  if (desc.length < 20) return "Description must be at least 20 characters";
  if (desc.length > 1000) return "Description must not exceed 1000 characters";
  return "";
};

export const validatePrice = (price: number) => {
  if (price <= 0) return "Price must be greater than 0";
  if (price < 100) return "Price seems too low (minimum ₹100)";
  if (price > 1000000) return "Price seems too high (maximum ₹10,00,000)";
  return "";
};

export const validateDuration = (duration: number) => {
  if (duration < 1) return "Duration must be at least 1 day";
  if (duration > 30) return "Duration cannot exceed 30 days";
  return "";
};

export const validateDestination = (destinationId: string) =>
  !destinationId ? "Please select a destination" : "";

export const validateTime = (time: string, label: string) => {
  if (!time.trim()) return `${label} is required`;
  const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;
  if (!regex.test(time.trim())) return `${label} must be in format HH:MM AM/PM`;
  return "";
};

export const validateItinerary = (itinerary: ItineraryDay[]) => {
  if (itinerary.length === 0) return "Please add at least one day to the itinerary";
  for (const day of itinerary) {
    if (day.activities.length === 0) return `Day ${day.day} must have at least one activity`;
    day.activities.forEach((act, idx) => {
      if (!act.time.trim()) return `Day ${day.day} Activity ${idx + 1}: Time required`;
      if (!act.activity.trim()) return `Day ${day.day} Activity ${idx + 1}: Description required`;
      if (act.activity.length < 3) return `Day ${day.day} Activity ${idx + 1}: Must be at least 3 characters`;
    });
  }
  return "";
};

export const validateImages = (images: string[]) => {
  if (images.length === 0) return "Please upload at least one image";
  if (images.length > 10) return "Maximum 10 images allowed";
  return "";
};

export const validateInclusions = (inclusions: string[]) => {
  if (inclusions.length === 0) return "Please add at least one inclusion";
  if (inclusions.some(i => !i.trim())) return "Remove empty inclusions";
  return "";
};

export const validateAmenities = (amenities: string[]) => {
  if (amenities.length === 0) return "Please add at least one amenity";
  if (amenities.some(a => !a.trim())) return "Remove empty amenities";
  return "";
};

export const validateHotels = (hotels: Hotel[]) => {
  if (hotels.length === 0) return "Please select at least one hotel";
  if (hotels.length > 5) return "Maximum 5 hotels allowed per package";
  return "";
};

export const validateActivities = (activities: Activity[]) => {
  if (activities.length === 0) return "Please select at least one activity";
  if (activities.length > 15) return "Maximum 15 activities allowed per package";
  return "";
};

// Hook
export const usePackageValidation = () => {
  const [errors, setErrors] = useState<Record<FieldName, string>>({} as Record<FieldName, string>);
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({} as Record<FieldName, boolean>);

  const validateField = <F extends FieldName>(fieldName: F, value: FieldValue<F>): string => {
    let error = "";
    switch (fieldName) {
      case "packageName":
        error = validatePackageName(value as string);
        break;
      case "description":
        error = validateDescription(value as string);
        break;
      case "price":
        error = validatePrice(value as number);
        break;
      case "duration":
        error = validateDuration(value as number);
        break;
      case "destinationId":
        error = validateDestination(value as string);
        break;
      case "checkInTime":
        error = validateTime(value as string, "Check-in time");
        break;
      case "checkOutTime":
        error = validateTime(value as string, "Check-out time");
        break;
      case "itinerary":
        error = validateItinerary(value as ItineraryDay[]);
        break;
      case "images":
        error = validateImages(value as string[]);
        break;
      case "inclusions":
        error = validateInclusions(value as string[]);
        break;
      case "amenities":
        error = validateAmenities(value as string[]);
        break;
      case "selectedHotels":
        error = validateHotels(value as Hotel[]);
        break;
      case "selectedActivities":
        error = validateActivities(value as Activity[]);
        break;
    }
    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const validateAllFields = (formData: PackageFormData): boolean => {
    (Object.keys(formData) as FieldName[]).forEach(field => {
      validateField(field, formData[field]);
    });

    const allTouched: Record<FieldName, boolean> = {} as Record<FieldName, boolean>;
    (Object.keys(formData) as FieldName[]).forEach(field => (allTouched[field] = true));
    setTouched(allTouched);

    return !Object.values(errors).some(e => e !== "");
  };

  const markFieldTouched = (fieldName: FieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const resetValidation = () => {
    setErrors({} as Record<FieldName, string>);
    setTouched({} as Record<FieldName, boolean>);
  };

  const getFieldError = (fieldName: FieldName) => touched[fieldName] ? errors[fieldName] || "" : "";

  return { errors, touched, validateField, validateAllFields, markFieldTouched, resetValidation, getFieldError };
};
