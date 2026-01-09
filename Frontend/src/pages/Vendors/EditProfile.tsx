import type * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { z } from "zod";
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
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { editProfile } from "@/services/vendor/vendorProfile";
import { login } from "@/store/slice/vendor/authSlice";
import { vendorEditSchema } from "@/store/slice/vendor/ProfilezodSchema";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditVendorProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const dispatch = useDispatch();
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const token = useSelector((state: RootState) => state.vendorAuth.token);

  const [name, setName] = useState(vendor?.name || "");
  const [email] = useState(vendor?.email || "");
  const [phone, setPhone] = useState(vendor?.phone || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    vendor?.profileImage || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (vendor) {
      setName(vendor.name || "");
      setPhone(vendor.phone || "");
      setImagePreviewUrl(vendor.profileImage || null);
    }
  }, [vendor]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!vendor?.id) {
      setError("Vendor ID missing");
      setIsLoading(false);
      return;
    }

    try {
      vendorEditSchema.parse({ name, phone: phone.toString() });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.message);
      }
      setIsLoading(false);
      return;
    }

    try {
      let newImageUrl = vendor.profileImage;

      if (selectedFile) {
        newImageUrl = await uploadToCloudinary(selectedFile);
      }

      const updated = await editProfile(vendor.id, {
        name,
        phone,
        profileImage: newImageUrl,
      });

      const mappedVendor = {
        ...updated.data,
        profileImage: updated.data.profileImage || "/placeholder-avatar.png",
        documentUrl: vendor.documentUrl,
      };
     
      dispatch(
        login({
          vendor: mappedVendor,
          token: token || "",
          refreshToken: "",
        })
      );

      setImagePreviewUrl(mappedVendor.profileImage);

      onClose();
    } catch (err) {
      console.error("Error updating:", err);
      setError("Update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vendor Profile</DialogTitle>
          <DialogDescription>
            Make changes to your vendor profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}

              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Vendor Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xl font-bold">
                  {vendor?.name?.charAt(0).toUpperCase() || "V"}
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
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
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
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
