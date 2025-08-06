import type * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
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
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { editProfile } from "@/services/vendor/vendorProfile"; 
import { updateVendor } from "@/store/slice/vendor/vendorSlice";

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

  const [name, setName] = useState(vendor?.name || "");
  const [email] = useState(vendor?.email || ""); // Keep email readonly
  const [phone, setPhone] = useState(vendor?.phone || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(vendor?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(vendor?.name || "");
    setPhone(vendor?.phone || "");
    setImagePreviewUrl(vendor?.profileImage || null);
  }, [vendor]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setImagePreviewUrl(vendor?.profileImage || null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!vendor || !vendor.id) {
      setError("Unable to update profile. Vendor ID not found.");
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
      console.log("Hhhsdhgs",updated)

      const updatedVendor = {
        ...vendor,
        name:updated.name ?? vendor.name,
        phone:updated.phone ?? vendor.phone,
        profileImage:updated.profileImage ?? vendor.profileImage,
        email:updated.email??updated.email ?? vendor.email,
        id:updated.id||vendor.id,
        documenturl:updated.documentUrl ?? vendor.documentUrl,
        status:updated.status??vendor.status,
        blocked:updated.isBlocked??vendor.isBlocked
        
    
      };
console.log("updated",updatedVendor)
      dispatch(updateVendor({ id: vendor.id, updatedData: updatedVendor }));
      onClose();
    } catch (error) {
      console.error("Error updating:", error);
      setError("Update failed");
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
            <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-300">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Vendor Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
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
