import React from "react";
import { Building, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import type { DestinationInterface } from "@/interface/destinationInterface";
import type { Activity, Hotel } from "@/interface/PackageInterface";

interface HotelsActivitiesSectionProps {
  destinationId: string;
  selectedDestination: DestinationInterface | undefined;
  filteredHotels: Hotel[];
  filteredActivities: Activity[];
  selectedHotels: string[];
  selectedActivities: string[];
  loadingHotels: boolean;
  loadingActivities: boolean;
  duration: number;
  onHotelSelection: (hotels: string[]) => void;
  onActivitySelection: (activities: string[]) => void;
}

const HotelsActivitiesSection: React.FC<HotelsActivitiesSectionProps> = ({
  destinationId,
  selectedDestination,
  filteredHotels,
  filteredActivities,
  selectedHotels,
  selectedActivities,
  loadingHotels,
  loadingActivities,
  duration,
  onHotelSelection,
  onActivitySelection,
}) => {
const hotelOptions = filteredHotels
  .filter((hotel) => hotel.destinationId === destinationId)
  .map((hotel) => ({
    value: hotel.hotelId, 
    label: `${hotel.name} - ${hotel.address} (${hotel.rating}⭐)`,
    data: hotel,
  }));
  const activityOptions = filteredActivities.filter((activity)=>activity.destinationId===destinationId)
  .map((activity) => ({
    value: activity.id ?? "",
    label: `${activity.title} - ${activity.description.slice(0, 50)}...`,
    data: activity,
  }));

  if (!destinationId) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 text-center">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Select a Destination First
        </h3>
        <p className="text-gray-500">
          Choose a destination above to see available hotels and activities
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Hotels & Activities for {selectedDestination?.name}
      </h3>

      <div className="space-y-6">
        {/* Hotels Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Building className="h-4 w-4 text-green-600" />
            Select Hotels ({filteredHotels.length} available)
          </Label>

          {loadingHotels ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span className="ml-2">Loading hotels...</span>
            </div>
          ) : filteredHotels.length > 0 ? (
            <MultiSelect
              options={hotelOptions}
              selected={hotelOptions.filter((opt) =>
                selectedHotels.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                onHotelSelection(selectedOptions.map((opt) => opt.value))
              }
              placeholder="Choose hotels for this destination..."
            />
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No hotels available for this destination</p>
              <p className="text-xs mt-1">
                Add hotels for {selectedDestination?.name} first
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Selected {selectedHotels.length} hotel(s)
            {selectedHotels.length > 0 &&
              ` (₹${(selectedHotels.length * 2000 * duration).toLocaleString()} for ${duration} nights)`}
          </p>
        </div>

        {/* Activities Section */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            Select Activities ({filteredActivities.length} available)
          </Label>

          {loadingActivities ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2">Loading activities...</span>
            </div>
          ) : filteredActivities.length > 0 ? (
            <MultiSelect
              options={activityOptions}
              selected={activityOptions.filter((opt) =>
                selectedActivities.includes(opt.value)
              )}
              onChange={(selectedOptions) =>
                onActivitySelection(selectedOptions.map((opt) => opt.value))
              }
              placeholder="Choose activities for this destination..."
            />
          ) : (
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No activities available for this destination</p>
              <p className="text-xs mt-1">
                Add activities for {selectedDestination?.name} first
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1">
            Selected {selectedActivities.length} activity(ies)
            {selectedActivities.length > 0 &&
              ` (₹${(selectedActivities.length * 1500).toLocaleString()})`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HotelsActivitiesSection;
