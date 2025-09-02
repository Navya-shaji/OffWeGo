"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Clock,
  Building,
  Activity,
  Camera,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Star,
  Car,
  Utensils,
  Heart,
  Share2,
  Loader2,
  Coffee,
  Sun,
  Moon,
  Sunset,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/profile/navbar";

type Package = {
  packageName: string;
  description: string;
  duration: number;
  price: number;
  images: string[];
  activities: { title: string; description: string }[];
  hotels: { name: string; rating: number; address: string }[];
};

const createDetailedItinerary = (packageData: Package) => {
  const baseItinerary = [
    {
      day: 1,
      title: "Arrival & Check-in",
      schedule: [
        {
          time: "10:00 AM",
          activity: "Airport Pickup",
          description: "Meet and greet at arrival terminal",
          icon: <Car className="h-4 w-4" />,
          type: "transport",
        },
        {
          time: "12:00 PM",
          activity: "Hotel Check-in",
          description: "Check into your premium accommodation",
          icon: <Building className="h-4 w-4" />,
          type: "accommodation",
        },
        {
          time: "2:00 PM",
          activity: "Welcome Lunch",
          description: "Traditional welcome meal at hotel restaurant",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal",
        },
        {
          time: "4:00 PM",
          activity: "City Orientation Tour",
          description: "Brief orientation and local area familiarization",
          icon: <MapPin className="h-4 w-4" />,
          type: "activity",
        },
        {
          time: "7:00 PM",
          activity: "Dinner & Rest",
          description: "Dinner at hotel and free time to rest",
          icon: <Moon className="h-4 w-4" />,
          type: "meal",
        },
      ],
    },
  ];

  for (let i = 2; i < packageData.duration; i++) {
    const activitiesForDay = packageData.activities.slice(
      Math.floor(
        ((i - 2) * packageData.activities.length) /
          Math.max(1, packageData.duration - 2)
      ),
      Math.floor(
        ((i - 1) * packageData.activities.length) /
          Math.max(1, packageData.duration - 2)
      )
    );

    baseItinerary.push({
      day: i,
      title: `Adventure Day ${i - 1}`,
      schedule: [
        {
          time: "7:00 AM",
          activity: "Breakfast",
          description: "Continental breakfast at hotel",
          icon: <Coffee className="h-4 w-4" />,
          type: "meal",
        },
        {
          time: "9:00 AM",
          activity: activitiesForDay[0]?.title || "Morning Activity",
          description:
            activitiesForDay[0]?.description || "Exciting morning adventure",
          icon: <Sun className="h-4 w-4" />,
          type: "activity",
        },
        {
          time: "1:00 PM",
          activity: "Lunch Break",
          description: "Local cuisine at recommended restaurant",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal",
        },
        {
          time: "3:00 PM",
          activity: activitiesForDay[1]?.title || "Afternoon Activity",
          description:
            activitiesForDay[1]?.description || "Afternoon exploration",
          icon: <Activity className="h-4 w-4" />,
          type: "activity",
        },
        {
          time: "6:00 PM",
          activity: "Evening Leisure",
          description: "Free time for shopping or relaxation",
          icon: <Sunset className="h-4 w-4" />,
          type: "leisure",
        },
        {
          time: "8:00 PM",
          activity: "Dinner",
          description: "Traditional dinner with local specialties",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal",
        },
      ],
    });
  }

  if (packageData.duration > 1) {
    baseItinerary.push({
      day: packageData.duration,
      title: "Departure",
      schedule: [
        {
          time: "8:00 AM",
          activity: "Breakfast & Check-out",
          description: "Final breakfast and hotel check-out",
          icon: <Coffee className="h-4 w-4" />,
          type: "meal",
        },
        {
          time: "10:00 AM",
          activity: "Last Minute Shopping",
          description: "Souvenir shopping and local market visit",
          icon: <Activity className="h-4 w-4" />,
          type: "activity",
        },
        {
          time: "12:00 PM",
          activity: "Farewell Lunch",
          description: "Final meal together before departure",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal",
        },
        {
          time: "3:00 PM",
          activity: "Airport Drop-off",
          description: "Transfer to airport for departure",
          icon: <Car className="h-4 w-4" />,
          type: "transport",
        },
      ],
    });
  }

  return baseItinerary.map((day) => ({
    ...day,
    hotel:
      packageData.hotels[Math.floor(Math.random() * packageData.hotels.length)],
  }));
};

const getTypeStyles = (type: string) => {
  switch (type) {
    case "meal":
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
    case "activity":
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
    case "transport":
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
    case "accommodation":
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
    case "leisure":
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
    default:
      return {
        bg: "bg-zinc-50",
        border: "border-zinc-200",
        text: "text-zinc-800",
      };
  }
};

