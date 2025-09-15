"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Clock,
  Building,
  Activity,
  Camera,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Utensils,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/profile/navbar";
import type { Package } from "@/interface/PackageInterface";

export const PackageTimeline = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage as Package;

  const userId = useSelector((state: any) => state?.auth?.user?.id);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  useEffect(() => {
    if (selectedPackage) {
      console.log("Selected package:", selectedPackage);
    }
  }, [selectedPackage]);

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
            {selectedPackage.itinerary &&
              selectedPackage.itinerary.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="p-1.5 bg-black rounded text-white">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    Itinerary Details
                  </h3>

                  <div className="space-y-4">
                    {selectedPackage.itinerary.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-black text-white rounded-full font-bold">
                          {item.day}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-600">{item.time}</p>
                          <p className="font-medium text-zinc-900">
                            {item.activity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            {/* Itinerary */}
            {selectedPackage.itinerary &&
              selectedPackage.itinerary.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="p-1.5 bg-black rounded text-white">
                      <Clock className="h-5 w-5" />
                    </div>
                    Itinerary
                  </h3>
                  <div className="space-y-2">
                    {selectedPackage.itinerary.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-zinc-200 rounded-lg bg-zinc-50"
                      >
                        <div className="text-sm font-semibold">
                          Day {item.day}
                        </div>
                        <div className="text-xs text-zinc-600">
                          Time: {item.time}
                        </div>
                        <div className="text-sm mt-1">{item.activity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {selectedPackage.hotels && selectedPackage.hotels.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Hotels</h3>
                {selectedPackage.hotels.map((hotel, idx) => (
                  <div key={idx} className="text-sm">
                    {hotel.name} - {hotel.address} ({hotel.rating}★)
                  </div>
                ))}
              </div>
            )}

            {selectedPackage.activities &&
              selectedPackage.activities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Activities</h3>
                  {selectedPackage.activities.map((act, idx) => (
                    <div key={idx} className="text-sm">
                      {act.title} - {act.description}
                    </div>
                  ))}
                </div>
              )}

            {selectedPackage.inclusions &&
              selectedPackage.inclusions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Inclusions</h3>
                  <ul className="list-disc ml-5">
                    {selectedPackage.inclusions.map((inc, idx) => (
                      <li key={idx}>{inc}</li>
                    ))}
                  </ul>
                </div>
              )}

            {selectedPackage.amenities &&
              selectedPackage.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Amenities</h3>
                  <ul className="list-disc ml-5">
                    {selectedPackage.amenities.map((amenity, idx) => (
                      <li key={idx}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Amenities */}
            {selectedPackage.amenities &&
              selectedPackage.amenities.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="p-1.5 bg-black rounded text-white">🛎️</div>
                    Amenities
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-zinc-700">
                    {selectedPackage.amenities.map((am, i) => (
                      <li key={i}>{am}</li>
                    ))}
                  </ul>
                </div>
              )}

          
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
