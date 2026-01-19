import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Building, CalendarDays,
  CreditCard, CheckCircle,
  Star, Sun, Camera, ChevronDown,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/home/navbar/Header";
import type { Package, Itinerary } from "@/interface/PackageInterface";
import type { IReview } from "@/interface/reviews";
import FlightSearchModal from "@/pages/Vendors/flightModal";
import { PackageReviews } from "./PackageReviews";
import type { Flight } from "@/interface/flightInterface";
import { motion, AnimatePresence } from "framer-motion";
import { allReviews } from "@/services/Reviews/reviewService";
import { getUserBookings } from "@/services/Booking/bookingService";
import { toast } from "react-toastify";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const PackageTimeline = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage as Package;

  // Calculate tomorrow's date to disable today in the date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [userBookings, setUserBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getUserBookings();
        setUserBookings(bookings || []);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };
    fetchBookings();
  }, []);

  // Review Stats
  const [avgRating, setAvgRating] = useState<string>("0.0");
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (selectedPackage?.packageName) {
          const data = await allReviews(selectedPackage.packageName);
          if (Array.isArray(data) && data.length > 0) {
            const sum = data.reduce((acc: number, r: IReview) => acc + r.rating, 0);
            setAvgRating((sum / data.length).toFixed(1));
            setReviewCount(data.length);
          }
        }
      } catch (e) {
        console.error("Failed to fetch specific summary ratings", e);
      }
    };
    fetchRating();
  }, [selectedPackage]);

  const toggleDay = (day: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

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

    // Double check for duplicate booking
    const isBooked = userBookings.some((booking: any) =>
      booking.selectedPackage?._id === selectedPackage._id &&
      new Date(booking.selectedDate).toDateString() === selectedDate.toDateString() &&
      booking.bookingStatus !== 'cancelled'
    );

    if (isBooked) {
      toast.error("You have already booked this package for this date!");
      setBookingError("You have already booked this package for this date!");
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
    navigate("/travaler-details", {
      state: {
        selectedPackage: {
          ...selectedPackage,
          price: selectedPackage.price,
          flightPrice: selectedFlight ? selectedFlight.price : 0,
        },
        flightOption,
        selectedFlight,
        selectedDate,
      },
    });
  };


  const groupedItinerary = useMemo(() => {
    if (!selectedPackage?.itinerary) return {};
    return (selectedPackage.itinerary as Itinerary[]).reduce((acc: Record<number, Itinerary[]>, item: Itinerary) => {
      if (!acc[item.day]) acc[item.day] = [];
      acc[item.day].push(item);
      return acc;
    }, {} as Record<number, Itinerary[]>);
  }, [selectedPackage?.itinerary]);

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-teal-50">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
            <MapPin className="w-12 h-12 text-teal-500" />
          </div>
          <h2 className="text-3xl font-bold text-teal-900">Package Not Found</h2>
          <Button onClick={() => navigate(-1)} className="bg-teal-600 hover:bg-teal-700 text-white rounded-full">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 pb-20">
      <Header forceSolid />

      {/* Parallax-style Hero */}
      <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0"
        >
          {selectedPackage.images && selectedPackage.images.length > 0 ? (
            <img src={selectedPackage.images[currentImageIndex]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-teal-900" />
          )}
          <div className="absolute inset-0 bg-teal-900/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </motion.div>

        <div className="absolute top-24 left-0 w-full px-6 flex justify-between items-start z-20">
          <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </Button>
          <div className="flex gap-2">

          </div>
        </div>

        <div className="absolute bottom-32 left-0 w-full px-6 z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500 text-white text-sm font-bold tracking-widest uppercase mb-4 shadow-lg shadow-teal-500/30">
              {selectedPackage.duration} Days Adventure
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl max-w-5xl mx-auto leading-tight">
              {selectedPackage.packageName}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Floating Info Bar */}
      <div className="relative z-30 -mt-20 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 items-center border-b-4 border-teal-500">
          {[
            { label: "Duration", value: `${selectedPackage.duration} Days`, icon: Clock, color: "text-blue-500" },
            { label: "Accommodation", value: `${selectedPackage.hotels?.length || 0} Hotels`, icon: Building, color: "text-purple-500" },
            { label: "Experiences", value: `${selectedPackage.activities?.length || 0} Activities`, icon: Camera, color: "text-rose-500" },
            { label: "Best Price", value: formatCurrency(selectedPackage.price), icon: CreditCard, color: "text-emerald-500" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4 border-r last:border-0 border-gray-100 pr-4">
              <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color} shadow-sm`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT CONTENT */}
        <div className="lg:col-span-8 space-y-16">

          {/* Gallery Strip */}
          {selectedPackage.images && selectedPackage.images.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Camera className="w-6 h-6 text-teal-500" /> Tour Gallery
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {selectedPackage.images.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl overflow-hidden cursor-pointer h-24 md:h-32 transition-all duration-300 ${currentImageIndex === idx ? 'ring-4 ring-teal-500 shadow-xl scale-105' : 'opacity-80 hover:opacity-100 hover:scale-105'}`}
                    onClick={() => setCurrentImageIndex(idx)}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ZigZag Itinerary */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-800 inline-block relative">
                Interactive Itinerary
                <div className="absolute -bottom-3 left-0 w-full h-1.5 bg-teal-500 rounded-full opacity-30"></div>
              </h2>
            </div>

            <div className="relative">
              {/* Center Line */}
              <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-teal-500 via-teal-200 to-slate-200 md:-ml-[1px]"></div>

              <div className="space-y-12">
                {Object.entries(groupedItinerary)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([day, activities], index) => {
                    const isEven = index % 2 === 0;
                    const dayNum = Number(day);
                    const isExpanded = expandedDays[dayNum];

                    return (
                      <div key={day} className={`relative flex flex-col md:flex-row items-start ${isEven ? 'md:flex-row-reverse' : ''} gap-8 md:gap-0`}>

                        {/* Date Bubble (Center) */}
                        <div className="absolute left-4 md:left-1/2 top-0 w-12 h-12 bg-teal-500 border-4 border-white shadow-xl rounded-full z-10 -ml-6 flex items-center justify-center text-white font-bold text-lg">
                          {day}
                        </div>

                        {/* Empty Space */}
                        <div className="hidden md:block w-1/2"></div>

                        {/* Content Card */}
                        <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-12">
                          <motion.div
                            initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden"
                          >
                            <div className={`absolute top-4 ${isEven ? 'md:-left-2 md:border-r-8 md:border-l-0 border-l-8 md:border-r-transparent border-l-transparent md:border-l-transparent' : 'md:-right-2 md:border-l-8 md:border-r-0 border-l-8 md:border-l-transparent border-l-transparent'} w-0 h-0 border-t-8 border-b-8 border-t-transparent border-b-transparent border-white hidden md:block`}></div>

                            {/* Toggle Title Bar */}
                            <div
                              onClick={() => toggleDay(dayNum)}
                              className="p-6 flex justify-between items-center cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                            >
                              <h3 className="text-xl font-bold text-gray-800">Day {day} Highlights</h3>
                              <div className={`p-2 rounded-full bg-teal-50 text-teal-600 transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-teal-100' : ''}`}>
                                <ChevronDown className="w-5 h-5" />
                              </div>
                            </div>

                            {/* Collapsible Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                  <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                                    {activities.map((act, i) => (
                                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-teal-200 hover:shadow-md transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs flex-shrink-0">
                                          {act.time || <Sun className="w-5 h-5" />}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                          <h4 className="font-bold text-gray-900 text-base">{act.activity}</h4>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Activities Grid */}
          {selectedPackage.activities?.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-rose-500 pl-4">Signature Experiences</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {selectedPackage.activities.map((act, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl p-3 shadow-lg border border-gray-100 flex gap-4 items-center"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 relative">
                      {act.imageUrl ? (
                        <img src={act.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-rose-50 text-rose-500"><Camera /></div>
                      )}
                    </div>
                    <div className="flex-1 pr-2">
                      <h4 className="font-bold text-gray-900 text-lg mb-1">{act.title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{act.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Hotels Grid */}
          {selectedPackage.hotels?.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-purple-500 pl-4">Premium Accommodations</h3>
              <div className="grid gap-6">
                {selectedPackage.hotels.map((hotel, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 h-48 bg-gray-200 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="w-10 h-10 text-gray-400" />
                      </div>
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {hotel.rating} Stars
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3 flex flex-col">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h4>
                      <p className="text-gray-500 flex items-center gap-2 mb-4"><MapPin className="w-4 h-4" /> {hotel.address}</p>
                      <div className="mt-auto flex gap-2">
                        {['Pool', 'Wifi', 'Spa'].map((tag, i) => (
                          <span key={i} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="pt-8 border-t border-gray-200">
            <PackageReviews packageName={selectedPackage.packageName} />
          </div>

        </div>

        {/* RIGHT SIDEBAR (Sticky) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-teal-100 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Trip Cost</p>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-4xl font-black text-teal-600">{formatCurrency(selectedPackage.price)}</span>
                  <span className="text-gray-500 mb-1">/ person</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase mb-2 block">Travel Date</label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-12 pr-4 py-6 bg-white border-2 border-slate-100 rounded-xl focus:border-teal-500 hover:bg-slate-50 text-left font-bold text-gray-700 justify-start h-auto",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={(date) => {
                              setSelectedDate(date || null);
                              setBookingError(null);
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              // Disable past dates and today (so limit is tomorrow)
                              if (date <= today) return true;

                              // Disable booked dates
                              return userBookings.some((booking: any) =>
                                booking.selectedPackage?._id === selectedPackage._id &&
                                new Date(booking.selectedDate).toDateString() === date.toDateString() &&
                                booking.bookingStatus !== 'cancelled'
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  disabled={!selectedDate || isBookingLoading}
                  className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all transform hover:-translate-y-1"
                >
                  Confirm Booking
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                  <CheckCircle className="w-3 h-3" /> Best Price Guarantee
                  <span className="mx-2">•</span>
                  <CheckCircle className="w-3 h-3" /> Secure Payment
                </div>

                {bookingError && <p className="text-center text-red-500 text-sm mt-4 font-bold">{bookingError}</p>}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500 rounded-full blur-[50px] opacity-20" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold">Why Book This?</h4>
                  {reviewCount > 0 && (
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-sm">{avgRating}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1">{reviewCount} Reviews</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3">
                  {selectedPackage.inclusions?.slice(0, 4).map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
          _id: selectedPackage._id
        }}
      />
    </div>
  );
};