import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { DestinationFormData } from "@/Types/Admin/Destination/DestinationSchema";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import Cropper from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "../ImageCroping/cropUtils";
import type { Area } from "react-easy-crop";

interface Props {
  files: File[];
  register: UseFormRegister<DestinationFormData>;
  errors: FieldErrors<DestinationFormData>;
  imagePreviews: string[];
  imageError: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageError: () => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setImagePreviews: React.Dispatch<React.SetStateAction<string[]>>;
}

export const DestinationFormTwo = ({
  files,
 

  imagePreviews,
  imageError,

  handleImageError,
  setFiles,
  setImagePreviews,
}: Props) => {
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);


const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
  setCroppedAreaPixels(croppedAreaPixels);
};
  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsCropOpen(true);
  };

  const handleCropConfirm = async () => {
    if (!selectedFile || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(URL.createObjectURL(selectedFile), croppedAreaPixels);
    const croppedFile = new File([croppedBlob], selectedFile.name, { type: selectedFile.type });

    const previewUrl = URL.createObjectURL(croppedFile);
    setFiles([...files, croppedFile]);
    setImagePreviews([...imagePreviews, previewUrl]);

    setIsCropOpen(false);
    setSelectedFile(null);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...files];
    const updatedPreviews = [...imagePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="imageFile" className="font-serif text-lg tracking-wide">
          Upload Images
        </Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={handleImageInput}
        />
        {files.length === 0 && (
          <p className="text-red-500 text-sm">Please select at least one image</p>
        )}
      </div>

      <div>
        <Label className="font-serif text-lg tracking-wide">Image Previews</Label>
        {imagePreviews.length > 0 && !imageError ? (
          <div className="grid grid-cols-2 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <motion.img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-40 object-cover rounded border"
                  onError={handleImageError}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 border border-dashed rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-center">
            <div>
              <ImageIcon className="w-10 h-10 mx-auto" />
              {imageError
                ? "Some image(s) failed to load."
                : "Image previews will appear here."}
            </div>
          </div>
        )}
      </div>

      {/* Cropper Dialog */}
      <Dialog open={isCropOpen} onClose={() => setIsCropOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-xl h-[500px]">
            <Dialog.Title className="text-xl font-semibold mb-2">Crop Image</Dialog.Title>

            <div className="relative w-full h-[300px] bg-black">
              {selectedFile && (
                <Cropper
                  image={URL.createObjectURL(selectedFile)}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsCropOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropConfirm}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Confirm Crop
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
