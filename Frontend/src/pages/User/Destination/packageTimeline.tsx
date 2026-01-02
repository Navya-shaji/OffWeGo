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
  Loader2,
  Star,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Timer,
  Navigation,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/profile/navbar";
import type { Package } from "@/interface/PackageInterface";
import FlightSearchModal from "@/pages/Vendors/flightModal";
import { PackageReviews } from "./PackageReviews";
import type { Flight } from "@/interface/flightInterface";





export const PackageTimeline = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage as Package;
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});


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
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">
        <div className="text-center space-y-6 p-8">
          <div className="w-24 h-24 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-teal-200 flex items-center justify-center mx-auto shadow-xl">
            <MapPin className="w-12 h-12 text-teal-500" />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-gray-800">
              Package Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              The package you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <Button
            onClick={() => navigate(-1)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 rounded-2xl transition-all shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/40">
      <Navbar />

      <header className="relative overflow-hidden h-[500px] rounded-b-[4rem] shadow-2xl">
        {selectedPackage.images && selectedPackage.images.length > 0 && selectedPackage.images[0] ? (
          <>
            <div className="absolute inset-0">
              <img
                src={selectedPackage.images[0]}
                alt="Package hero"
                className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 via-transparent to-cyan-900/20"></div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500">
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10"></div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col">
          <div className="flex items-start justify-between gap-4 pt-8 mb-auto">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/95 backdrop-blur-md border-0 text-gray-700 hover:bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="bg-white/95 backdrop-blur-md border-0 text-gray-700 hover:bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
              
              </Button>
            </div>
          </div>

          <div className="max-w-4xl pb-16 animate-fade-in-up">
            <div>
              <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl tracking-tight">
                {selectedPackage.packageName}
              </h1>
              <p className="text-xl text-white/95 leading-relaxed drop-shadow-lg max-w-3xl">
                {selectedPackage.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <MapPin className="h-5 w-5" />
                  </div>
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    {
                      icon: <Clock className="text-blue-500" />,
                      label: "Duration",
                      value: `${selectedPackage.duration} Days`,
                      bg: "bg-blue-50",
                    },
                    {
                      icon: <Building className="text-purple-500" />,
                      label: "Hotels",
                      value: selectedPackage.hotels?.length || 0,
                      bg: "bg-purple-50",
                    },
                    {
                      icon: <Activity className="text-rose-500" />,
                      label: "Activities",
                      value: selectedPackage.activities?.length || 0,
                      bg: "bg-rose-50",
                    },
                    {
                      icon: <CreditCard className="text-emerald-500" />,
                      label: "Total Price",
                      value: formatCurrency(selectedPackage.price),
                      bg: "bg-emerald-50",
                    },
                  ].map(({ icon, label, value, bg }, i) => (
                    <div
                      key={i}
                      className={`${bg} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:scale-110 hover:-translate-y-1 border border-white/50`}
                    >
                      <div className="h-12 w-12 mx-auto mb-4 flex items-center justify-center bg-white/60 rounded-xl backdrop-blur-sm">
                        {icon}
                      </div>
                      <div className="font-bold text-lg text-gray-800 mb-1">
                        {value}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">{label}</div>
                    </div>
                  ))}
                  
                  {/* Flight Option Badge */}
                  {selectedPackage.flightOption && (
                    <div className="col-span-2 md:col-span-4 mt-4">
                      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border-2 border-sky-200 flex items-center gap-4">
                        <div className="h-14 w-14 flex items-center justify-center bg-sky-100 rounded-xl">
                          <Plane className="h-7 w-7 text-sky-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-5 w-5 text-sky-600" />
                            <h3 className="text-lg font-bold text-gray-800">Flight Included</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            This package includes flight booking option. You can search and book flights when making your reservation.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {selectedPackage.images && selectedPackage.images.length > 0 && (
                  <div className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      <Camera className="h-5 w-5 text-teal-500" />
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative group overflow-hidden rounded-2xl">
                        <img
                          src={selectedPackage.images[currentImageIndex] || selectedPackage.images[0]}
                          alt={`Gallery image ${(currentImageIndex || 0) + 1}`}
                          className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute bottom-3 left-3 text-white bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-semibold">
                          Image {(currentImageIndex || 0) + 1} of {selectedPackage.images.length}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPackage.images.slice(1, 5).map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group overflow-hidden rounded-2xl"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${idx + 2}`}
                              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
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
              <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  <CardTitle className="flex items-center gap-3 text-xl relative z-10">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="block text-xl font-bold">
                        Your Journey Awaits
                      </span>
                      <span className="block text-sm text-white/90 font-normal mt-0.5">
                        Day-by-day adventure guide
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-8">
                  {(selectedPackage.checkInTime || selectedPackage.checkOutTime) && (
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100/50">
                      <h4 className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 rounded-xl">
                          <Timer className="w-5 h-5 text-white" />
                        </div>
                        Check-in & Check-out Schedule
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedPackage.checkInTime && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200/50 shadow-sm">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="font-semibold text-gray-700 text-sm">
                              Check-in:
                            </span>
                            <span className="font-bold text-gray-900">
                              {selectedPackage.checkInTime}
                            </span>
                          </div>
                        )}
                        {selectedPackage.checkOutTime && (
                          <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-rose-200/50 shadow-sm">
                            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                            <span className="font-semibold text-gray-700 text-sm">
                              Check-out:
                            </span>
                            <span className="font-bold text-gray-900">
                              {selectedPackage.checkOutTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
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
                              className="border-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              <CardHeader 
                                className="bg-gradient-to-r from-gray-50 via-blue-50 to-cyan-50 p-5 cursor-pointer hover:from-blue-100 hover:via-cyan-100 hover:to-teal-100 transition-all duration-300 border-b border-gray-100"
                                onClick={() => toggleDay(dayNum)}
                              >
                                <div className="flex items-center justify-between">
                                  <CardTitle className="flex items-center gap-3">
                                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                                      {day}
                                    </div>
                                    <div>
                                      <span className="block text-lg font-bold text-gray-800">
                                        Day {day}
                                      </span>
                                      <div className="flex items-center gap-2 mt-0.5 text-sm text-gray-600">
                                        <Activity className="w-4 h-4" />
                                        {activities.length} activities planned
                                      </div>
                                    </div>
                                  </CardTitle>
                                  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
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
                                <CardContent className="p-5 bg-white">
                                  <div className="space-y-3 relative">
                                    {activities
                                      .sort((a, b) =>
                                        a.time && b.time
                                          ? a.time.localeCompare(b.time)
                                          : 0
                                      )
                                      .map((activity, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-3 p-5 bg-gradient-to-br from-gray-50 via-blue-50/50 to-cyan-50/30 rounded-xl border border-gray-100 relative hover:from-blue-100 hover:via-cyan-100 hover:to-teal-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                                        >
                                          {idx !== activities.length - 1 && (
                                            <div className="absolute left-[2.65rem] top-16 w-0.5 h-[calc(100%+0.75rem)] bg-gray-200"></div>
                                          )}
                                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white rounded-xl z-10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                                            <Clock className="w-5 h-5" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="inline-block px-2.5 py-1 mb-2 text-xs font-bold bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700">
                                              {activity.time || "Flexible Timing"}
                                            </span>
                                            <h5 className="text-base font-bold text-gray-800 mb-0.5">
                                              {activity.activity}
                                            </h5>
                                            <p className="text-sm text-gray-600">
                                              Enjoy this scheduled activity
                                            </p>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-3" />
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

            {/* Reviews Section */}
            {selectedPackage?.packageName && (
              <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  <CardTitle className="flex items-center gap-3 text-xl relative z-10">
                    <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Star className="h-6 w-6 fill-white" />
                    </div>
                    <div>
                      <span className="block text-xl font-bold">
                        Customer Reviews
                      </span>
                      <span className="block text-sm text-white/90 font-normal mt-0.5">
                        See what travelers are saying about this package
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <PackageReviews packageName={selectedPackage.packageName} />
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              {selectedPackage.hotels && selectedPackage.hotels.length > 0 && (
                <Card className="bg-white border-0 rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 border-b border-purple-100/50">
                    <CardTitle className="flex items-center gap-3 text-base text-gray-800 font-bold">
                      <Building className="h-5 w-5 text-purple-500" />
                      Premium Hotels
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3">
                    {selectedPackage.hotels.map((hotel, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl border border-gray-100 hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-gray-800 mb-0.5">
                            {hotel.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-1.5">
                            {hotel.address}
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(Math.floor(hotel.rating))].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 text-amber-400 fill-amber-400"
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1 font-semibold">
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
                <Card className="bg-white border-0 rounded-3xl overflow-hidden shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-rose-50 to-orange-50 p-5 border-b border-rose-100/50">
                    <CardTitle className="flex items-center gap-3 text-base font-bold text-gray-800">
                      <Activity className="h-5 w-5 text-rose-500" />
                      Exciting Activities
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 space-y-3">
                    {selectedPackage.activities.map((act, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gradient-to-br from-gray-50 to-rose-50/30 rounded-2xl border border-gray-100 hover:from-rose-50 hover:to-orange-50 transition-all duration-300"
                      >
                        <div className="w-2 h-14 bg-rose-500 rounded-full flex-shrink-0"></div>

                        <div className="flex-1 min-w-0">
                          <div className="text-base font-bold text-gray-800 mb-0.5">
                            {act.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {act.description}
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-rose-100 rounded-full text-rose-500 font-bold border-2 border-rose-200">
                          <Activity className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
                <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-emerald-50 to-teal-50 text-gray-800 p-5 border-b border-emerald-100/50">
                    <CardTitle className="flex items-center gap-3 text-base font-bold">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      What's Included
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="space-y-2.5">
                      {selectedPackage.inclusions.map((inc, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-emerald-50/30 rounded-xl border border-gray-100 hover:from-emerald-50 hover:to-teal-50 transition-colors">
                          <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedPackage.amenities && selectedPackage.amenities.length > 0 && (
                <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-lg">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 p-5 border-b border-blue-100/50">
                    <CardTitle className="flex items-center gap-3 text-base font-bold">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      Premium Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="space-y-2.5">
                      {selectedPackage.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:from-blue-50 hover:to-cyan-50 transition-colors">
                          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0" />
                          <span className="text-gray-700 font-medium text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 text-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <CardTitle className="flex items-center gap-3 text-base font-semibold relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  Select Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 text-sm font-medium bg-gradient-to-br from-gray-50 to-white hover:border-teal-300"
                />
              </CardContent>
            </Card>

            <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <CardTitle className="flex items-center gap-3 text-base font-semibold relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium text-sm">
                      Package Price:
                    </span>
                    <span className="font-bold text-base">
                      {formatCurrency(selectedPackage.price)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                    <span className="text-gray-700 font-medium text-sm">
                      Duration:
                    </span>
                    <span className="font-bold text-sm">
                      {selectedPackage.duration} days
                    </span>
                  </div>
                </div>

                <Separator className="my-4 border-gray-200" />

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl text-white shadow-md">
                  <span className="font-bold text-base">Total Amount:</span>
                  <span className="font-bold text-xl">
                    {formatCurrency(selectedPackage.price)}
                  </span>
                </div>

                <Button
                  className="w-full h-14 text-base font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 text-white transition-all duration-300 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={!selectedDate || isBookingLoading}
                  onClick={handleBooking}
                >
                  {isBookingLoading && (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  )}
                  <CreditCard className="h-5 w-5 mr-2" />
                  Book This Package
                </Button>

                {!selectedDate && (
                  <p className="text-sm text-gray-600 text-center bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Please select a travel date to proceed with booking
                  </p>
                )}
                {bookingError && (
                  <p
                    className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-xl border border-red-200"
                    role="alert"
                  >
                    {bookingError}
                  </p>
                )}
              </CardContent>
            </Card>

         
            <Card className="border-0 overflow-hidden bg-white rounded-3xl shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-5">
                <CardTitle className="text-base font-semibold">Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                {[
                  {
                    text: `${selectedPackage.hotels?.length || 0} Premium Hotels`,
                    icon: <Building className="h-4 w-4" />,
                    bg: "bg-gradient-to-br from-purple-50 to-pink-50",
                    color: "text-purple-500",
                  },
                  {
                    text: `${selectedPackage.activities?.length || 0} Exciting Activities`,
                    icon: <Activity className="h-4 w-4" />,
                    bg: "bg-gradient-to-br from-rose-50 to-orange-50",
                    color: "text-rose-500",
                  },
                  {
                    text: `${selectedPackage.duration} Days Adventure`,
                    icon: <Clock className="h-4 w-4" />,
                    bg: "bg-gradient-to-br from-blue-50 to-cyan-50",
                    color: "text-blue-500",
                  },
                  {
                    text: "All Meals Included",
                    icon: <Utensils className="h-4 w-4" />,
                    bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
                    color: "text-emerald-500",
                  },
                ].map((highlight, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3.5 rounded-xl ${highlight.bg} hover:shadow-md transition-all duration-300 border border-gray-100`}
                  >
                    <div className={`${highlight.color}`}>
                      {highlight.icon}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">
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