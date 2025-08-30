"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
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
  Wifi,
  Car,
  Utensils,
  Shield,
  CheckCircle,
  Heart,
  Share2,
  Loader2,
  Coffee,
  Sun,
  Moon,
  Sunset,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/profile/navbar"
import type { Package } from "@/interface/PackageInterface"

// Enhanced itinerary data structure
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
          type: "transport"
        },
        {
          time: "12:00 PM",
          activity: "Hotel Check-in",
          description: "Check into your premium accommodation",
          icon: <Building className="h-4 w-4" />,
          type: "accommodation"
        },
        {
          time: "2:00 PM",
          activity: "Welcome Lunch",
          description: "Traditional welcome meal at hotel restaurant",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal"
        },
        {
          time: "4:00 PM",
          activity: "City Orientation Tour",
          description: "Brief orientation and local area familiarization",
          icon: <MapPin className="h-4 w-4" />,
          type: "activity"
        },
        {
          time: "7:00 PM",
          activity: "Dinner & Rest",
          description: "Dinner at hotel and free time to rest",
          icon: <Moon className="h-4 w-4" />,
          type: "meal"
        }
      ]
    }
  ]

  // Generate middle days with activities
  for (let i = 2; i < packageData.duration; i++) {
    const activitiesForDay = packageData.activities.slice(
      Math.floor((i - 2) * packageData.activities.length / Math.max(1, packageData.duration - 2)),
      Math.floor((i - 1) * packageData.activities.length / Math.max(1, packageData.duration - 2))
    )

    baseItinerary.push({
      day: i,
      title: `Adventure Day ${i - 1}`,
      schedule: [
        {
          time: "7:00 AM",
          activity: "Breakfast",
          description: "Continental breakfast at hotel",
          icon: <Coffee className="h-4 w-4" />,
          type: "meal"
        },
        {
          time: "9:00 AM",
          activity: activitiesForDay[0]?.title || "Morning Activity",
          description: activitiesForDay[0]?.description || "Exciting morning adventure",
          icon: <Sun className="h-4 w-4" />,
          type: "activity"
        },
        {
          time: "1:00 PM",
          activity: "Lunch Break",
          description: "Local cuisine at recommended restaurant",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal"
        },
        {
          time: "3:00 PM",
          activity: activitiesForDay[1]?.title || "Afternoon Activity",
          description: activitiesForDay[1]?.description || "Afternoon exploration",
          icon: <Activity className="h-4 w-4" />,
          type: "activity"
        },
        {
          time: "6:00 PM",
          activity: "Evening Leisure",
          description: "Free time for shopping or relaxation",
          icon: <Sunset className="h-4 w-4" />,
          type: "leisure"
        },
        {
          time: "8:00 PM",
          activity: "Dinner",
          description: "Traditional dinner with local specialties",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal"
        }
      ]
    })
  }

  // Last day - departure
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
          type: "meal"
        },
        {
          time: "10:00 AM",
          activity: "Last Minute Shopping",
          description: "Souvenir shopping and local market visit",
          icon: <Activity className="h-4 w-4" />,
          type: "activity"
        },
        {
          time: "12:00 PM",
          activity: "Farewell Lunch",
          description: "Final meal together before departure",
          icon: <Utensils className="h-4 w-4" />,
          type: "meal"
        },
        {
          time: "3:00 PM",
          activity: "Airport Drop-off",
          description: "Transfer to airport for departure",
          icon: <Car className="h-4 w-4" />,
          type: "transport"
        }
      ]
    })
  }

  return baseItinerary.map(day => ({
    ...day,
    hotel: packageData.hotels[Math.floor(Math.random() * packageData.hotels.length)]
  }))
}