export const PackageTimeline = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage as Package;

  const userId = useSelector((state: any) => state?.auth?.user?.id);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPackage) navigate(-1);
  }, [selectedPackage, navigate]);

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6 text-zinc-700" />
          </div>
          <h2 className="text-xl font-semibold">Package Not Found</h2>
          <p className="text-sm text-zinc-600">
            The package you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-4 py-2 rounded-lg transition-colors hover:bg-zinc-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const detailedItinerary = createDetailedItinerary(selectedPackage);

  const handleBooking = async () => {
    if (!userId) {
      setBookingError("User not logged in. Please log in to book a package.");
      return;
    }
    if (!selectedDate) {
      setBookingError("Please select a travel date.");
      return;
    }

    setIsBookingLoading(true);
    setBookingError(null);

    try {
      navigate("/booking", {
        state: {
          selectedPackage,
        },
      });
      alert("success");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Booking failed:", error);
        setBookingError(
          error.message || "Failed to book package. Please try again."
        );
      } else {
        console.error("Booking failed:", error);
        setBookingError("Failed to book package. Please try again.");
      }
    } finally {
      setIsBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      <header className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="border-zinc-300 text-zinc-800 hover:bg-zinc-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "fill-current text-zinc-900" : "text-zinc-700"
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-zinc-300 text-zinc-800 hover:bg-zinc-100 bg-transparent"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold mt-3 text-pretty">
            {selectedPackage.packageName}
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-zinc-600">
            {selectedPackage.description}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border border-zinc-200 overflow-hidden bg-white">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 bg-white/10 rounded">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      icon: <Clock className="text-zinc-800" />,
                      label: "Duration",
                      value: `${selectedPackage.duration} Days`,
                    },
                    {
                      icon: <Building className="text-zinc-800" />,
                      label: "Hotels",
                      value: selectedPackage.hotels?.length || 0,
                    },
                    {
                      icon: <Activity className="text-zinc-800" />,
                      label: "Activities",
                      value: selectedPackage.activities?.length || 0,
                    },
                    {
                      icon: <CreditCard className="text-zinc-800" />,
                      label: "Total Price",
                      value: formatCurrency(selectedPackage.price),
                    },
                  ].map(({ icon, label, value }, i) => (
                    <div
                      key={i}
                      className="text-center p-4 rounded-lg bg-zinc-50 border border-zinc-200 transition-colors hover:bg-zinc-100"
                    >
                      <div className="h-7 w-7 mx-auto mb-2 flex items-center justify-center">
                        {icon}
                      </div>
                      <div className="font-semibold text-sm">{value}</div>
                      <div className="text-xs text-zinc-600 mt-0.5">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPackage.images?.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className="p-1.5 bg-black rounded text-white">
                        <Camera className="h-5 w-5" />
                      </div>
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group overflow-hidden rounded-lg border border-zinc-200">
                        <img
                          src={selectedPackage.images[currentImageIndex]}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 left-3 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                          Image {currentImageIndex + 1} of{" "}
                          {selectedPackage.images.length}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3"></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-zinc-200 overflow-hidden bg-white">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 bg-white/10 rounded">
                    <Calendar className="h-5 w-5" />
                  </div>
                  Detailed Daily Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {detailedItinerary.map((day, dayIndex) => (
                  <div key={day.day} className="relative">
                    {dayIndex < detailedItinerary.length - 1 && (
                      <div className="absolute left-8 top-16 w-px h-[calc(100%-2rem)] bg-zinc-200" />
                    )}

                    <div className="flex gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-semibold text-base">
                          {day.day}
                        </div>
                        <div className="absolute inset-0 rounded-full ring-2 ring-zinc-200 pointer-events-none" />
                      </div>

                      <div className="flex-1">
                        <div className="bg-white rounded-lg p-5 border border-zinc-200">
                          <h3 className="font-semibold text-lg mb-3">
                            Day {day.day}: {day.title}
                          </h3>

                          <div className="mb-4 p-3 bg-zinc-50 rounded border border-zinc-200">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Building className="h-4 w-4 text-zinc-700" />
                              <span className="font-medium">
                                {day.hotel.name}
                              </span>
                              <div className="flex items-center gap-1 text-zinc-700">
                                {[...Array(Math.floor(day.hotel.rating))].map(
                                  (_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5" />
                                  )
                                )}
                                <span className="text-xs text-zinc-600 ml-1">
                                  ({day.hotel.rating})
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-zinc-600">
                              {day.hotel.address}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-zinc-700" />
                              Daily Schedule
                            </h4>

                            <div className="space-y-2">
                              {day.schedule.map((item, scheduleIndex) => {
                                const styles = getTypeStyles(item.type);
                                return (
                                  <div
                                    key={scheduleIndex}
                                    className={`flex items-start gap-3 p-3 rounded ${styles.bg} ${styles.border} border`}
                                  >
                                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                      <div
                                        className={`p-1.5 bg-white rounded border border-zinc-200 ${styles.text}`}
                                      >
                                        {item.icon}
                                      </div>
                                      <span className="text-[10px] font-medium text-zinc-700 bg-white px-1.5 py-0.5 rounded-full border border-zinc-200">
                                        {item.time}
                                      </span>
                                    </div>

                                    <div className="flex-1">
                                      <h5 className="font-medium text-sm mb-0.5">
                                        {item.activity}
                                      </h5>
                                      <p className="text-xs text-zinc-600">
                                        {item.description}
                                      </p>
                                      <div className="mt-1">
                                        <span
                                          className={`inline-block px-1.5 py-0.5 text-[10px] font-medium ${styles.text} bg-white rounded-full border border-zinc-200 capitalize`}
                                        >
                                          {item.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-zinc-50 rounded border border-zinc-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                              <div>
                                <div className="font-semibold text-zinc-900">
                                  {
                                    day.schedule.filter(
                                      (s) => s.type === "meal"
                                    ).length
                                  }
                                </div>
                                <div className="text-[11px] text-zinc-600">
                                  Meals
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-900">
                                  {
                                    day.schedule.filter(
                                      (s) => s.type === "activity"
                                    ).length
                                  }
                                </div>
                                <div className="text-[11px] text-zinc-600">
                                  Activities
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-900">
                                  {
                                    day.schedule.filter(
                                      (s) => s.type === "transport"
                                    ).length
                                  }
                                </div>
                                <div className="text-[11px] text-zinc-600">
                                  Transfers
                                </div>
                              </div>
                              <div>
                                <div className="font-semibold text-zinc-900">
                                  1
                                </div>
                                <div className="text-[11px] text-zinc-600">
                                  Hotel
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border border-zinc-200 overflow-hidden bg-white sticky top-6">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 bg-white/10 rounded">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  Select Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
                {selectedDate && (
                  <div className="p-3 bg-zinc-50 rounded border border-zinc-200">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Departure:</span>
                        <span className="font-medium">
                          {selectedDate.toDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Return:</span>
                        <span className="font-medium">
                          {new Date(
                            selectedDate.getTime() +
                              (selectedPackage.duration - 1) * 864e5
                          ).toDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-zinc-200 overflow-hidden bg-white">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="p-1.5 bg-white/10 rounded">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Package Price:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedPackage.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Duration:</span>
                    <span className="font-medium">
                      {selectedPackage.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Per Day Cost:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        selectedPackage.price / selectedPackage.duration
                      )}
                    </span>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center text-base font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-zinc-900">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>
                <Button
                  className="w-full h-11 text-sm font-semibold bg-black hover:bg-zinc-900 text-white"
                  disabled={!selectedDate || isBookingLoading}
                  onClick={handleBooking}
                >
                  {isBookingLoading && (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  )}
                  <CreditCard className="h-5 w-5 mr-2" />
                  Book This Package
                </Button>
                {!selectedDate && (
                  <p className="text-xs text-zinc-600 text-center">
                    Please select a travel date to proceed
                  </p>
                )}
                {bookingError && (
                  <p className="text-xs text-zinc-700 text-center" role="alert">
                    {bookingError}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-zinc-200 overflow-hidden bg-white">
              <CardHeader className="bg-black text-white p-4">
                <CardTitle className="text-base">Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {[
                  {
                    text: `${
                      selectedPackage.hotels?.length || 0
                    } Premium Hotels`,
                    icon: <Building className="h-4 w-4" />,
                  },
                  {
                    text: `${
                      selectedPackage.activities?.length || 0
                    } Exciting Activities`,
                    icon: <Activity className="h-4 w-4" />,
                  },
                  {
                    text: `${selectedPackage.duration} Days Adventure`,
                    icon: <Clock className="h-4 w-4" />,
                  },
                  {
                    text: "All Meals Included",
                    icon: <Utensils className="h-4 w-4" />,
                  },
                ].map((highlight, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded bg-zinc-50 hover:bg-zinc-100 transition-colors"
                  >
                    <div className="p-1.5 bg-white rounded border border-zinc-200 text-zinc-800">
                      {highlight.icon}
                    </div>
                    <span className="font-medium text-sm">
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
