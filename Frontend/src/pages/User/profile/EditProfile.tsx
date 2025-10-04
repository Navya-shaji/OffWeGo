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

// Import validation schemas
import { usernameSchema, phoneSchema } from '@/Types/User/Profile/profileZodeSchema'
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
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setImagePreviewUrl(user.imageUrl || null);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    const result = usernameSchema.safeParse(value);
    setErrorUsername(result.success ? null : result.error.message);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    const result = phoneSchema.safeParse(value);
    setErrorPhone(result.success ? null : result.error.message);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    if (!user?.id) {
      setGeneralError("User ID is missing");
      setIsLoading(false);
      return;
    }

    try {
    

      let newImageUrl = user.imageUrl;
      if (selectedFile) {
        newImageUrl = await uploadToCloudinary(selectedFile);
      }

      const updated = await editProfile(user.id, {
        name: username,
        phone: phone,
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
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
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
              Phone
            </Label>
            <div className="col-span-3 flex flex-col">
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                disabled={isLoading}
              />
              {errorPhone && (
                <p className="text-red-500 text-sm">{errorPhone}</p>
              )}
            </div>
          </div>

          {generalError && <p className="text-red-500 text-sm text-center">{generalError}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isLoading || errorUsername != null || errorPhone != null}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
