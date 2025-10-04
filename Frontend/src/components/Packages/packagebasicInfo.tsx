import React from "react";
import { FileText, MapPin, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import type { DestinationInterface } from "@/interface/destinationInterface";
import type { PackageFormData } from "@/interface/packageFormData";
import type { Activity, Hotel } from "@/interface/PackageInterface";

interface PackageBasicInfoProps {
  formData: PackageFormData;
  destinations: DestinationInterface[];
  loadingDestinations: boolean;
  filteredHotels: Hotel[];
  filteredActivities: Activity[];
  selectedDestination: DestinationInterface | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDestinationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}



const PackageBasicInfo: React.FC<PackageBasicInfoProps> = ({
  formData,
  destinations,
  loadingDestinations,
  filteredHotels,
  filteredActivities,
  selectedDestination,
  onChange,
  onDestinationChange
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        Basic Information
      </h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="packageName" className="text-sm font-medium text-gray-700 mb-2 block">
            Package Name
          </Label>
          <Input
            id="packageName"
            name="packageName"
            type="text"
            placeholder="e.g., Goa Beach Paradise"
            value={formData.packageName}
            onChange={onChange}
            className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            required
          />
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
          <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-600" />
            Select Destination First
          </Label>
          
          {loadingDestinations ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-2">Loading destinations...</span>
            </div>
          ) : destinations.length === 0 ? (
            <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
              <p className="font-medium">No destinations found</p>
              <p className="text-sm mt-1">Please add destinations first or check your API connection</p>
            </div>
          ) : (
            <>
              <select
                id="destination"
                value={formData.destinationId}
                onChange={onDestinationChange}
                className="w-full h-12 px-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                required
              >
                <option value="" disabled>
                  Choose destination to see available hotels & activities...
                </option>
                {destinations.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name} - {dest.location}
                  </option>
                ))}
              </select>
              <p className="text-xs text-orange-600 mt-1">
                {destinations.length} destination(s) available
              </p>
            </>
          )}
          
          {selectedDestination && (
            <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-800">
                📍 Selected: {selectedDestination.name}
              </p>
              <p className="text-xs text-orange-700 mt-1">
                {selectedDestination.location} | 
                Hotels: {filteredHotels.length} | 
                Activities: {filteredActivities.length}
              </p>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe what makes this package special..."
            value={formData.description}
            onChange={onChange}
            className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-green-600">₹</span>
              Base Price
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="5000"
              value={formData.price}
              onChange={onChange}
              className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-600" />
              Duration (days)
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              placeholder="3"
              value={formData.duration}
              onChange={onChange}
              className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              min="1"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageBasicInfo;
