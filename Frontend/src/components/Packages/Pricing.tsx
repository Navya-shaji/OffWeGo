import React from "react";
import type { DestinationInterface } from "@/interface/destinationInterface";
import type { PackageFormData } from "@/interface/packageFormData";

interface PricingSidebarProps {
  formData: PackageFormData;
  selectedDestination: DestinationInterface | undefined;
  totalPrice: number;
}

const PricingSidebar: React.FC<PricingSidebarProps> = ({
  formData,
  selectedDestination,
  totalPrice
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="h-5 w-5 bg-yellow-600 rounded-full" />
          Price Breakdown
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-yellow-200">
            <span className="text-sm text-gray-600">Base Price:</span>
            <span className="font-medium">₹{formData.price.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-yellow-200">
            <span className="text-sm text-gray-600">
              Hotels ({formData.duration} nights):
            </span>
            <span className="font-medium">
              ₹{(formData.selectedHotels.length * 2000 * formData.duration).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-yellow-200">
            <span className="text-sm text-gray-600">Activities:</span>
            <span className="font-medium">
              ₹{(formData.selectedActivities.length * 1500).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-100 to-emerald-100 px-4 rounded-lg border border-green-200">
            <span className="font-semibold text-green-800">Total Price:</span>
            <span className="text-xl font-bold text-green-800">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{formData.duration}</div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {formData.selectedHotels.length + formData.selectedActivities.length}
            </div>
            <div className="text-xs text-gray-500">Items</div>
          </div>
        </div>

        {selectedDestination && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-800">
              📍 {selectedDestination.name}
            </p>
            <p className="text-xs text-blue-600">{selectedDestination.location}</p>
          </div>
        )}

        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Package Summary</h4>
          <div className="space-y-1 text-xs text-gray-600">
            <p>• {formData.packageName || "Unnamed Package"}</p>
            <p>• {formData.duration} days duration</p>
            <p>• {formData.selectedHotels.length} hotel(s) selected</p>
            <p>• {formData.selectedActivities.length} activity(ies) selected</p>
            <p>• {formData.images.length} image(s) uploaded</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSidebar;