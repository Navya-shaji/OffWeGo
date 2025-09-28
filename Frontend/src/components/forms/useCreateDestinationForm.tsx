import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { destinationSchema } from "@/Types/Admin/Destination/DestinationSchema";
import type { DestinationFormData } from "@/Types/Admin/Destination/DestinationSchema";
import {
  getCoordinatesFromPlace,
  getLocationFromCoordinates,
} from "@/services/Location/locationService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { useAppDispatch } from "@/hooks";
import { addDestination } from "@/store/slice/Destination/destinationSlice";

export const useCreateDestinationForm = () => {
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationSchema),
    mode: "onChange",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const updatedFiles = [...files, ...selectedFiles];
    const updatedPreviews = [
      ...imagePreviews,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ];

    setFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Set coordinates with proper precision
          setValue("coordinates.lat", parseFloat(lat.toFixed(6)));
          setValue("coordinates.lng", parseFloat(lng.toFixed(6)));

          // Get location name from coordinates
          const place = await getLocationFromCoordinates(lat, lng);
          if (place) {
            setValue("location", place);
          }
        } catch (err) {
          console.error("Could not get location name:", err);
          alert("Got coordinates but couldn't determine location name.");
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to get your current location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access denied.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Unknown error occurred.";
            break;
        }
        alert(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCoordinatesFromLocation = async () => {
    // Debug: Log all current form values to see the structure
    const currentValues = getValues();
    console.log("All form values:", currentValues);
    
    // Try to get location from multiple sources
    let location = currentValues.location;
    
    // If still undefined, try to get it directly from the DOM
    if (!location) {
      // Try to find the location input field by various selectors
      const locationInput = document.querySelector('input[name="location"]') as HTMLInputElement;
      if (locationInput) {
        location = locationInput.value;
        console.log("Got location from DOM:", location);
      }
    }
    
    // Also try using watch as a fallback
    if (!location) {
      location = watch("location");
    }
    
    console.log("Current location value:", location);
    console.log("Location field type:", typeof location);
    
    if (!location || (typeof location === 'string' && location.trim() === "")) {
      alert("Please enter a location name first. Make sure the location field is filled out.");
      return;
    }

    setIsGettingCoordinates(true);

    try {
      // Ensure location is a string
      const locationString = typeof location === 'string' ? location.trim() : String(location).trim();
      console.log("Processing location:", locationString);
      
      const { lat, lng } = await getCoordinatesFromPlace(locationString);
      
      if (lat && lng) {
        setValue("coordinates.lat", parseFloat(lat.toFixed(6)));
        setValue("coordinates.lng", parseFloat(lng.toFixed(6)));
        console.log("Coordinates set:", { lat, lng });
        
        // Force a form update
        const updatedValues = getValues();
        console.log("Updated form values:", updatedValues);
      } else {
        throw new Error("No coordinates returned");
      }
    } catch (error) {
      console.error("Could not fetch coordinates:", error);
      alert("Could not find coordinates for this location. Please try a different location name or check the spelling.");
    } finally {
      setIsGettingCoordinates(false);
    }
  };

  const onSubmit = async (data: DestinationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    if (files.length === 0) {
      setImageError(true);
      setIsSubmitting(false);
      alert("Please upload at least one image.");
      return;
    }

    try {
      // Validate coordinates exist
      if (!data.coordinates?.lat || !data.coordinates?.lng) {
        alert("Please provide valid coordinates for the destination.");
        setIsSubmitting(false);
        return;
      }

      const imageUrls: string[] = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }

      const fullData = {
        id: Date.now().toString(),
        ...data,
        name: data.name,
        imageUrls,
      };

      destinationSchema.parse(fullData);

      await dispatch(addDestination(fullData)).unwrap();
      setSubmitStatus("success");
      
      // Reset form after successful submission
      reset();
      setFiles([]);
      setImagePreviews([]);
      
      // Clean up image previews
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
    } catch (err) {
      console.error("Error:", err);
      setSubmitStatus("error");
      alert("Failed to add destination. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug function to help identify field names
  const debugFormFields = () => {
    const currentValues = getValues();
    console.log("=== FORM DEBUG ===");
    console.log("All form values:", currentValues);
    console.log("Available keys:", Object.keys(currentValues));
    console.log("==================");
    
    // Also check what's being watched
    const watchedLocation = watch("location");
    console.log("Watched location:", watchedLocation);
    
    return currentValues;
  };

  return {
    register,
    handleSubmit,
    errors,
    isValid,
    files,
    setFiles,
    imagePreviews,
    setImagePreviews,
    imageError,
    isSubmitting,
    isGettingLocation,
    isGettingCoordinates,
    submitStatus,
    handleFileChange,
    handleImageError,
    handleCoordinatesFromLocation,
    getCurrentLocation,
    onSubmit,
    watch,
    getValues,
    debugFormFields, // Add this for debugging
  };
};