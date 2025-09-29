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
  Star,
  Users,
  MapIcon,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Timer,
  Navigation,
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

  const userId = useSelector((state) => state?.auth?.user?.id);

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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto">
            <MapPin className="w-10 h-10 text-slate-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-800">
              Package Not Found
            </h2>
            <p className="text-lg text-slate-600 max-w-md">
              The package you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back Home
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <Navbar />

      <header className="relative overflow-hidden">
        {selectedPackage.images?.[0] && (
          <div className="absolute inset-0 h-96">
            <img
              src={selectedPackage.images[0]}
              alt="Package hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/90 backdrop-blur-sm border-white/20 text-slate-800 hover:bg-white shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-white/90 backdrop-blur-sm border-white/20 text-slate-800 hover:bg-white shadow-lg"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-slate-700"
                    }`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm border-white/20 text-slate-800 hover:bg-white shadow-lg"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Premium Package
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-black mb-4 leading-tight">
                {selectedPackage.packageName}
              </h1>
              <p className="text-xl text-black/90  leading-relaxed">
                {selectedPackage.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-15 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <MapPin className="h-6 w-6" />
                  </div>
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      icon: <Clock className="text-emerald-600" />,
                      label: "Duration",
                      value: `${selectedPackage.duration} Days`,
                      color: "from-emerald-500 to-emerald-600",
                    },
                    {
                      icon: <Building className="text-blue-600" />,
                      label: "Hotels",
                      value: selectedPackage.hotels?.length || 0,
                      color: "from-blue-500 to-blue-600",
                    },
                    {
                      icon: <Activity className="text-orange-600" />,
                      label: "Activities",
                      value: selectedPackage.activities?.length || 0,
                      color: "from-orange-500 to-orange-600",
                    },
                    {
                      icon: <CreditCard className="text-purple-600" />,
                      label: "Total Price",
                      value: formatCurrency(selectedPackage.price),
                      color: "from-purple-500 to-purple-600",
                    },
                  ].map(({ icon, label, value, color }, i) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200/50"
                    >
                      <div className="h-10 w-10 mx-auto mb-3 flex items-center justify-center">
                        {icon}
                      </div>
                      <div className="font-bold text-lg text-slate-800">
                        {value}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{label}</div>
                      <div
                        className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                      />
                    </div>
                  ))}
                </div>

                {selectedPackage.images?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white">
                        <Camera className="h-6 w-6" />
                      </div>
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                        <img
                          src={selectedPackage.images[currentImageIndex]}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="text-lg font-semibold">
                            Image {currentImageIndex + 1} of{" "}
                            {selectedPackage.images.length}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPackage.images.slice(1, 5).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group overflow-hidden rounded-xl shadow-md"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${idx + 2}`}
                              className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedPackage.itinerary &&
              selectedPackage.itinerary.length > 0 && (
                <Card className="shadow-2xl border-0 overflow-hidden bg-white/95 backdrop-blur-lg transform hover:scale-[1.01] transition-all duration-500">
                  <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
                    <CardTitle className="flex items-center gap-4 text-2xl">
                      <div className="p-3 bg-white/20 rounded-2xl">
                    <Navigation className="h-8 w-8" />
                      </div>
                      <div>
                        <span className="block text-2xl font-black">
                          Your Journey Awaits
                        </span>
                        <span className="block text-sm text-white/80 font-normal">
                          Day-by-day adventure guide
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10">
                    {(selectedPackage.checkInTime ||
                      selectedPackage.checkOutTime) && (
                      <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-3xl border-2 border-blue-200/50 shadow-lg">
                        <h4 className="font-black text-2xl text-slate-800 mb-6 flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-black to-black rounded-2xl flex items-center justify-center shadow-lg">
                            <Timer className="h-6 w-6 text-white" />
                          </div>
                          Check-in & Check-out Schedule
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {selectedPackage.checkInTime && (
                            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-green-200 shadow-md">
                              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-slate-700 text-lg">
                                Check-in:
                              </span>
                              <span className="font-black text-slate-900 text-xl">
                                {selectedPackage.checkInTime}
                              </span>
                            </div>
                          )}
                          {selectedPackage.checkOutTime && (
                            <div className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl border border-red-200 shadow-md">
                              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="font-bold text-slate-700 text-lg">
                                Check-out:
                              </span>
                              <span className="font-black text-slate-900 text-xl">
                                {selectedPackage.checkOutTime}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      {(() => {
                        const groupedItinerary =
                          selectedPackage.itinerary.reduce((acc, item) => {
                            if (!acc[item.day]) {
                              acc[item.day] = [];
                            }
                            acc[item.day].push(item);
                            return acc;
                          }, {} as Record<number, typeof selectedPackage.itinerary>);

                        return Object.entries(groupedItinerary)
                          .sort(([a], [b]) => Number(a) - Number(b))
                          .map(([day, activities]) => (
                            <Card
                              key={day}
                              className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm"
                            >
                              <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
                                <CardTitle className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl">
                                    {day}
                                  </div>
                                  <div>
                                    <span className="text-xl font-bold text-gray-900 block">
                                      Day {day}
                                    </span>
                                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                      <Activity className="w-4 h-4" />
                                      {activities.length} activities
                                    </div>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  {activities
                                    .sort((a, b) => {
                                      if (a.time && b.time) {
                                        return a.time.localeCompare(b.time);
                                      }
                                      return 0;
                                    })
                                    .map((activity, activityIndex) => (
                                      <div
                                        key={activityIndex}
                                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                      >
                                        {activityIndex !==
                                          activities.length - 1 && (
                                          <div className="absolute left-10 top-20 w-0.5 h-8 bg-gray-300"></div>
                                        )}

                                        <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 bg-black text-white rounded-lg">
                                          <Clock className="h-6 w-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-900 text-sm px-3 py-1 bg-gray-200 rounded-md">
                                              {activity.time || "Flexible"}
                                            </span>
                                          </div>
                                          <h5 className="font-semibold text-lg text-gray-900 leading-tight">
                                            {activity.activity}
                                          </h5>
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                      </div>
                                    ))}
                                </div>
                              </CardContent>
                            </Card>
                          ));
                      })()}
                    </div>
                  </CardContent>
                </Card>
              )}

            <div className="grid md:grid-cols-2 gap-6">
              {selectedPackage.hotels && selectedPackage.hotels.length > 0 && (
                <Card className="shadow-lg border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r bg-black text-white p-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5" />
                      Premium Hotels
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {selectedPackage.hotels.map((hotel, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                          <div>
                            <div className="font-semibold text-slate-800">
                              {hotel.name}
                            </div>
                            <div className="text-sm text-slate-600">
                              {hotel.address}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(Math.floor(hotel.rating))].map(
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                )
                              )}
                              <span className="text-xs text-slate-600 ml-1">
                                ({hotel.rating})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedPackage.activities &&
                selectedPackage.activities.length > 0 && (
                  <Card className="shadow-lg border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r bg-black text-white p-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5" />
                        Exciting Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {selectedPackage.activities.map((act, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-orange-50 rounded-xl"
                          >
                            <div className="font-semibold text-slate-800">
                              {act.title}
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              {act.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {selectedPackage.inclusions &&
                selectedPackage.inclusions.length > 0 && (
                  <Card className="shadow-lg border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r bg-black text-white p-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5" />
                        What's Included
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {selectedPackage.inclusions.map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-slate-700">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {selectedPackage.amenities &&
                selectedPackage.amenities.length > 0 && (
                  <Card className="shadow-lg border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r bg-black text-white p-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5" />
                        Premium Amenities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {selectedPackage.amenities.map((amenity, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0" />
                            <span className="text-slate-700">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>

       
          <div className="space-y-6">
          
            <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  Select Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300"
                />
                {selectedDate && (
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">
                          Departure:
                        </span>
                        <span className="font-bold text-slate-800">
                          {selectedDate.toDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">
                          Return:
                        </span>
                        <span className="font-bold text-slate-800">
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

        
            <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Package Price:
                    </span>
                    <span className="font-bold text-lg">
                      {formatCurrency(selectedPackage.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Duration:
                    </span>
                    <span className="font-bold">
                      {selectedPackage.duration} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600 font-medium">
                      Per Day Cost:
                    </span>
                    <span className="font-bold">
                      {formatCurrency(
                        selectedPackage.price / selectedPackage.duration
                      )}
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white">
                  <span className="font-bold text-lg">Total Amount:</span>
                  <span className="font-bold text-2xl">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                  disabled={!selectedDate || isBookingLoading}
                  onClick={handleBooking}
                >
                  {isBookingLoading && (
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  )}
                  <CreditCard className="h-6 w-6 mr-3" />
                  Book This Package
                </Button>

                {!selectedDate && (
                  <p className="text-sm text-slate-600 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    Please select a travel date to proceed with booking
                  </p>
                )}
                {bookingError && (
                  <p
                    className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-lg border border-red-200"
                    role="alert"
                  >
                    {bookingError}
                  </p>
                )}
              </CardContent>
            </Card>

          
            <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6">
                <CardTitle className="text-lg">Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  {
                    text: `${
                      selectedPackage.hotels?.length || 0
                    } Premium Hotels`,
                    icon: <Building className="h-5 w-5" />,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    text: `${
                      selectedPackage.activities?.length || 0
                    } Exciting Activities`,
                    icon: <Activity className="h-5 w-5" />,
                    color: "from-orange-500 to-orange-600",
                  },
                  {
                    text: `${selectedPackage.duration} Days Adventure`,
                    icon: <Clock className="h-5 w-5" />,
                    color: "from-emerald-500 to-emerald-600",
                  },
                  {
                    text: "All Meals Included",
                    icon: <Utensils className="h-5 w-5" />,
                    color: "from-purple-500 to-purple-600",
                  },
                ].map((highlight, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-all duration-300 hover:shadow-md border border-slate-200/50"
                  >
                    <div
                      className={`p-3 bg-gradient-to-r ${highlight.color} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {highlight.icon}
                    </div>
                    <span className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
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
