
import { useState } from "react";

export const validatePackageName = (name: string): string => {
  if (!name.trim()) return "Package name is required";
  if (name.trim().length < 3) return "Package name must be at least 3 characters";
  if (name.trim().length > 100) return "Package name must not exceed 100 characters";
  return "";
};

export const validateDescription = (description: string): string => {
  if (!description.trim()) return "Description is required";
  if (description.trim().length < 20) return "Description must be at least 20 characters";
  if (description.trim().length > 1000) return "Description must not exceed 1000 characters";
  return "";
};

export const validatePrice = (price: number): string => {
  if (price <= 0) return "Price must be greater than 0";
  if (price < 100) return "Price seems too low (minimum ₹100)";
  if (price > 1000000) return "Price seems too high (maximum ₹10,00,000)";
  return "";
};

export const validateDuration = (duration: number): string => {
  if (duration < 1) return "Duration must be at least 1 day";
  if (duration > 30) return "Duration cannot exceed 30 days";
  return "";
};

export const validateDestination = (destinationId: string): string => {
  if (!destinationId) return "Please select a destination";
  return "";
};

export const validateTime = (time: string, label: string): string => {
  if (!time.trim()) return `${label} is required`;
  
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)$/;
  if (!timeRegex.test(time.trim())) {
    return `${label} must be in format "HH:MM AM/PM" (e.g., "3:00 PM")`;
  }
  return "";
};

export const validateItinerary = (itinerary:any[]): string => {
  if (itinerary.length === 0) return "Please add at least one day to the itinerary";
  
  for (let i = 0; i < itinerary.length; i++) {
    const day = itinerary[i];
    if (day.activities.length === 0) {
      return `Day ${day.day} must have at least one activity`;
    }
    
    for (let j = 0; j < day.activities.length; j++) {
      const activity = day.activities[j];
      if (!activity.time.trim()) {
        return `Day ${day.day}, Activity ${j + 1}: Time is required`;
      }
      if (!activity.activity.trim()) {
        return `Day ${day.day}, Activity ${j + 1}: Activity description is required`;
      }
      if (activity.activity.trim().length < 3) {
        return `Day ${day.day}, Activity ${j + 1}: Activity description must be at least 3 characters`;
      }
    }
  }
  return "";
};

export const validateImages = (images: string[]): string => {
  if (images.length === 0) return "Please upload at least one image";
  if (images.length > 10) return "Maximum 10 images allowed";
  return "";
};

export const validateInclusions = (inclusions: string[]): string => {
  if (inclusions.length === 0) return "Please add at least one inclusion";
  const emptyInclusions = inclusions.filter(inc => !inc.trim());
  if (emptyInclusions.length > 0) return "Remove empty inclusions";
  return "";
};

export const validateAmenities = (amenities: string[]): string => {
  if (amenities.length === 0) return "Please add at least one amenity";
  const emptyAmenities = amenities.filter(am => !am.trim());
  if (emptyAmenities.length > 0) return "Remove empty amenities";
  return "";
};

export const validateHotels = (hotels: string[]): string => {
  if (hotels.length === 0) return "Please select at least one hotel";
  if (hotels.length > 5) return "Maximum 5 hotels allowed per package";
  return "";
};

export const validateActivities = (activities: string[]): string => {
  if (activities.length === 0) return "Please select at least one activity";
  if (activities.length > 15) return "Maximum 15 activities allowed per package";
  return "";
};

export const usePackageValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value): string => {
    let error = "";

    switch (fieldName) {
      case "packageName":
        error = validatePackageName(value);
        break;
      case "description":
        error = validateDescription(value);
        break;
      case "price":
        error = validatePrice(value);
        break;
      case "duration":
        error = validateDuration(value);
        break;
      case "destinationId":
        error = validateDestination(value);
        break;
      case "checkInTime":
        error = validateTime(value, "Check-in time");
        break;
      case "checkOutTime":
        error = validateTime(value, "Check-out time");
        break;
      case "itinerary":
        error = validateItinerary(value);
        break;
      case "images":
        error = validateImages(value);
        break;
      case "inclusions":
        error = validateInclusions(value);
        break;
      case "amenities":
        error = validateAmenities(value);
        break;
      case "selectedHotels":
        error = validateHotels(value);
        break;
      case "selectedActivities":
        error = validateActivities(value);
        break;
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const validateAllFields = (formData): boolean => {
    const newErrors: Record<string, string> = {};

    newErrors.destinationId = validateDestination(formData.destinationId);
    newErrors.packageName = validatePackageName(formData.packageName);
    newErrors.description = validateDescription(formData.description);
    newErrors.price = validatePrice(formData.price);
    newErrors.duration = validateDuration(formData.duration);
    newErrors.checkInTime = validateTime(formData.checkInTime, "Check-in time");
    newErrors.checkOutTime = validateTime(formData.checkOutTime, "Check-out time");
    newErrors.itinerary = validateItinerary(formData.itinerary);
    newErrors.images = validateImages(formData.images);
    newErrors.inclusions = validateInclusions(formData.inclusions);
    newErrors.amenities = validateAmenities(formData.amenities);
    newErrors.selectedHotels = validateHotels(formData.selectedHotels);
    newErrors.selectedActivities = validateActivities(formData.selectedActivities);

    setErrors(newErrors);

    const allTouched: Record<string, boolean> = {};
    Object.keys(newErrors).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    return !Object.values(newErrors).some(error => error !== "");
  };

  const markFieldTouched = (fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const resetValidation = () => {
    setErrors({});
    setTouched({});
  };

  const getFieldError = (fieldName: string): string => {
    return touched[fieldName] ? errors[fieldName] || "" : "";
  };

  return {
    errors,
    touched,
    validateField,
    validateAllFields,
    markFieldTouched,
    resetValidation,
    getFieldError,
  };
};