import type React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackage } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePackageData } from "./usepackagedata";
import PackageBasicInfo from "./packagebasicInfo";
import ImageUploadSection from "./ImageUploadSection";
import HotelsActivitiesSection from "./HotelActivitySection";
import { usePackageValidation } from "@/Types/vendor/Package/package";
import type { Package } from "@/interface/PackageInterface";
import { toast } from "react-toastify";


interface ItineraryActivity {
  time: string;
  activity: string;
}

interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
  isExpanded?: boolean;
}

interface Hotel {
  hotelId: string;
  id?: string;
  name: string;
  address: string;
  rating: number;
  destinationId: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  destinationId?: string;
}

interface EnhancedPackageFormData {
  packageName: string;
  description: string;
  price: number; 
  duration: number;
  selectedHotels: Hotel[];
  selectedActivities: Activity[];
  images: string[];
  destinationId: string;
  checkInTime: string;
  checkOutTime: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  amenities: string[];
  flightOption: boolean; 
  flightPrice?: number; 
}

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  
  const packages = useSelector((state: RootState) => state.package.packages);

  const [isSubmitted, setIsSubmitted] = useState(false);

    const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [packageLimitError, setPackageLimitError] = useState<boolean>(false);
    const { loading, error } = useSelector((state: RootState) => state.package);
    console.log(packageLimitError)

  const {
    errors,
    touched,
    validateField,
   
    markFieldTouched,
    resetValidation,
    getFieldError,
  } = usePackageValidation();

  const {
    allHotels,
    allActivities,
    destinations,
    loadingHotels,
    loadingActivities,
    loadingDestinations,
  } = usePackageData();

  const [formData, setFormData] = useState<EnhancedPackageFormData>({
    packageName: "",
    description: "",
    price: 0, 
    duration: 1,
    selectedHotels: [],
    selectedActivities: [],
    images: [],
    destinationId: "",
    checkInTime: "",
    checkOutTime: "",
    itinerary: [],
    inclusions: [],
    amenities: [],
    flightOption: false,
    flightPrice: 0, 
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const numericFields = new Set(["price", "duration", "flightPrice"]);
    const newValue = numericFields.has(name) ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue as any,
    }));
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      destinationId: newValue,
      selectedHotels: [],
      selectedActivities: [],
    }));
    

    markFieldTouched("destinationId");
    validateField("destinationId", newValue);
  };

const handleHotelSelection = (hotelIds: string[]) => {
  const selectedHotelObjects = allHotels
    .filter((hotel) => hotelIds.includes(hotel.hotelId || hotel.id || ""))
    .map((hotel) => ({
      ...hotel,
      hotelId: hotel.hotelId || hotel.id || "", 
    }));

  setFormData((prev) => ({
    ...prev,
    selectedHotels: selectedHotelObjects,
  }));
};


