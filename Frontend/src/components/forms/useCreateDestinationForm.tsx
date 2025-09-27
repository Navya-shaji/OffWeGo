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

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setValue("coordinates.lat", lat);
        setValue("coordinates.lng", lng);

        try {
          const place = await getLocationFromCoordinates(lat, lng);
          setValue("location", place);
        } catch (err) {
          console.error("Could not get location name:", err);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your current location.");
      }
    );
  };

  const handleCoordinatesFromLocation = async () => {
    const location = watch("location");
    if (!location) {
      alert("Please enter a location name first.");
      return;
    }

    try {
      const { lat, lng } = await getCoordinatesFromPlace(location);
      setValue("coordinates.lat", lat);
      setValue("coordinates.lng", lng);
    } catch (error) {
      console.error("Could not fetch coordinates:", error);
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
    } catch (err) {
      console.error("Error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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
    submitStatus,
    handleFileChange,
    handleImageError,
    handleCoordinatesFromLocation,
    getCurrentLocation,
    onSubmit,
    watch,
  };
};
