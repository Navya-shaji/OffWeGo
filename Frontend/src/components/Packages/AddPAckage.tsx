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

      const result = await dispatch(addPackage(completePackage));

      if (addPackage.rejected.match(result)) {

        const errorMessage =

          "You do not have an active subscription";

        console.log("Backend error:", errorMessage);


        if (errorMessage.includes("You do not have an active subscription")) {
          toast.error(
            "You do not have an active subscription. Purchase a plan to add packages.",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }


        if (errorMessage.includes("limit")) {
          setPackageLimitError(true);
          toast.error(errorMessage, {
            position: "top-center",
            autoClose: 5000,
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }


        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }




      setIsSubmitted(true);
      setShowValidationErrors(false);
      resetValidation();


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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
            Create Travel Package
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Design and manage your travel packages
          </p>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {isSubmitted && (
        <Alert className="bg-green-50 border border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">
            Package created successfully!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {showValidationErrors && Object.values(errors).some((e) => e) && (
        <Alert className="bg-red-50 border border-red-200">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            Please fix the validation errors before submitting
          </AlertDescription>
        </Alert>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Info */}
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

              {/* Image Upload */}
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

              {/* Hotels & Activities */}
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
                <ErrorMessage message={getFieldError("selectedActivities")} />
              </div>

              {/* Check-in/Check-out Times */}
              <Card className="shadow border border-gray-200">
                <CardContent className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Check-in Time
                      </label>
                      <input
                        type="text"
                        name="checkInTime"
                        value={formData.checkInTime}
                        onChange={handleChange}
                        placeholder="e.g. 3:00 PM"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                      <ErrorMessage message={getFieldError("checkInTime")} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Check-out Time
                      </label>
                      <input
                        type="text"
                        name="checkOutTime"
                        value={formData.checkOutTime}
                        onChange={handleChange}
                        placeholder="e.g. 12:00 PM"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                      <ErrorMessage message={getFieldError("checkOutTime")} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card className="shadow border border-gray-200">
                <CardHeader className="bg-slate-800 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-base">Detailed Itinerary</span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={generateBasicItinerary}
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto-Generate
                      </Button>
                      <Button
                        type="button"
                        onClick={addDay}
                        variant="outline"
                        size="sm"
                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  {formData.itinerary.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-semibold mb-2">
                        No itinerary added yet
                      </p>
                      <p className="text-sm">Click "Add Day" or "Auto-Generate"</p>
                    </div>
                  ) : (
                    formData.itinerary.map((day, dayIndex) => (
                      <Card key={dayIndex} className="mb-3 border border-gray-200">
                        <CardHeader
                          className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleDayExpansion(dayIndex)}
                        >
                          <CardTitle className="flex justify-between items-center text-base">
                            <div className="flex items-center gap-3">
                              {day.isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-gray-600" />
                              )}
                              <span className="text-gray-900">Day {day.day}</span>
                            </div>
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDay(dayIndex);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        {day.isExpanded && (
                          <CardContent className="p-4">
                            {day.activities.map((activity, actIndex) => (
                              <div key={actIndex} className="flex gap-3 mb-3">
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
                                  className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
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
                                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                />
                                <Button
                                  type="button"
                                  onClick={() =>
                                    removeActivityFromDay(dayIndex, actIndex)
                                  }
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              onClick={() => addActivityToDay(dayIndex)}
                              variant="outline"
                              className="w-full border-dashed"
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

              {/* Inclusions */}
              <Card className="shadow border border-gray-200">
                <CardHeader className="bg-slate-800 text-white">
                  <CardTitle className="text-base">Package Inclusions</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <ErrorMessage message={getFieldError("inclusions")} />
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="shadow border border-gray-200">
                <CardHeader className="bg-slate-800 text-white">
                  <CardTitle className="text-base">Available Amenities</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                  <ErrorMessage message={getFieldError("amenities")} />
                </CardContent>
              </Card>

              {/* Flight Option */}
              <Card className="shadow border border-gray-200">
                <CardHeader className="bg-slate-800 text-white">
                  <CardTitle className="text-base">Flight (optional)</CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-900">
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
                        className="h-5 w-5 rounded border-gray-300 text-slate-800 focus:ring-slate-500"
                      />
                      <span className="text-sm text-gray-600">Yes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full max-w-md h-12 bg-slate-800 hover:bg-slate-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Package...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-3" />
                    Create Package - ₹{formData.price}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;