export const PackageTimeline = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const selectedPackage = state?.selectedPackage as Package

  const userId = useSelector((state: RootState) => state.auth.user?.id)

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPackage) navigate(-1)
  }, [selectedPackage, navigate])

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Package Not Found</h2>
          <p className="text-gray-600">The package you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r bg-black text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)

  const detailedItinerary = createDetailedItinerary(selectedPackage)

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "meal":
        return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" }
      case "activity":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" }
      case "transport":
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" }
      case "accommodation":
        return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" }
      case "leisure":
        return { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" }
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700" }
    }
  }

  const handleBooking = async () => {
    if (!userId) {
      setBookingError("User not logged in. Please log in to book a package.")
      return
    }
    if (!selectedDate) {
      setBookingError("Please select a travel date.")
      return
    }

    setIsBookingLoading(true)
    setBookingError(null)

    try {
      navigate("/booking", {
        state: {
          selectedPackage,
        },
      })
      alert("success")
    } catch (error) {
      if (error instanceof Error) {
        console.error("Booking failed:", error)
        setBookingError(error.message || "Failed to book package. Please try again.")
      } else {
        console.error("Booking failed:", error)
        setBookingError("Failed to book package. Please try again.")
      }
    } finally {
      setIsBookingLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-black hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-black hover:bg-white/30 transition-all duration-300"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-black hover:bg-white/30 transition-all duration-300"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-black">
              <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">{selectedPackage.packageName}</h1>
              <p className="text-xl mb-6 max-w-2xl drop-shadow-md">{selectedPackage.description}</p>
              <div className="flex items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{selectedPackage.duration} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (124 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r bg-black text-white p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                  Package Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      icon: <Clock className="text-blue-600" />,
                      label: "Duration",
                      value: `${selectedPackage.duration} Days`,
                      bg: "bg-blue-50",
                      border: "border-blue-200",
                    },
                    {
                      icon: <Building className="text-green-600" />,
                      label: "Hotels",
                      value: selectedPackage.hotels?.length || 0,
                      bg: "bg-green-50",
                      border: "border-green-200",
                    },
                    {
                      icon: <Activity className="text-purple-600" />,
                      label: "Activities",
                      value: selectedPackage.activities?.length || 0,
                      bg: "bg-purple-50",
                      border: "border-purple-200",
                    },
                    {
                      icon: <CreditCard className="text-orange-600" />,
                      label: "Total Price",
                      value: formatCurrency(selectedPackage.price),
                      bg: "bg-orange-50",
                      border: "border-orange-200",
                    },
                  ].map(({ icon, label, value, bg, border }, i) => (
                    <div
                      key={i}
                      className={`text-center p-6 rounded-xl ${bg} ${border} border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                    >
                      <div className="h-8 w-8 mx-auto mb-3 flex items-center justify-center">{icon}</div>
                      <div className="font-bold text-lg text-gray-800">{value}</div>
                      <div className="text-sm text-gray-600 mt-1">{label}</div>
                    </div>
                  ))}
                </div>

                {selectedPackage.images?.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                      <div className="p-2 bg-gradient-to-r bg-black rounded-lg">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={selectedPackage.images[currentImageIndex] || "/placeholder.svg"}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium">
                            Image {currentImageIndex + 1} of {selectedPackage.images.length}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPackage.images.slice(0, 4).map((img, i) => (
                          <div
                            key={i}
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => setCurrentImageIndex(i)}
                          >
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Thumbnail ${i + 1}`}
                              className={`w-full h-32 object-cover transition-all duration-300 ${
                                i === currentImageIndex
                                  ? "ring-4 ring-blue-500 scale-105"
                                  : "hover:scale-105 hover:brightness-110"
                              }`}
                            />
                            {i === currentImageIndex && <div className="absolute inset-0 bg-blue-500/20" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">What's Included</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <Wifi className="h-5 w-5" />, label: "Free WiFi" },
                      { icon: <Car className="h-5 w-5" />, label: "Transport" },
                      { icon: <Utensils className="h-5 w-5" />, label: "All Meals" },
                      { icon: <Shield className="h-5 w-5" />, label: "Insurance" },
                    ].map((amenity, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="text-green-600">{amenity.icon}</div>
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r bg-black text-white p-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                  Detailed Daily Itinerary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {detailedItinerary.map((day, dayIndex) => (
                  <div key={day.day} className="relative group">
                    {dayIndex < detailedItinerary.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-blue-400 to-purple-400 opacity-30"></div>
                    )}
                    
                    <div className="flex gap-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {day.day}
                        </div>
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <h3 className="font-bold text-2xl mb-4 text-gray-800">
                            Day {day.day}: {day.title}
                          </h3>
                          
                          {/* Hotel Information */}
                          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-gray-800">{day.hotel.name}</span>
                              <div className="flex items-center gap-1">
                                {[...Array(Math.floor(day.hotel.rating))].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-sm text-gray-600 ml-1">({day.hotel.rating})</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">{day.hotel.address}</p>
                          </div>

                          {/* Detailed Schedule */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                              <Clock className="h-5 w-5 text-indigo-600" />
                              Daily Schedule
                            </h4>
                            
                            <div className="space-y-3">
                              {day.schedule.map((item, scheduleIndex) => {
                                const styles = getTypeStyles(item.type)
                                return (
                                  <div
                                    key={scheduleIndex}
                                    className={`flex items-start gap-4 p-4 rounded-lg ${styles.bg} ${styles.border} border-2 hover:shadow-md transition-all duration-200`}
                                  >
                                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                      <div className={`p-2 bg-white rounded-lg shadow-sm ${styles.text}`}>
                                        {item.icon}
                                      </div>
                                      <span className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded-full">
                                        {item.time}
                                      </span>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-gray-800 mb-1">{item.activity}</h5>
                                      <p className="text-sm text-gray-600">{item.description}</p>
                                      <div className="mt-2">
                                        <span className={`inline-block px-2 py-1 text-xs font-medium ${styles.text} bg-white rounded-full capitalize`}>
                                          {item.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* Daily Summary */}
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                              <div>
                                <div className="font-semibold text-orange-600">
                                  {day.schedule.filter(s => s.type === 'meal').length}
                                </div>
                                <div className="text-xs text-gray-600">Meals</div>
                              </div>
                              <div>
                                <div className="font-semibold text-green-600">
                                  {day.schedule.filter(s => s.type === 'activity').length}
                                </div>
                                <div className="text-xs text-gray-600">Activities</div>
                              </div>
                              <div>
                                <div className="font-semibold text-blue-600">
                                  {day.schedule.filter(s => s.type === 'transport').length}
                                </div>
                                <div className="text-xs text-gray-600">Transfers</div>
                              </div>
                              <div>
                                <div className="font-semibold text-purple-600">1</div>
                                <div className="text-xs text-gray-600">Hotel</div>
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
            <Card className="shadow-xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm sticky top-6">
              <CardHeader className="bg-gradient-to-r bg-black text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  Select Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                  />
                </div>
                {selectedDate && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Departure:</span>
                        <span className="font-semibold text-gray-800">{selectedDate.toDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(selectedDate.getTime() + (selectedPackage.duration - 1) * 864e5).toDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r bg-black text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  Price Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Package Price:</span>
                    <span className="font-semibold">{formatCurrency(selectedPackage.price)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{selectedPackage.duration} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Per Day Cost:</span>
                    <span className="font-semibold">{formatCurrency(selectedPackage.price / selectedPackage.duration)}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-green-600">{formatCurrency(selectedPackage.price)}</span>
                </div>
                <Button
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={!selectedDate || isBookingLoading}
                  onClick={handleBooking}
                >
                  {isBookingLoading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                  <CreditCard className="h-6 w-6 mr-3" />
                  Book This Package
                </Button>
                {!selectedDate && (
                  <p className="text-sm text-gray-500 text-center mt-2">Please select a travel date to proceed</p>
                )}
                {bookingError && (
                  <p className="text-sm text-red-500 text-center mt-2" role="alert">
                    {bookingError}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r bg-black text-white p-6">
                <CardTitle>Package Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {[
                  {
                    color: "green",
                    text: `${selectedPackage.hotels?.length || 0} Premium Hotels`,
                    icon: <Building className="h-4 w-4" />,
                  },
                  {
                    color: "blue",
                    text: `${selectedPackage.activities?.length || 0} Exciting Activities`,
                    icon: <Activity className="h-4 w-4" />,
                  },
                  {
                    color: "purple",
                    text: `${selectedPackage.duration} Days Adventure`,
                    icon: <Clock className="h-4 w-4" />,
                  },
                  {
                    color: "orange",
                    text: "All Meals Included",
                    icon: <Utensils className="h-4 w-4" />,
                  },
                ].map((highlight, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className={`p-2 bg-${highlight.color}-100 rounded-lg text-${highlight.color}-600`}>
                      {highlight.icon}
                    </div>
                    <span className="font-medium text-gray-800">{highlight.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trip Planning Tips */}
            <Card className="shadow-xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  Travel Tips & Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid gap-4">
                  {[
                    "Pack comfortable walking shoes for daily activities",
                    "Bring weather-appropriate clothing for the season",
                    "Keep important documents in easily accessible location",
                    "Carry a power bank for your electronic devices",
                    "Follow local customs and respect cultural guidelines"
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 