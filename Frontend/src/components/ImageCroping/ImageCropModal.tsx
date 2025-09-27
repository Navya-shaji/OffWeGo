import Cropper, { type Area } from 'react-easy-crop';
import { useState, useCallback } from 'react';
import  getCroppedImg  from './cropUtils'; 
import { Dialog } from '@headlessui/react';

interface CropModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
}

export const ImageCropModal = ({ image, onClose, onCropComplete }: CropModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

const onCropCompleteLocal = useCallback(
  (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  },
  []
);

const handleCrop = async () => {
  const croppedBlob = await getCroppedImg(image, croppedAreaPixels!);
  
  const croppedFile = new File([croppedBlob], "cropped_image.png", {
    type: croppedBlob.type,
    lastModified: Date.now(),
  });

  onCropComplete(croppedFile);
  onClose();
};


  return (
    <Dialog open onClose={onClose} className="fixed z-50 inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md w-full max-w-lg h-[80vh] relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteLocal}
        />
        <div className="mt-4 flex justify-end gap-4">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-black text-white px-4 py-2 rounded" onClick={handleCrop}>Crop</button>
        </div>
      </div>
    </Dialog>
  );
};
