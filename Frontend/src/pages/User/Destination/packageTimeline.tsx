import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Loader2,
  Star,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Timer,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/profile/navbar";
import type { Package } from "@/interface/PackageInterface";
import FlightSearchModal from "@/pages/Vendors/flightModal";
import { PackageReviews } from "./PackageReviews";
import type { Flight } from "@/interface/flightInterface";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store"; 

import { ChatButton } from "@/components/chat/chatbutton";
import { ChatModal } from "../chat/chat";

export const PackageTimeline = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage as Package;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (selectedPackage) {
      console.log("Selected package:", selectedPackage);
    }
  }, [selectedPackage]);

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        <div className="text-center space-y-6 p-8">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center mx-auto">
            <MapPin className="w-10 h-10 text-slate-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-slate-900">
              Package Not Found
            </h2>
            <p className="text-lg text-slate-600 max-w-md">
              The package you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg transition-colors"
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
    if (!selectedDate) {
      setBookingError("Please select a travel date.");
      return;
    }

    if (selectedPackage.flightOption) {
      setShowFlightModal(true);
    } else {
      proceedToBooking(null);
    }
  };

  const proceedToBooking = (
    flightOption: "with-flight" | "without-flight" | null,
    selectedFlight?: Flight
  ) => {
    const basePackagePrice = selectedPackage.price;
    const flightPrice = selectedFlight ? selectedFlight.price : 0;
    console.log(selectedDate,"Date")
    
    navigate("/travaler-details", {
      state: {
        selectedPackage: {
          ...selectedPackage,
          price: basePackagePrice,
          flightPrice: flightPrice,
        },
        flightOption: flightOption,
        selectedFlight: selectedFlight,
        selectedDate: selectedDate,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <header className="relative overflow-hidden h-[500px]">
        {selectedPackage.images?.[0] && (
          <>
            <div className="absolute inset-0">
              <img
                src={selectedPackage.images[0]}
                alt="Package hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-white"></div>
            </div>
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col">
          <div className="flex items-start justify-between gap-4 pt-8 mb-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/90 backdrop-blur-sm border-white/50 text-slate-900 hover:bg-white rounded-full shadow-lg"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-white/90 backdrop-blur-sm border-white/50 text-slate-900 hover:bg-white rounded-full shadow-lg"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? "fill-rose-400 text-rose-400" : "text-slate-900"
                    }`}
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl pb-16">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4 leading-tight drop-shadow-sm">
                {selectedPackage.packageName}
              </h1>
              <p className="text-xl text-slate-800 leading-relaxed drop-shadow-sm">
                {selectedPackage.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <MapPin className="h-5 w-5" />
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      icon: <Clock className="text-blue-400" />,
                      label: "Duration",
                      value: `${selectedPackage.duration} Days`,
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <Building className="text-purple-400" />,
                      label: "Hotels",
                      value: selectedPackage.hotels?.length || 0,
                      bg: "bg-purple-50",
                    },
                    {
                      icon: <Activity className="text-rose-400" />,
                      label: "Activities",
                      value: selectedPackage.activities?.length || 0,
                      bg: "bg-rose-50",
                    },
                    {
                      icon: <CreditCard className="text-emerald-400" />,
                      label: "Total Price",
                      value: formatCurrency(selectedPackage.price),
                      bg: "bg-emerald-50",
                    },
                  ].map(({ icon, label, value, bg }, i) => (
                    <div
                      key={i}
                      className={`${bg} rounded-xl p-6 text-center transition-all hover:shadow-md border border-slate-100`}
                    >
                      <div className="h-10 w-10 mx-auto mb-3 flex items-center justify-center">
                        {icon}
                      </div>
                      <div className="font-bold text-lg text-slate-900">
                        {value}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {selectedPackage.images?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                      <Camera className="h-6 w-6 text-slate-600" />
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group overflow-hidden rounded-xl">
                        <img
                          src={selectedPackage.images[currentImageIndex]}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg text-sm font-semibold">
                          Image {currentImageIndex + 1} of {selectedPackage.images.length}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedPackage.images.slice(1, 5).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group overflow-hidden rounded-xl"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${idx + 2}`}
                              className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedPackage.itinerary && selectedPackage.itinerary.length > 0 && (
              <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
                <CardHeader className="bg-slate-900 text-white p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl">
                    <Navigation className="h-8 w-8" />
                    <div>
                      <span className="block text-2xl font-bold">
                        Your Journey Awaits
                      </span>
                      <span className="block text-sm text-white/80 font-normal">
                        Day-by-day adventure guide
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 md:p-10 space-y-12">
                  {(selectedPackage.checkInTime || selectedPackage.checkOutTime) && (
                    <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
                      <h4 className="flex items-center gap-4 text-2xl font-bold text-slate-900 mb-6">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-400 rounded-xl">
                          <Timer className="w-6 h-6 text-white" />
                        </div>
                        Check-in & Check-out Schedule
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedPackage.checkInTime && (
                          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-emerald-200">
                            <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                            <span className="font-semibold text-slate-700 text-lg">
                              Check-in:
                            </span>
                            <span className="font-bold text-slate-900 text-xl">
                              {selectedPackage.checkInTime}
                            </span>
                          </div>
                        )}
                        {selectedPackage.checkOutTime && (
                          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-rose-200">
                            <div className="w-4 h-4 bg-rose-400 rounded-full"></div>
                            <span className="font-semibold text-slate-700 text-lg">
                              Check-out:
                            </span>
                            <span className="font-bold text-slate-900 text-xl">
                              {selectedPackage.checkOutTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {(() => {
                      const groupedItinerary = selectedPackage.itinerary.reduce((acc, item) => {
                        if (!acc[item.day]) acc[item.day] = [];
                        acc[item.day].push(item);
                        return acc;
                      }, {} as Record<number, typeof selectedPackage.itinerary>);

                      return Object.entries(groupedItinerary)
                        .sort(([a], [b]) => Number(a) - Number(b))
                        .map(([day, activities]) => {
                          const dayNum = Number(day);
                          const isExpanded = expandedDays[dayNum];

                          return (
                            <Card
                              key={day}
                              className="border border-slate-200 rounded-2xl overflow-hidden"
                            >
                              <CardHeader 
                                className="bg-slate-50 p-6 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleDay(dayNum)}
                              >
                                <div className="flex items-center justify-between">
                                  <CardTitle className="flex items-center gap-4">
                                    <div className="w-14 h-14 flex items-center justify-center bg-slate-900 text-white rounded-xl font-bold text-xl">
                                      {day}
                                    </div>
                                    <div>
                                      <span className="block text-xl font-bold text-slate-900">
                                        Day {day}
                                      </span>
                                      <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                                        <Activity className="w-4 h-4" />
                                        {activities.length} activities planned
                                      </div>
                                    </div>
                                  </CardTitle>
                                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-6 h-6 text-slate-600" />
                                  </div>
                                </div>
                              </CardHeader>

                              <div 
                                className={`transition-all duration-500 ease-in-out ${
                                  isExpanded 
                                    ? 'max-h-[2000px] opacity-100' 
                                    : 'max-h-0 opacity-0 overflow-hidden'
                                }`}
                              >
                                <CardContent className="p-6 bg-white">
                                  <div className="space-y-4 relative">
                                    {activities
                                      .sort((a, b) =>
                                        a.time && b.time
                                          ? a.time.localeCompare(b.time)
                                          : 0
                                      )
                                      .map((activity, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 relative hover:bg-slate-100 transition-all duration-200"
                                        >
                                          {idx !== activities.length - 1 && (
                                            <div className="absolute left-[3.25rem] top-20 w-0.5 h-[calc(100%+1rem)] bg-slate-200"></div>
                                          )}
                                          <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-slate-900 text-white rounded-xl z-10">
                                            <Clock className="w-6 h-6" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="inline-block px-3 py-1.5 mb-2 text-xs font-bold bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700">
                                              {activity.time || "Flexible Timing"}
                                            </span>
                                            <h5 className="text-lg font-bold text-slate-900 mb-1">
                                              {activity.activity}
                                            </h5>
                                            <p className="text-sm text-slate-600">
                                              Enjoy this scheduled activity
                                            </p>
                                          </div>
                                          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-4" />
                                        </div>
                                      ))}
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          );
                        });
                    })()}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {selectedPackage.hotels && selectedPackage.hotels.length > 0 && (
                <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-purple-50 p-6 border-b border-purple-100">
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 font-bold">
                      <Building className="h-6 w-6 text-purple-400" />
                      Premium Hotels
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    {selectedPackage.hotels.map((hotel, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-slate-900 mb-1">
                            {hotel.name}
                          </div>
                          <div className="text-sm text-slate-600 mb-2">
                            {hotel.address}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-amber-400 fill-amber-400"
                              />
                            ))}
                            <span className="text-xs text-slate-500 ml-1 font-semibold">
                              ({hotel.rating})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {selectedPackage.activities && selectedPackage.activities.length > 0 && (
                <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <CardHeader className="bg-rose-50 p-6 border-b border-rose-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
                      <Activity className="h-6 w-6 text-rose-400" />
                      Exciting Activities
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 space-y-4">
                    {selectedPackage.activities.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
                      >
                        <div className="w-2 h-16 bg-rose-400 rounded-full flex-shrink-0"></div>

                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-slate-900 mb-1">
                            {act.title}
                          </div>
                          <div className="text-sm text-slate-600">
                            {act.description}
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-rose-50 rounded-full text-rose-400 font-bold border-2 border-rose-200">
                          <Activity className="h-5 w-5" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
                <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
                  <CardHeader className="bg-emerald-50 text-slate-900 p-6 border-b border-emerald-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold">
                      <CheckCircle className="h-6 w-6 text-emerald-400" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {selectedPackage.inclusions.map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-slate-700 font-medium">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedPackage.amenities && selectedPackage.amenities.length > 0 && (
                <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
                  <CardHeader className="bg-blue-50 text-slate-900 p-6 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-3 text-lg font-bold">
                      <Sparkles className="h-6 w-6 text-blue-400" />
                      Premium Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {selectedPackage.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                          <div className="w-3 h-3 bg-blue-400 rounded-full flex-shrink-0" />
                          <span className="text-slate-700 font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl sticky top-6">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <CalendarDays className="h-5 w-5" />
                  Select Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-300"
                />
              </CardContent>
            </Card>

            <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                  <CreditCard className="h-5 w-5" />
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
                </div>

                {selectedPackage?._id && (
                  <PackageReviews packageId={selectedPackage._id} />
                )}

                <Separator className="my-6 border-slate-200" />

                <div className="flex justify-between items-center p-4 bg-slate-900 rounded-xl text-white">
                  <span className="font-bold text-lg">Total Amount:</span>
                  <span className="font-bold text-2xl">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>

                <Button
                  className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 rounded-xl"
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
                  <p className="text-sm text-slate-600 text-center bg-amber-50 p-3 rounded-lg border border-amber-200">
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

            <ChatButton onClick={() => setIsChatOpen(true)} />

            <ChatModal
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
              currentUserId={currentUser?.id || ""}
              currentUserRole="user"
              vendorId={selectedPackage.vendorId || ""}
              packageName={selectedPackage.packageName}
            />

            <Card className="border border-slate-200 overflow-hidden bg-white rounded-2xl">
              <CardHeader className="bg-slate-900 text-white p-6">
                <CardTitle className="text-lg font-semibold">Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  {
                    text: `${selectedPackage.hotels?.length || 0} Premium Hotels`,
                    icon: <Building className="h-5 w-5" />,
                    bg: "bg-purple-50",
                    color: "text-purple-400",
                  },
                  {
                    text: `${selectedPackage.activities?.length || 0} Exciting Activities`,
                    icon: <Activity className="h-5 w-5" />,
                    bg: "bg-rose-50",
                    color: "text-rose-400",
                  },
                  {
                    text: `${selectedPackage.duration} Days Adventure`,
                    icon: <Clock className="h-5 w-5" />,
                    bg: "bg-blue-50",
                    color: "text-blue-400",
                  },
                  {
                    text: "All Meals Included",
                    icon: <Utensils className="h-5 w-5" />,
                    bg: "bg-emerald-50",
                    color: "text-emerald-400",
                  },
                ].map((highlight, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-xl ${highlight.bg} hover:shadow-md transition-all duration-300 border border-slate-100`}
                  >
                    <div className={`${highlight.color}`}>
                      {highlight.icon}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {highlight.text}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FlightSearchModal
        show={showFlightModal}
        onClose={() => setShowFlightModal(false)}
        onProceed={proceedToBooking}
        selectedDate={selectedDate} 
        selectedPackage={{
          price: selectedPackage.price,
          flightPrice: selectedPackage.flightPrice,
          packageName: selectedPackage.packageName,
          description: selectedPackage.description,
          images: selectedPackage.images,
          destinationId: selectedPackage.destinationId || "",
          hotels: selectedPackage.hotels || [],
          activities: selectedPackage.activities || [],
          flightOption: selectedPackage.flightOption,
          _id:selectedPackage._id
        }}
      />
    </div>
  );
};