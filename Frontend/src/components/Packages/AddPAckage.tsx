import type React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackage } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  Plus,
  FileText,
  Clock,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Stars,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { usePackageData } from "./usepackagedata";
import PackageBasicInfo from "./packagebasicInfo";
import ImageUploadSection from "./ImageUploadSection";
import HotelsActivitiesSection from "./HotelActivitySection";
import PricingSidebar from "./Pricing";
import type { PackageFormData } from "@/interface/packageFormData";
import { usePackageValidation } from "@/Types/vendor/Package/package"; 
interface ItineraryActivity {
  time: string;
  activity: string;
}

interface ItineraryDay {
  day: number;
  activities: ItineraryActivity[];
  isExpanded?: boolean;
}

interface EnhancedPackageFormData extends Omit<PackageFormData, "itinerary"> {
  itinerary: ItineraryDay[];
}

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.package);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  const {
    errors,
    touched,
    validateField,
    validateAllFields,
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
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "price" || name === "duration" ? Number(value) : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validate field on change if it's been touched
    if (touched[name]) {
      validateField(name, newValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    markFieldTouched(fieldName);
    validateField(fieldName, formData[fieldName as keyof EnhancedPackageFormData]);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setFormData((prev) => ({
      ...prev,
      destinationId: newValue,
    }));
    
    markFieldTouched("destinationId");
    validateField("destinationId", newValue);
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

  const calculateTotalPrice = () => {
    const hotelsCost =
      formData.selectedHotels.length * 2000 * formData.duration;
    const activitiesCost = formData.selectedActivities.length * 1500;
    return formData.price + hotelsCost + activitiesCost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidationErrors(true);

    // Validate all fields
    const isValid = validateAllFields(formData);

    if (!isValid) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.getElementsByName(firstErrorField)[0];
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const selectedHotelIds = formData.selectedHotels;
    const selectedActivityIds = formData.selectedActivities;

    const simpleItinerary = formData.itinerary.flatMap((day) =>
      day.activities.map((activity) => ({
        day: day.day,
        time: activity.time,
        activity: activity.activity,
      }))
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
      hotels: selectedHotelIds,
      activities: selectedActivityIds,
      checkOutTime: formData.checkOutTime,
      checkInTime: formData.checkInTime,
      itinerary: simpleItinerary,
      inclusions: formData.inclusions,
      amenities: formData.amenities,
    };

    dispatch(addPackage(completePackage));
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
    });
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const totalPrice = calculateTotalPrice();
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
            <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
          </div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-4 leading-tight">
            Create Travel Package
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Stars className="h-5 w-5 text-amber-400 animate-spin" />
            <p className="text-xl text-slate-600 font-medium">
              Design extraordinary travel experiences
            </p>
            <Stars className="h-5 w-5 text-amber-400 animate-spin" />
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-purple-50/50 pointer-events-none"></div>

          <CardContent className="relative p-10">
            {isSubmitted && (
              <Alert className="mb-8 border-0 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg border-l-4 border-l-emerald-500 animate-in slide-in-from-top duration-500">
                <div className="flex items-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 mr-3 animate-pulse" />
                  <AlertDescription className="text-emerald-800 font-semibold text-lg">
                    Package created successfully! Your customers will love this amazing experience.
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="mb-8 border-l-4 border-l-red-500 shadow-lg animate-in slide-in-from-top duration-500"
              >
                <AlertDescription className="font-semibold text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {showValidationErrors && Object.values(errors).some(e => e) && (
              <Alert
                variant="destructive"
                className="mb-8 border-l-4 border-l-red-500 shadow-lg animate-in slide-in-from-top duration-500"
              >
                <AlertDescription className="font-semibold text-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Please fix the validation errors before submitting
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-8">
                  <div className="animate-in fade-in-50 duration-700">
                    <div className="space-y-4">
                      <div onBlur={handleBlur}>
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
                      </div>
                      {getFieldError("destinationId") && <ErrorMessage message={getFieldError("destinationId")} />}
                      {getFieldError("packageName") && <ErrorMessage message={getFieldError("packageName")} />}
                      {getFieldError("description") && <ErrorMessage message={getFieldError("description")} />}
                      {getFieldError("price") && <ErrorMessage message={getFieldError("price")} />}
                      {getFieldError("duration") && <ErrorMessage message={getFieldError("duration")} />}
                    </div>
                  </div>

                  <div className="animate-in fade-in-50 duration-700 delay-100">
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

                  <div className="animate-in fade-in-50 duration-700 delay-200">
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
                      onHotelSelection={(hotels) => {
                        setFormData((prev) => ({
                          ...prev,
                          selectedHotels: hotels,
                        }));
                        if (touched.selectedHotels) {
                          validateField("selectedHotels", hotels);
                        }
                      }}
                      onActivitySelection={(activities) => {
                        setFormData((prev) => ({
                          ...prev,
                          selectedActivities: activities,
                        }));
                        if (touched.selectedActivities) {
                          validateField("selectedActivities", activities);
                        }
                      }}
                    />
                    <ErrorMessage message={getFieldError("selectedHotels")} />
                    <ErrorMessage message={getFieldError("selectedActivities")} />
                  </div>

                  <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-lg animate-in fade-in-50 duration-700 delay-300">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                            Check-in Time
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="checkInTime"
                              value={formData.checkInTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="e.g. 3:00 PM"
                              className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium ${
                                getFieldError("checkInTime") ? "border-red-500" : "border-slate-200"
                              }`}
                            />
                            <Clock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                          </div>
                          <ErrorMessage message={getFieldError("checkInTime")} />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                            Check-out Time
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="checkOutTime"
                              value={formData.checkOutTime}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="e.g. 12:00 PM"
                              className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm font-medium ${
                                getFieldError("checkOutTime") ? "border-red-500" : "border-slate-200"
                              }`}
                            />
                            <Clock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                          </div>
                          <ErrorMessage message={getFieldError("checkOutTime")} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-lg animate-in fade-in-50 duration-700 delay-400">
                    <CardHeader className="bg-gradient-to-r bg-black text-white rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-pink-600/30"></div>
                      <CardTitle className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <span className="text-xl font-medium">
                            Detailed Itinerary
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            type="button"
                            onClick={generateBasicItinerary}
                            variant="outline"
                            size="sm"
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Auto-Generate
                          </Button>
                          <Button
                            type="button"
                            onClick={addDay}
                            variant="outline"
                            size="sm"
                            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Day
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {formData.itinerary.length === 0 ? (
                          <div className="text-center py-16 text-gray-500">
                            <div className="relative">
                              <Calendar className="h-20 w-20 mx-auto mb-6 text-gray-300" />
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                                <Sparkles className="h-6 w-6 text-yellow-400 animate-bounce" />
                              </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-600 mb-2">
                              No itinerary added yet
                            </p>
                            <p className="text-lg text-gray-500">
                              Click "Add Day" or "Auto-Generate" to create your amazing itinerary
                            </p>
                          </div>
                        ) : (
                          formData.itinerary.map((day, dayIndex) => (
                            <Card
                              key={dayIndex}
                              className="border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/50"
                            >
                              <CardHeader
                                className="bg-gradient-to-r from-indigo-100 to-purple-100 cursor-pointer hover:from-indigo-200 hover:to-purple-200 transition-all duration-300"
                                onClick={() => toggleDayExpansion(dayIndex)}
                              >
                                <CardTitle className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg">
                                      {day.isExpanded ? (
                                        <ChevronDown className="h-5 w-5" />
                                      ) : (
                                        <ChevronRight className="h-5 w-5" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                        Day {day.day}
                                      </span>
                                      <div className="text-sm text-indigo-600 font-medium">
                                        {day.activities.length} activities planned
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeDay(dayIndex);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </CardTitle>
                              </CardHeader>

                              {day.isExpanded && (
                                <CardContent className="p-6 bg-gradient-to-br from-white to-slate-50/50">
                                  <div className="space-y-4">
                                    {day.activities.map((activity, activityIndex) => (
                                      <div
                                        key={activityIndex}
                                        className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300"
                                      >
                                        <div className="relative">
                                          <input
                                            type="text"
                                            placeholder="Time (e.g. 3:00 PM)"
                                            value={activity.time}
                                            onChange={(e) =>
                                              updateActivity(
                                                dayIndex,
                                                activityIndex,
                                                "time",
                                                e.target.value
                                              )
                                            }
                                            className="w-36 p-3 border-2 border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium bg-slate-50"
                                          />
                                          <Clock className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                                        </div>
                                        <input
                                          type="text"
                                          placeholder="Activity description"
                                          value={activity.activity}
                                          onChange={(e) =>
                                            updateActivity(
                                              dayIndex,
                                              activityIndex,
                                              "activity",
                                              e.target.value
                                            )
                                          }
                                          className="flex-1 p-3 border-2 border-slate-300 rounded-lg focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium"
                                        />
                                        <Button
                                          type="button"
                                          onClick={() =>
                                            removeActivityFromDay(dayIndex, activityIndex)
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}

                                    <Button
                                      type="button"
                                      onClick={() => addActivityToDay(dayIndex)}
                                      variant="outline"
                                      size="sm"
                                      className="w-full border-dashed border-2 border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-300 h-12"
                                    >
                                      <Plus className="h-5 w-5 mr-2" />
                                      Add Activity to Day {day.day}
                                    </Button>
                                  </div>
                                </CardContent>
                              )}
                            </Card>
                          ))
                        )}
                      </div>
                      <ErrorMessage message={getFieldError("itinerary")} />
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br animate-in fade-in-50 duration-700 delay-500">
                    <CardHeader className="bg-gradient-to-r bg-black text-white rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r"></div>
                      <CardTitle className="flex items-center gap-3 relative z-10">
                        <div>
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold">
                          Package Inclusions
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                          What's included in this amazing package?
                        </label>
                        <textarea
                          placeholder="Enter inclusions (comma-separated)&#10;e.g. Welcome drink on arrival, Tent accommodation on sharing basis, Dinner, Breakfast, Music"
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
                            if (touched.inclusions) {
                              validateField("inclusions", newInclusions);
                            }
                          }}
                          onBlur={() => {
                            markFieldTouched("inclusions");
                            validateField("inclusions", formData.inclusions);
                          }}
                          rows={5}
                          className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm font-medium ${
                            getFieldError("inclusions") ? "border-red-500" : "border-emerald-200"
                          }`}
                        />
                        <ErrorMessage message={getFieldError("inclusions")} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-gradient-to-br duration-700 delay-600">
                    <CardHeader className="bg-gradient-to-r bg-black text-white rounded-t-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r bg-black"></div>
                      <CardTitle className="flex items-center gap-3 relative z-10">
                        <div>
                          <FileText className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold">
                          Available Amenities
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                          What amenities are available?
                        </label>
                        <textarea
                          placeholder="Enter amenities (comma-separated)&#10;e.g. Freshup facility, Phone charging, Washroom facility, 24/7 Caretaker services"
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
                            if (touched.amenities) {
                              validateField("amenities", newAmenities);
                            }
                          }}
                          onBlur={() => {
                            markFieldTouched("amenities");
                            validateField("amenities", formData.amenities);
                          }}
                          rows={5}
                          className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none bg-white/80 backdrop-blur-sm font-medium ${
                            getFieldError("amenities") ? "border-red-500" : "border-purple-200"
                          }`}
                        />
                        <ErrorMessage message={getFieldError("amenities")} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="animate-in fade-in-50 duration-700 delay-700">
                  <PricingSidebar
                    formData={formData}
                    selectedDestination={selectedDestination}
                    totalPrice={totalPrice}
                  />
                </div>
              </div>

              <div className="flex justify-center pt-10 animate-in fade-in-50 duration-700 delay-800">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full max-w-2xl h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-4"></div>
                        <span>Creating Your Amazing Package...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6 mr-4 animate-pulse" />
                        Create Package - ₹{totalPrice.toLocaleString()}
                        <Stars className="h-5 w-5 ml-4 animate-spin" />
                      </>
                    )}
                  </div>
                </Button>
              </div>

              <div className="flex justify-center mt-6">
                <div className="flex space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.destinationId && !getFieldError("destinationId") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.packageName && !getFieldError("packageName") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.description && !getFieldError("description") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.price > 0 && !getFieldError("price") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.images.length > 0 && !getFieldError("images") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      formData.itinerary.length > 0 && !getFieldError("itinerary") ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-12 text-gray-500">
          <p className="text-lg font-medium">
            Create unforgettable memories for your travelers
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;