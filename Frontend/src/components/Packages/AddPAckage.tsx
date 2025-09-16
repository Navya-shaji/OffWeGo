import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPackage } from "@/store/slice/packages/packageSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { 
  Plus, 
  MapPin, 
  FileText, 
  Clock, 
  Trash2, 
  Calendar,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { usePackageData } from "./usepackagedata"
import PackageBasicInfo from "./packagebasicInfo"
import ImageUploadSection from "./ImageUploadSection"
import HotelsActivitiesSection from "./HotelActivitySection"
import PricingSidebar from "./Pricing"
import type { PackageFormData } from "@/interface/packageFormData"

// Enhanced itinerary interface
interface ItineraryActivity {
  time: string
  activity: string
}

interface ItineraryDay {
  day: number
  activities: ItineraryActivity[]
  isExpanded?: boolean
}

// Updated PackageFormData interface
interface EnhancedPackageFormData extends Omit<PackageFormData, 'itinerary'> {
  itinerary: ItineraryDay[]
}

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.package)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { allHotels, allActivities, destinations, loadingHotels, loadingActivities, loadingDestinations } =
    usePackageData()

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
    amenities: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    }))
  }

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      destinationId: e.target.value,
    }))
  }

  // Enhanced itinerary management functions
  const addDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      activities: [{ time: "", activity: "" }],
      isExpanded: true
    }
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }))
  }

  const removeDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({ ...day, day: index + 1 }))
    }))
  }

  const toggleDayExpansion = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, isExpanded: !day.isExpanded } : day
      )
    }))
  }

  const addActivityToDay = (dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: [...day.activities, { time: "", activity: "" }] }
          : day
      )
    }))
  }

  const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: day.activities.filter((_, aIndex) => aIndex !== activityIndex) }
          : day
      )
    }))
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: 'time' | 'activity', value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, aIndex) =>
                aIndex === activityIndex ? { ...activity, [field]: value } : activity
              )
            }
          : day
      )
    }))
  }

  // Pre-fill itinerary based on duration
  const generateBasicItinerary = () => {
    const basicItinerary: ItineraryDay[] = []
    
    for (let i = 1; i <= formData.duration; i++) {
      let dayActivities: ItineraryActivity[] = []
      
      if (i === 1) {
        // First day - arrival activities
        dayActivities = [
          { time: formData.checkInTime || "3:00 PM", activity: "Check-in at hotel" },
          { time: "4:00 PM", activity: "Welcome drink" },
          { time: "5:00 PM", activity: "Local area exploration" },
          { time: "7:00 PM", activity: "Evening tea & snacks" },
          { time: "8:00 PM", activity: "Dinner" }
        ]
      } else if (i === formData.duration) {
        // Last day - departure activities
        dayActivities = [
          { time: "6:00 AM", activity: "Early morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Final sightseeing" },
          { time: formData.checkOutTime || "12:00 PM", activity: "Check-out" }
        ]
      } else {
        // Middle days - exploration activities
        dayActivities = [
          { time: "6:00 AM", activity: "Morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Sightseeing" },
          { time: "1:00 PM", activity: "Lunch" },
          { time: "3:00 PM", activity: "Afternoon activity" },
          { time: "7:00 PM", activity: "Evening activity" },
          { time: "8:00 PM", activity: "Dinner" }
        ]
      }
      
      basicItinerary.push({
        day: i,
        activities: dayActivities,
        isExpanded: true
      })
    }
    
    setFormData(prev => ({ ...prev, itinerary: basicItinerary }))
  }

  const calculateTotalPrice = () => {
    const hotelsCost = formData.selectedHotels.length * 2000 * formData.duration
    const activitiesCost = formData.selectedActivities.length * 1500
    return formData.price + hotelsCost + activitiesCost
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedHotelIds = formData.selectedHotels
    const selectedActivityIds = formData.selectedActivities

    // Convert enhanced itinerary back to simple format for backend compatibility
    const simpleItinerary = formData.itinerary.flatMap(day =>
      day.activities.map(activity => ({
        day: day.day,
        time: activity.time,
        activity: activity.activity
      }))
    )

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
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
      itinerary: simpleItinerary,
      inclusions: formData.inclusions,
      amenities: formData.amenities,
    }

    console.log("Complete package data:", completePackage)
    dispatch(addPackage(completePackage))
    setIsSubmitted(true)
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
      amenities: []
    })
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const totalPrice = calculateTotalPrice()
  const selectedDestination = destinations.find((dest) => dest.id === formData.destinationId)
  const isFormValid =
    formData.destinationId && formData.packageName.trim() && formData.description.trim() && formData.price > 0

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Create Travel Package
        </h1>
        <p className="text-gray-600 text-lg">Design amazing travel experiences for your customers</p>
      </div>

      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          {isSubmitted && (
            <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
              <Plus className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 font-medium">
                Package created successfully! Your customers will love this experience.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-6 border-l-4 border-l-red-500">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
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

                <ImageUploadSection
                  images={formData.images}
                  onImagesChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                />

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
                  onHotelSelection={(hotels) => setFormData((prev) => ({ ...prev, selectedHotels: hotels }))}
                  onActivitySelection={(activities) =>
                    setFormData((prev) => ({ ...prev, selectedActivities: activities }))
                  }
                />

                {/* Enhanced Check-in / Check-out */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-white">
                  <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Check-in & Check-out Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Check-in Time</label>
                        <input
                          type="text"
                          name="checkInTime"
                          value={formData.checkInTime}
                          onChange={handleChange}
                          placeholder="e.g. 3:00 PM"
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Check-out Time</label>
                        <input
                          type="text"
                          name="checkOutTime"
                          value={formData.checkOutTime}
                          onChange={handleChange}
                          placeholder="e.g. 12:00 PM"
                          className="w-full p-3 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Detailed Itinerary Section */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-50 to-white">
                  <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Detailed Itinerary
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={generateBasicItinerary}
                          variant="outline"
                          size="sm"
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Auto-Generate
                        </Button>
                        <Button
                          type="button"
                          onClick={addDay}
                          variant="outline"
                          size="sm"
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Day
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formData.itinerary.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium">No itinerary added yet</p>
                          <p className="text-sm">Click "Add Day" or "Auto-Generate" to create your itinerary</p>
                        </div>
                      ) : (
                        formData.itinerary.map((day, dayIndex) => (
                          <Card key={dayIndex} className="border-2 border-slate-200 shadow-md">
                            <CardHeader 
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer"
                              onClick={() => toggleDayExpansion(dayIndex)}
                            >
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {day.isExpanded ? (
                                    <ChevronDown className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-blue-600" />
                                  )}
                                  <span className="text-lg font-bold text-blue-800">Day {day.day}</span>
                                  <span className="text-sm text-blue-600">
                                    ({day.activities.length} activities)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeDay(dayIndex)
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
                                <div className="space-y-3">
                                  {day.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg">
                                      <input
                                        type="text"
                                        placeholder="Time (e.g. 3:00 PM)"
                                        value={activity.time}
                                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                                        className="w-32 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Activity description"
                                        value={activity.activity}
                                        onChange={(e) => updateActivity(dayIndex, activityIndex, 'activity', e.target.value)}
                                        className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeActivityFromDay(dayIndex, activityIndex)}
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
                                    size="sm"
                                    className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Activity to Day {day.day}
                                  </Button>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Inclusions */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Package Inclusions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">
                        What's included in this package?
                      </label>
                      <textarea
                        placeholder="Enter inclusions (comma separated)&#10;e.g. Welcome drink on arrival, Tent accommodation on sharing basis, Dinner, Breakfast, Music"
                        value={formData.inclusions.join(", ")}
                        onChange={(e) =>
                          setFormData((prev) => ({ 
                            ...prev, 
                            inclusions: e.target.value.split(",").map(i => i.trim()).filter(i => i) 
                          }))
                        }
                        rows={4}
                        className="w-full p-4 border-2 border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      />
                      <p className="text-xs text-green-600">
                        Separate each inclusion with a comma. This helps customers understand what's covered.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Amenities */}
                <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-violet-50">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Available Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-slate-700">
                        What amenities are available?
                      </label>
                      <textarea
                        placeholder="Enter amenities (comma separated)&#10;e.g. Freshup facility, Phone charging, Washroom facility, 24/7 Caretaker services"
                        value={formData.amenities.join(", ")}
                        onChange={(e) =>
                          setFormData((prev) => ({ 
                            ...prev, 
                            amenities: e.target.value.split(",").map(a => a.trim()).filter(a => a) 
                          }))
                        }
                        rows={4}
                        className="w-full p-4 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                      <p className="text-xs text-purple-600">
                        List all facilities and services available to guests during their stay.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <PricingSidebar formData={formData} selectedDestination={selectedDestination} totalPrice={totalPrice} />
            </div>

            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={loading || !isFormValid}
                size="lg"
                className="w-full max-w-md h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Package...
                  </>
                ) : !formData.destinationId ? (
                  <>
                    <MapPin className="h-5 w-5 mr-3" />
                    Select Destination First
                  </>
                ) : !formData.packageName.trim() ? (
                  <>
                    <FileText className="h-5 w-5 mr-3" />
                    Enter Package Name
                  </>
                ) : !formData.description.trim() ? (
                  <>
                    <FileText className="h-5 w-5 mr-3" />
                    Add Description
                  </>
                ) : formData.price <= 0 ? (
                  <>
                    <span className="mr-3">₹</span>
                    Set Base Price
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-3" />
                    Create Package - ₹{totalPrice.toLocaleString()}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddPackage