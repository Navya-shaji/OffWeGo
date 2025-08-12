import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackage } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { Plus, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { usePackageData } from "./usepackagedata"; 
import PackageBasicInfo from "./packagebasicInfo";
import ImageUploadSection from "./ImageUploadSection";
import HotelsActivitiesSection from "./HotelActivitySection";
import PricingSidebar from "./Pricing";
import type { PackageFormData } from "@/interface/packageFormData";

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.package);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    allHotels,
    allActivities,
    destinations,
    loadingHotels,
    loadingActivities,
    loadingDestinations
  } = usePackageData();

  const [formData, setFormData] = useState<PackageFormData>({
    packageName: "",
    description: "",
    price: 0,
    duration: 1,
    selectedHotels: [],
    selectedActivities: [],
    images: [],
    destinationId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    }));
  };
  
  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      destinationId: e.target.value,
    }));
  };

  const calculateTotalPrice = () => {
    const hotelsCost = formData.selectedHotels.length * 2000 * formData.duration;
    const activitiesCost = formData.selectedActivities.length * 1500;
    return formData.price + hotelsCost + activitiesCost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedHotelDetails = allHotels.filter((hotel) =>
      formData.selectedHotels.includes(hotel.hotelId)
    );
    const selectedActivityDetails = allActivities.filter((activity) =>
      formData.selectedActivities.includes(activity.activityId)
    );

    const completePackage = {
      id: crypto.randomUUID(),
      destinationId: formData.destinationId,
      packageName: formData.packageName,
      description: formData.description,
      price: calculateTotalPrice(),
      duration: formData.duration,
      startDate: new Date(),
      endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
      images: formData.images,
      hotels: selectedHotelDetails,
      activities: selectedActivityDetails,
    };
    
    dispatch(addPackage(completePackage));
    setIsSubmitted(true);
    setFormData({
      packageName: "",
      description: "",
      price: 0,
      duration: 1,
      selectedHotels: [],
      selectedActivities: [],
      images: [],
      destinationId: "",
    });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const totalPrice = calculateTotalPrice();
  const selectedDestination = destinations.find(dest => dest.id === formData.destinationId);
  const isFormValid = formData.destinationId && formData.packageName.trim() && 
                      formData.description.trim() && formData.price > 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Travel Package
        </h1>
        <p className="text-gray-600 text-lg">
          Design amazing travel experiences for your customers
        </p>
      </div>

      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {isSubmitted && (
            <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
              <Plus className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                🎉 Package created successfully! Your customers will love this experience.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6 border-l-4 border-l-red-500">
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Forms */}
              <div className="xl:col-span-2 space-y-6">
                <PackageBasicInfo
                  formData={formData}
                  destinations={destinations}
                  loadingDestinations={loadingDestinations}
                  filteredHotels={allHotels}
                  filteredActivities={allActivities}
                  selectedDestination={selectedDestination}
                  onChange={handleChange}
                  onDestinationChange={handleDestinationChange}
                />

                <ImageUploadSection
                  images={formData.images}
                  onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                />

                <HotelsActivitiesSection
                  destinationId={formData.destinationId}
                  selectedDestination={selectedDestination}
                  filteredHotels={allHotels}
                  filteredActivities={allActivities}
                  selectedHotels={formData.selectedHotels}
                  selectedActivities={formData.selectedActivities}
                  loadingHotels={loadingHotels}
                  loadingActivities={loadingActivities}
                  duration={formData.duration}
                  onHotelSelection={(hotels) => setFormData(prev => ({ ...prev, selectedHotels: hotels }))}
                  onActivitySelection={(activities) => setFormData(prev => ({ ...prev, selectedActivities: activities }))}
                />
              </div>

              {/* Right Column - Pricing Sidebar */}
              <PricingSidebar
                formData={formData}
                selectedDestination={selectedDestination}
                totalPrice={totalPrice}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                size="lg"
                className="w-full max-w-md h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Package...
                  </>
                ) : !formData.destinationId ? (
                  <>
                    <MapPin className="h-5 w-5 mr-3" />
                    Select Destination First
                  </>
                ) : !formData.packageName.trim() ? (
                  <>
                    <FileText className="h-5 w-5 mr-3" />
                    Enter Package Name
                  </>
                ) : !formData.description.trim() ? (
                  <>
                    <FileText className="h-5 w-5 mr-3" />
                    Add Description
                  </>
                ) : formData.price <= 0 ? (
                  <>
                    <span className="mr-3">₹</span>
                    Set Base Price
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-3" />
                    Create Package - ₹{totalPrice.toLocaleString()}
                  </>
                )}
              </Button>
            </div>

            {/* Form Validation Messages */}
            {!isFormValid && (
              <div className="text-center">
                <div className="inline-flex items-start text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  <div className="flex-shrink-0 mr-2">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Please complete the following:</p>
                    <ul className="mt-1 space-y-1">
                      {!formData.destinationId && <li>• Select a destination</li>}
                      {!formData.packageName.trim() && <li>• Enter package name</li>}
                      {!formData.description.trim() && <li>• Add package description</li>}
                      {formData.price <= 0 && <li>• Set a base price greater than 0</li>}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Data Status Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className={`flex items-center ${destinations.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${destinations.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {destinations.length} Destinations
            </span>
            <span className={`flex items-center ${allHotels.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${allHotels.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {allHotels.length} Hotels
            </span>
            <span className={`flex items-center ${allActivities.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${allActivities.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {allActivities.length} Activities
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {(loadingDestinations || loadingHotels || loadingActivities) ? 'Loading data...' : 'All data loaded'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
