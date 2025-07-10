import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { DestinationFormData } from "@/Types/Admin/Destination/DestinationSchema";

interface Props {
  register: UseFormRegister<DestinationFormData>;
  errors: FieldErrors<DestinationFormData>;
  getCurrentLocation: () => void;
  handleCoordinatesFromLocation: () => void;
}

export const DestinationFormOne = ({
  register,
  errors,
  getCurrentLocation,
  handleCoordinatesFromLocation,
}: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="font-serif text-lg tracking-wide">
          Destination Name
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., Santorini, Greece"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="font-serif text-lg tracking-wide">
          Location{" "}
        </Label>
        <div className="flex gap-2">
          <Input
            id="location"
            {...register("location")}
            placeholder="e.g., Cyclades, Greece"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleCoordinatesFromLocation}
            className="bg-black text-white hover:bg-white hover:text-black border border-black transition-all duration-300 px-4 py-2 rounded-md font-mono tracking-wide"
          >
            Get Coordinates
          </Button>
        </div>
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-0.5">
          <Label className="font-serif text-lg tracking-wide">
            Coordinates
          </Label>
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              size="sm"
              onClick={getCurrentLocation}
              className="bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-mono px-2 py-1 rounded tracking-tight text-xs"
            >
              📍 Use My Location
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleCoordinatesFromLocation}
              className="bg-white text-black border border-black hover:bg-black hover:text-white transition-all duration-300 font-mono px-2 py-1 rounded tracking-tight text-xs"
            >
              📌 From Location
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="lat" className="font-serif text-lg tracking-wide">Latitude</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              {...register("coordinates.lat", { valueAsNumber: true })}
            />
            {errors.coordinates?.lat && (
              <p className="text-red-500 text-sm">
                {errors.coordinates.lat.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lng" className="font-serif text-lg tracking-wide">Longitude</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              {...register("coordinates.lng", { valueAsNumber: true })}
            />
            {errors.coordinates?.lng && (
              <p className="text-red-500 text-sm">
                {errors.coordinates.lng.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="font-serif text-lg tracking-wide">Description </Label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Why is this destination special?"
          className="w-full h-32 border px-3 py-2 rounded"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
};
