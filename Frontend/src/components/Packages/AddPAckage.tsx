/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackage } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  Plus,
  Trash2,
  Calendar,

  Sparkles,
  CheckCircle2,
  AlertCircle,

  Camera,
  Hotel,
  Activity,

  Clock,

  Star,
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubscriptionRequiredModal } from "../Modular/subscriptionRequiredModal";
import { getSubscriptions, getVendorActiveSubscription } from "@/services/subscription/subscriptionservice";


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

  const vendor = useSelector((state: RootState) => state.vendorAuth?.vendor);
  const vendorId = vendor?.id;
  const packages = useSelector((state: RootState) => state.package.packages);

  useEffect(() => {
  }, [vendorId, vendor]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [, setPackageLimitError] = useState<boolean>(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const { loading, error } = useSelector((state: RootState) => state.package);

  const isSubscriptionExpired = () => {
    if (!subscriptionData?.vendorSubscription) {
      return false;
    }
    const subscription = subscriptionData.vendorSubscription;
    return (subscription.endDate && new Date(subscription.endDate) <= new Date()) ||
      subscription.status === "expired";
  };

  const getSubscriptionMessage = () => {
    if (!subscriptionData?.vendorSubscription) {
      return "You do not have an active subscription. Please purchase a subscription plan to add packages.";
    }

    const subscription = subscriptionData.vendorSubscription;
    const isExpired = subscription.endDate && new Date(subscription.endDate) <= new Date();

    if (isExpired || subscription.status === "expired") {
      return "Your subscription has expired. Please renew your subscription plan to continue adding packages.";
    }

    if (subscription.status !== "active") {
      return "Your subscription is not active. Please purchase a subscription plan to add packages.";
    }

    return "You do not have an active subscription. Please purchase a subscription plan to add packages.";
  };

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

  const checkSubscription = useCallback(async () => {
    try {
      setIsCheckingSubscription(true);

      if (!vendorId) {
        console.warn(" No vendor ID found, cannot check subscription");
        setHasActiveSubscription(false);
        setShowSubscriptionModal(true);
        setIsCheckingSubscription(false);
        return;
      }


      const result = await getVendorActiveSubscription(vendorId);


      if (result.hasActiveSubscription && result.vendorSubscription) {
        const subscription = result.vendorSubscription;

        const endDate = subscription.endDate ? new Date(subscription.endDate) : null;
        const currentDate = new Date();
        const isExpired = endDate ? endDate < currentDate : true;
        const isActive = subscription.status === "active" && !isExpired && endDate && endDate >= currentDate;



        if (isActive) {
          setHasActiveSubscription(true);
          setShowSubscriptionModal(false);
          setSubscriptionData({ vendorSubscription: subscription });
        } else {
          setHasActiveSubscription(false);
          setShowSubscriptionModal(true);
          setSubscriptionData({ vendorSubscription: subscription });
        }
      } else {
        setHasActiveSubscription(false);
        setShowSubscriptionModal(true);
        setSubscriptionData(null);
      }
    } catch (error) {
      console.error(" Error checking subscription:", error);

      setHasActiveSubscription(false);
      setShowSubscriptionModal(true);
    } finally {
      setIsCheckingSubscription(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (vendorId) {
      checkSubscription();
    } else {
      const timer = setTimeout(() => {
        if (vendorId) {
          checkSubscription();
        } else {
          console.warn(" Still no vendor ID after delay - showing subscription modal");
          setHasActiveSubscription(false);
          setShowSubscriptionModal(true);
          setIsCheckingSubscription(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [checkSubscription, vendorId]);

  useEffect(() => {

    if (!isCheckingSubscription && hasActiveSubscription === false && !showSubscriptionModal) {
      setShowSubscriptionModal(true);
    } else if (!isCheckingSubscription && hasActiveSubscription === true) {
      setShowSubscriptionModal(false);
    }
  }, [hasActiveSubscription, isCheckingSubscription, showSubscriptionModal]);

  useEffect(() => {
    const handleFocus = () => {
      checkSubscription();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSubscription();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSubscription]);

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidationErrors(true);
    setPackageLimitError(false);



    if (hasActiveSubscription === false && !isCheckingSubscription) {

      setShowSubscriptionModal(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (hasActiveSubscription === true) {
      setShowSubscriptionModal(false);
    }

    const vendorPackageCount = packages.length;


    if (vendorPackageCount >= 3) {
      setPackageLimitError(true);
      toast.error("Package limit reached! You can only create up to 3 packages on the free tier.", {
        position: "top-center",
        autoClose: 5000,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const simpleItinerary = (formData.itinerary || []).flatMap((day) =>
      (day.activities || []).map((activity) => ({
        day: day.day || 1,
        time: activity.time || "",
        activity: activity.activity || "",
      }))
    );

    const hasFlight = formData.flightOption === true;

    const completePackage: Package = {
      id: crypto.randomUUID(),
      destinationId: formData.destinationId || "",
      packageName: formData.packageName || "",
      description: formData.description || "",
      price: Number(formData.price || 0),
      flightPrice: undefined,
      duration: formData.duration || 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + (formData.duration || 1) * 24 * 60 * 60 * 1000),
      images: formData.images || [],
      hotels: formData.selectedHotels || [],
      activities: formData.selectedActivities || [],
      checkOutTime: formData.checkOutTime || "",
      checkInTime: formData.checkInTime || "",
      itinerary: simpleItinerary,
      inclusions: formData.inclusions || [],
      amenities: formData.amenities || [],
      flightOption: hasFlight,
      flight: null,
    };

    try {
      const result = await dispatch(addPackage(completePackage));

      if (addPackage.fulfilled.match(result)) {
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800">Package Created Successfully!</p>
              <p className="text-sm text-green-600">{formData.packageName || "New package"} has been added to your listings</p>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: "border-l-4 border-green-500 bg-white shadow-lg",
            icon: false,
          }
        );

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
        return;
      }

      if (addPackage.rejected.match(result)) {
        const errorPayload = result.payload as string | undefined;
        const errorMessage = errorPayload || "An error occurred";


        if (
          errorMessage.includes("You do not have an active subscription") ||
          errorMessage.includes("subscription") ||
          errorMessage.includes("not active") ||
          errorMessage.includes("expired") ||
          errorMessage.includes("Subscription expired")
        ) {
          try {
            const subData = await getSubscriptions();
            setSubscriptionData(subData);
            if (subData.vendorSubscription) {
              const subscription = subData.vendorSubscription as any;
              const isExpired = subscription.endDate && new Date(subscription.endDate) <= new Date();
              setHasActiveSubscription(!isExpired && subscription.status === "active");
            } else {
              setHasActiveSubscription(false);
            }
          } catch (err) {
            console.error("Error re-checking subscription:", err);
          }

          setShowSubscriptionModal(true);
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

        if (errorMessage.includes("Cannot read properties of undefined") ||
          errorMessage.includes("reading '0'")) {
          toast.success(
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-green-800">Package Created Successfully!</p>
                <p className="text-sm text-green-600">{formData.packageName || "New package"} has been added to your listings</p>
              </div>
            </div>,
            {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              className: "border-l-4 border-green-500 bg-white shadow-lg",
              icon: false,
            }
          );

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
          return;
        }


        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    } catch (error) {
      console.error("Error creating package:", error);


      if (error instanceof Error &&
        (error.message.includes("Cannot read properties of undefined") ||
          error.message.includes("reading '0'"))) {

        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-800">Package Created Successfully!</p>
              <p className="text-sm text-green-600">{formData.packageName || "New package"} has been added to your listings</p>
            </div>
          </div>,
          {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: "border-l-4 border-green-500 bg-white shadow-lg",
            icon: false,
          }
        );


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
        return;
      }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-200/40 to-rose-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-4"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold bg-gradient-to-r bg-black bg-clip-text text-transparent mb-4">
            Create Amazing Travel Package
          </h1>

        </div>
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r bg-black text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span>Package Details</span>
              </div>

            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
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

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="relative">


                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
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
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Package Images</h3>
                      <p className="text-sm text-gray-600">Upload high-quality images to showcase your package</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
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
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Hotels & Activities</h3>
                      <p className="text-sm text-gray-600">Select accommodations and activities for your package</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
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
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                      <p className="text-sm text-gray-600">Set check-in and check-out times</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
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
                        <ErrorMessage message={getFieldError("checkInTime")} />
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
                          placeholder="e.g. 11:00 AM"
                          className="w-full p-4 border-2 rounded-xl"
                        />
                        <ErrorMessage message={getFieldError("checkOutTime")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itinerary Section */}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Daily Itinerary</h3>
                      <p className="text-sm text-gray-600">Plan day-by-day activities for your travelers</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                    <div className="flex gap-3 mb-6">
                      <Button
                        type="button"
                        onClick={generateBasicItinerary}
                        variant="outline"
                        size="sm"
                        className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto-Generate
                      </Button>
                      <Button
                        type="button"
                        onClick={addDay}
                        variant="outline"
                        size="sm"
                        className="bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day
                      </Button>
                    </div>

                    {formData.itinerary.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p>No itinerary planned yet. Add days to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.itinerary.map((day, dayIndex) => (
                          <Card key={dayIndex} className="border border-orange-200">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-900">
                                  Day {day.day}
                                </h4>
                                <Button
                                  type="button"
                                  onClick={() => removeDay(dayIndex)}
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="space-y-3">
                                {day.activities.map((activity, actIndex) => (
                                  <div key={actIndex} className="flex items-center gap-3">
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
                                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Activity
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Details Section */}
                <div className="relative">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Package Details</h3>
                      <p className="text-sm text-gray-600">Add inclusions, amenities, and flight options</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100 space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Package Inclusions
                      </label>
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
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2">
                        Available Amenities
                      </label>
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
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-pink-200">
                      <div>
                        <label className="text-sm font-bold">
                          Flight Option Available
                        </label>
                        <p className="text-xs text-gray-600">Offer flight add-on to customers</p>
                      </div>
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
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-10">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="relative group overflow-hidden bg-gradient-to-r bg-black text-white "
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                        <span>Creating Package...</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span>Create Package</span>
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          ₹{formData.price.toLocaleString()}
                        </div>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {showSubscriptionModal && !isCheckingSubscription && hasActiveSubscription === false && (
        <SubscriptionRequiredModal
          isOpen={showSubscriptionModal}
          onClose={() => {
            setShowSubscriptionModal(false);
            checkSubscription();
          }}
          message={getSubscriptionMessage()}
          isExpired={isSubscriptionExpired()}
        />
      )}

      {isCheckingSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 bg-black"></div>
            <span className="text-gray-700">Checking subscription status...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPackage;