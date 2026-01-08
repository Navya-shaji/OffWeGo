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
    const currentValues = getValues();
    
    let location = currentValues.location;

    if (!location) {
      
      const locationInput = document.querySelector('input[name="location"]') as HTMLInputElement;
      if (locationInput) {
        location = locationInput.value;
      }
    }
    
  
    if (!location) {
      location = watch("location");
    }
    

    
    if (!location || (typeof location === 'string' && location.trim() === "")) {
      return;
    }

    setIsGettingCoordinates(true);

    try {

      const locationString = typeof location === 'string' ? location.trim() : String(location).trim();
      
      const { lat, lng } = await getCoordinatesFromPlace(locationString);
      
      if (lat && lng) {
        setValue("coordinates.lat", parseFloat(lat.toFixed(6)));
        setValue("coordinates.lng", parseFloat(lng.toFixed(6)));
        
      
        const updatedValues = getValues();
      } else {
        throw new Error("No coordinates returned");
      }
    } catch (error) {
      console.error("Could not fetch coordinates:", error);
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
      return;
    }

    try {
      if (!data.coordinates?.lat || !data.coordinates?.lng) {
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
      
      reset();
      setFiles([]);
      setImagePreviews([]);
      

      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      
    } catch (err) {
      console.error("Error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const debugFormFields = () => {
    const currentValues = getValues();

    
  
    const watchedLocation = watch("location");
  
    
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