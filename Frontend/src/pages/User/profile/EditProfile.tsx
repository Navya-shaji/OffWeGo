import type * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { updateUserProfile } from "@/store/slice/user/authSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { editProfile } from "@/services/user/Userprofile";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { toast } from "react-toastify";

import { usernameSchema, phoneSchema, profileEditSchema } from '@/Types/User/Profile/profileZodeSchema'
import z from "zod/v3";

const notify = () => toast("Profile updated!");

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorPhone, setErrorPhone] = useState<string | null>(null);
  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setImagePreviewUrl(user.imageUrl || null);
      // Reset errors when user data is loaded
      setErrorUsername(null);
      setErrorPhone(null);
      setErrorImage(null);
      setGeneralError(null);
    }
  }, [user, isOpen]);

  // Reset errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrorUsername(null);
      setErrorPhone(null);
      setErrorImage(null);
      setGeneralError(null);
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setErrorImage(null);
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorImage("Image size must be less than 5MB");
        event.target.value = ""; // Clear the input
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorImage("File must be an image (JPG, PNG, GIF, or WebP)");
        event.target.value = ""; // Clear the input
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.onerror = () => {
        setErrorImage("Failed to load image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    // Validate in real-time - show error immediately if empty
    const trimmed = value.trim();
    
    if (trimmed.length === 0) {
      setErrorUsername("Name is required and cannot be empty");
    } else if (trimmed.length < 2) {
      setErrorUsername("Name must be at least 2 characters");
    } else if (trimmed.length > 50) {
      setErrorUsername("Name must not exceed 50 characters");
    } else if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      setErrorUsername("Name can only contain letters, spaces, hyphens, and apostrophes");
    } else {
      // Validate with schema for final check
      const result = usernameSchema.safeParse(value);
      if (!result.success) {
        setErrorUsername(result.error.errors[0]?.message || "Invalid username");
      } else {
        setErrorUsername(null);
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits
    const digitsOnly = value.replace(/\D/g, '');
    setPhone(digitsOnly);
    
    // Validate in real-time - phone is required
    if (digitsOnly.length === 0) {
      setErrorPhone("Phone number is required");
    } else if (digitsOnly.length < 10) {
      setErrorPhone("Phone number must be exactly 10 digits");
    } else if (digitsOnly.length > 10) {
      setErrorPhone("Phone number must be exactly 10 digits");
    } else {
      // Validate with schema for final check
      const result = phoneSchema.safeParse(digitsOnly);
      if (!result.success) {
        setErrorPhone(result.error.errors[0]?.message || "Invalid phone number");
      } else {
        setErrorPhone(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneralError(null);
    setErrorUsername(null);
    setErrorPhone(null);
    setErrorImage(null);

    if (!user?.id) {
      setGeneralError("User ID is missing");
      setIsLoading(false);
      return;
    }

    // Validate image file if selected
    if (selectedFile) {
      try {
        // Check file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
          setErrorImage("Image size must be less than 5MB");
          setIsLoading(false);
          return;
        }
        // Check file type
        if (!selectedFile.type.startsWith("image/")) {
          setErrorImage("File must be an image (JPG, PNG, GIF, or WebP)");
          setIsLoading(false);
          return;
        }
      } catch (error) {
        setErrorImage("Invalid image file");
        setIsLoading(false);
        return;
      }
    }

    // Validate username
    const usernameValidation = usernameSchema.safeParse(username);
    if (!usernameValidation.success) {
      setErrorUsername(usernameValidation.error.errors[0]?.message || "Invalid username");
      setIsLoading(false);
      return;
    }

    // Validate phone (required, must be valid)
    const phoneValidation = phoneSchema.safeParse(phone);
    if (!phoneValidation.success) {
      setErrorPhone(phoneValidation.error.errors[0]?.message || "Invalid phone number");
      setIsLoading(false);
      return;
    }

    // Validate entire form using the comprehensive schema
    const formData = {
      name: username.trim(),
      phone: phone.trim() === "" ? undefined : phone.trim(),
      imageUrl: user.imageUrl || "",
    };
    
    const formValidation = profileEditSchema.safeParse(formData);
    if (!formValidation.success) {
      const firstError = formValidation.error.errors[0];
      if (firstError.path.includes("name")) {
        setErrorUsername(firstError.message);
      } else if (firstError.path.includes("phone")) {
        setErrorPhone(firstError.message);
      } else {
        setGeneralError(firstError.message);
      }
      setIsLoading(false);
      return;
    }

    try {
      let newImageUrl = user.imageUrl;
      if (selectedFile) {
        newImageUrl = await uploadToCloudinary(selectedFile);
      }

      const updated = await editProfile({
        name: username.trim(),
        phone: phone.trim(), // Phone is required, always send trimmed value
        imageUrl: newImageUrl,
      });

      notify();
      dispatch(updateUserProfile(updated.data));
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {

        const firstError = err.errors[0];
        if (firstError.path.includes("name")) setErrorUsername(firstError.message);
        else if (firstError.path.includes("phone")) setErrorPhone(firstError.message);
        else setGeneralError(firstError.message);
      } else {
        console.error("Error updating profile:", err);
        setGeneralError("Update failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  {user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Profile Picture</Label>
              <Input
                id="picture"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isLoading}
              />
              {errorImage && (
                <p className="text-red-500 text-sm">{errorImage}</p>
              )}
              <p className="text-xs text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3 flex flex-col">
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                disabled={isLoading}
              />
              {errorUsername && (
                <p className="text-red-500 text-sm">{errorUsername}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone <span className="text-red-500">*</span>
            </Label>
            <div className="col-span-3 flex flex-col">
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={isLoading}
                maxLength={10}
                placeholder="Enter 10-digit phone number"
              />
              {errorPhone && (
                <p className="text-red-500 text-sm">{errorPhone}</p>
              )}
            </div>
          </div>

          {generalError && <p className="text-red-500 text-sm text-center">{generalError}</p>}

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading || errorUsername != null || errorPhone != null || errorImage != null}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