const handleActivitySelection = (activityIds: string[]) => {
  const selectedActivityObjects = allActivities
    .filter((activity) => activityIds.includes(activity.id || ""))
    .map((activity) => ({
      ...activity,
      id: activity.id || "", 
    }));

  setFormData((prev) => ({
    ...prev,
    selectedActivities: selectedActivityObjects,
  }));


};


  const addDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      activities: [{ time: "", activity: "" }],
      isExpanded: true,
    };
    const newItinerary = [...formData.itinerary, newDay];
    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));

    if (touched.itinerary) {
      validateField("itinerary", newItinerary);
    }
  };

  const removeDay = (dayIndex: number) => {
    const newItinerary = formData.itinerary
      .filter((_, index) => index !== dayIndex)
      .map((day, index) => ({ ...day, day: index + 1 }));

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));

    if (touched.itinerary) {
      validateField("itinerary", newItinerary);
    }
  };

  const toggleDayExpansion = (dayIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, isExpanded: !day.isExpanded } : day
      ),
    }));
  };

  const addActivityToDay = (dayIndex: number) => {
    const newItinerary = formData.itinerary.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            activities: [...day.activities, { time: "", activity: "" }],
          }
        : day
    );

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));

    if (touched.itinerary) {
      validateField("itinerary", newItinerary);
    }
  };

  const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
    const newItinerary = formData.itinerary.map((day, index) =>
      index === dayIndex
        ? {
            ...day,
            activities: day.activities.filter(
              (_, aIndex) => aIndex !== activityIndex
            ),
          }
        : day
    );

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));

    if (touched.itinerary) {
      validateField("itinerary", newItinerary);
    }
  };

  const updateActivity = (
    dayIndex: number,
    activityIndex: number,
    field: "time" | "activity",
    value: string
  ) => {
    const newItinerary = formData.itinerary.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
            ...day,
            activities: day.activities.map((activity, aIndex) =>
              aIndex === activityIndex
                ? { ...activity, [field]: value }
                : activity
            ),
          }
        : day
    );

    setFormData((prev) => ({
      ...prev,
      itinerary: newItinerary,
    }));

    if (touched.itinerary) {
      validateField("itinerary", newItinerary);
    }
  };

  const generateBasicItinerary = () => {
    const basicItinerary: ItineraryDay[] = [];

    for (let i = 1; i <= formData.duration; i++) {
      let dayActivities: ItineraryActivity[] = [];

      if (i === 1) {
        dayActivities = [
          {
            time: formData.checkInTime || "3:00 PM",
            activity: "Check-in at hotel",
          },
          { time: "4:00 PM", activity: "Welcome drink" },
          { time: "5:00 PM", activity: "Local area exploration" },
          { time: "7:00 PM", activity: "Evening tea & snacks" },
          { time: "8:00 PM", activity: "Dinner" },
        ];
      } else if (i === formData.duration) {
        dayActivities = [
          { time: "6:00 AM", activity: "Early morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Final sightseeing" },
          { time: formData.checkOutTime || "12:00 PM", activity: "Check-out" },
        ];
      } else {
        dayActivities = [
          { time: "6:00 AM", activity: "Morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Sightseeing" },
          { time: "1:00 PM", activity: "Lunch" },
          { time: "3:00 PM", activity: "Afternoon activity" },
          { time: "7:00 PM", activity: "Evening activity" },
          { time: "8:00 PM", activity: "Dinner" },
        ];
      }

      basicItinerary.push({
        day: i,
        activities: dayActivities,
        isExpanded: true,
      });
    }

    setFormData((prev) => ({ ...prev, itinerary: basicItinerary }));
    markFieldTouched("itinerary");
    validateField("itinerary", basicItinerary);
  };

 // In your AddPackage component, update the handleSubmit function:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setShowValidationErrors(true);
  setPackageLimitError(false); // Reset error state

  console.log(packages, "package count");
  const vendorPackageCount = packages.length;
  console.log(vendorPackageCount, "count");

  // Note: This frontend check is a UX optimization
  // The backend will perform the authoritative validation
  if (vendorPackageCount >= 3) {
    setPackageLimitError(true);
    toast.error("Package limit reached! You can only create up to 3 packages on the free tier.", {
      position: "top-center",
      autoClose: 5000,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const simpleItinerary = formData.itinerary.flatMap((day) =>
    day.activities.map((activity) => ({
      day: day.day,
      time: activity.time,
      activity: activity.activity,
    }))
  );

  const hasFlight = formData.flightOption === true;

  const completePackage: Package = {
    id: crypto.randomUUID(),
    destinationId: formData.destinationId,
    packageName: formData.packageName,
    description: formData.description,
    price: Number(formData.price || 0),
    flightPrice: hasFlight ? Number(formData.flightPrice || 0) : undefined,
    duration: formData.duration,
    startDate: new Date(),
    endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
    images: formData.images,
    hotels: formData.selectedHotels,
    activities: formData.selectedActivities,
    checkOutTime: formData.checkOutTime,
    checkInTime: formData.checkInTime,
    itinerary: simpleItinerary,
    inclusions: formData.inclusions,
    amenities: formData.amenities,
    flightOption: hasFlight,
    flight: null,
  };

  try {
    // Dispatch and wait for the result
    const result = await dispatch(addPackage(completePackage));
    
    // Check if the action was rejected
    if (addPackage.rejected.match(result)) {
      // Handle the error from backend
      const errorMessage = result.error.message || "Failed to create package";
      
      if (errorMessage.includes("limit")) {
        setPackageLimitError(true);
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      } else {
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Success case
    setIsSubmitted(true);
    setShowValidationErrors(false);
    resetValidation();

    // Reset form
    setFormData({
      packageName: "",
      description: "",
      price: 0,
      duration: 1,
      selectedHotels: [],
      selectedActivities: [],
      images: [],
      destinationId: "",
      checkInTime: "",
      checkOutTime: "",
      itinerary: [],
      inclusions: [],
      amenities: [],
      flightOption: false,
      flightPrice: 0,
    });

    toast.success("Package created successfully!", {
      position: "top-center",
      autoClose: 3000,
    });

    setTimeout(() => setIsSubmitted(false), 3000);
  } catch (error) {
    console.error("Error creating package:", error);
    toast.error("An unexpected error occurred. Please try again.", {
      position: "top-center",
      autoClose: 5000,
    });
  }
};
  const selectedDestination = destinations.find(
    (dest) => dest.id === formData.destinationId
  );

  const ErrorMessage = ({ message }: { message: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium">
        <AlertCircle className="h-4 w-4" />
        <span>{message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
       
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-4">
            Create Travel Package
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            Design extraordinary travel experiences
          </p>
        </div>

        <Card className="shadow-2xl border-0 backdrop-blur-xl">
          <CardContent className="p-10">
            {isSubmitted && (
              <Alert className="mb-8 border-0 bg-gradient-to-r from-emerald-50 to-green-50">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <AlertDescription className="text-emerald-800 font-semibold">
                  Package created successfully!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {showValidationErrors && Object.values(errors).some((e) => e) && (
              <Alert variant="destructive" className="mb-8">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>
                  Please fix the validation errors before submitting
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} >
              <div >
                <div >
                  <div>
                    <PackageBasicInfo
                      formData={{
                        ...formData,
                        selectedHotels: formData.selectedHotels.map(
                          (h) => h.hotelId || h.id || ""
                        ),
                        selectedActivities: formData.selectedActivities.map(
                          (a) => a.id || ""
                        ),
                      }}
                      destinations={destinations}
                      loadingDestinations={loadingDestinations}
                      filteredHotels={allHotels}
                      filteredActivities={allActivities}
                      selectedDestination={selectedDestination}
                      onChange={handleChange}
                      onDestinationChange={handleDestinationChange}
                    />
                    <ErrorMessage message={getFieldError("packageName")} />
                    <ErrorMessage message={getFieldError("description")} />
                    <ErrorMessage message={getFieldError("price")} />
                    <ErrorMessage message={getFieldError("duration")} />
                    <ErrorMessage message={getFieldError("destinationId")} />
                  </div>

                  <div>
                    <ImageUploadSection
                      images={formData.images}
                      onImagesChange={(images) => {
                        setFormData((prev) => ({ ...prev, images }));
                        if (touched.images) {
                          validateField("images", images);
                        }
                      }}
                    />
                    <ErrorMessage message={getFieldError("images")} />
                  </div>

                  <div>
                    <HotelsActivitiesSection
                      destinationId={formData.destinationId}
                      selectedDestination={selectedDestination}
                      filteredHotels={allHotels}
                      filteredActivities={allActivities}
                      selectedHotels={formData.selectedHotels.map(
                        (h) => h.hotelId || h.id || ""
                      )}
                      selectedActivities={formData.selectedActivities.map(
                        (a) => a.id || ""
                      )}
                      loadingHotels={loadingHotels}
                      loadingActivities={loadingActivities}
                      duration={formData.duration}
                      onHotelSelection={handleHotelSelection}
                      onActivitySelection={handleActivitySelection}
                    />
                    <ErrorMessage message={getFieldError("selectedHotels")} />
                    <ErrorMessage
                      message={getFieldError("selectedActivities")}
                    />
                  </div>

                  <Card className="shadow-xl">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-bold mb-2">
                            Check-in Time
                          </label>
                          <input
                            type="text"
                            name="checkInTime"
                            value={formData.checkInTime}
                            onChange={handleChange}
                            placeholder="e.g. 3:00 PM"
                            className="w-full p-4 border-2 rounded-xl"
                          />
                          <ErrorMessage
                            message={getFieldError("checkInTime")}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2">
                            Check-out Time
                          </label>
                          <input
                            type="text"
                            name="checkOutTime"
                            value={formData.checkOutTime}
                            onChange={handleChange}
                            placeholder="e.g. 12:00 PM"
                            className="w-full p-4 border-2 rounded-xl"
                          />
                          <ErrorMessage
                            message={getFieldError("checkOutTime")}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl">
                    <CardHeader className="bg-gradient-to-r bg-black text-white">
                      <CardTitle className="flex items-center justify-between">
                        <span>Detailed Itinerary</span>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={generateBasicItinerary}
                            variant="outline"
                            size="sm"
                            className="bg-white/20"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Auto-Generate
                          </Button>
                          <Button
                            type="button"
                            onClick={addDay}
                            variant="outline"
                            size="sm"
                            className="bg-white/20"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Day
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      {formData.itinerary.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          <Calendar className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                          <p className="text-2xl font-bold mb-2">
                            No itinerary added yet
                          </p>
                          <p>Click "Add Day" or "Auto-Generate"</p>
                        </div>
                      ) : (
                        formData.itinerary.map((day, dayIndex) => (
                          <Card key={dayIndex} className="mb-4">
                            <CardHeader
                              className="cursor-pointer"
                              onClick={() => toggleDayExpansion(dayIndex)}
                            >
                              <CardTitle className="flex justify-between">
                                <div className="flex items-center gap-4">
                                  {day.isExpanded ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                  <span>Day {day.day}</span>
                                </div>
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeDay(dayIndex);
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            {day.isExpanded && (
                              <CardContent>
                                {day.activities.map((activity, actIndex) => (
                                  <div
                                    key={actIndex}
                                    className="flex gap-4 mb-4"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Time"
                                      value={activity.time}
                                      onChange={(e) =>
                                        updateActivity(
                                          dayIndex,
                                          actIndex,
                                          "time",
                                          e.target.value
                                        )
                                      }
                                      className="w-36 p-3 border-2 rounded-lg"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Activity"
                                      value={activity.activity}
                                      onChange={(e) =>
                                        updateActivity(
                                          dayIndex,
                                          actIndex,
                                          "activity",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 p-3 border-2 rounded-lg"
                                    />
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        removeActivityFromDay(
                                          dayIndex,
                                          actIndex
                                        )
                                      }
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  type="button"
                                  onClick={() => addActivityToDay(dayIndex)}
                                  variant="outline"
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Activity
                                </Button>
                              </CardContent>
                            )}
                          </Card>
                        ))
                      )}
                      <ErrorMessage message={getFieldError("itinerary")} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-black text-white">
                      <CardTitle>Package Inclusions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <textarea
                        placeholder="Enter inclusions (comma-separated)"
                        value={formData.inclusions.join(", ")}
                        onChange={(e) => {
                          const newInclusions = e.target.value
                            .split(",")
                            .map((i) => i.trim())
                            .filter((i) => i);
                          setFormData((prev) => ({
                            ...prev,
                            inclusions: newInclusions,
                          }));
                        }}
                        rows={5}
                        className="w-full p-4 border-2 rounded-xl"
                      />
                      <ErrorMessage message={getFieldError("inclusions")} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-black text-white">
                      <CardTitle>Available Amenities</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <textarea
                        placeholder="Enter amenities (comma-separated)"
                        value={formData.amenities.join(", ")}
                        onChange={(e) => {
                          const newAmenities = e.target.value
                            .split(",")
                            .map((a) => a.trim())
                            .filter((a) => a);
                          setFormData((prev) => ({
                            ...prev,
                            amenities: newAmenities,
                          }));
                        }}
                        rows={5}
                        className="w-full p-4 border-2 rounded-xl"
                      />
                      <ErrorMessage message={getFieldError("amenities")} />
                    </CardContent>
                  </Card>

                
                  <Card className="shadow-xl">
                    <CardHeader className="bg-black text-white">
                      <CardTitle>Flight (optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">
                          Offer with-flight option
                        </label>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">No</span>
                          <input
                            aria-label="Include flight option"
                            type="checkbox"
                            checked={formData.flightOption}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                flightOption: e.target.checked,
                              }))
                            }
                            className="h-5 w-5 rounded"
                          />
                          <span className="text-sm text-gray-600">Yes</span>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full max-w-2xl h-16 bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
                      Creating Package...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-6 w-6 mr-4" />
                      Create Package - ₹{formData.price}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddPackage;