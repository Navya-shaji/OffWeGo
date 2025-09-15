import type React from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addPackage } from "@/store/slice/packages/packageSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { Plus, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { usePackageData } from "./usepackagedata"
import PackageBasicInfo from "./packagebasicInfo"
import ImageUploadSection from "./ImageUploadSection"
import HotelsActivitiesSection from "./HotelActivitySection"
import PricingSidebar from "./Pricing"
import type { PackageFormData } from "@/interface/packageFormData"

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.package)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { allHotels, allActivities, destinations, loadingHotels, loadingActivities, loadingDestinations } =
    usePackageData()

  const [formData, setFormData] = useState<PackageFormData>({
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

  const calculateTotalPrice = () => {
    const hotelsCost = formData.selectedHotels.length * 2000 * formData.duration
    const activitiesCost = formData.selectedActivities.length * 1500
    return formData.price + hotelsCost + activitiesCost
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedHotelIds = formData.selectedHotels
    const selectedActivityIds = formData.selectedActivities

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
      itinerary: formData.itinerary,
      inclusions: formData.inclusions,
      amenities: formData.amenities,
    }

    console.log(" Complete package data:", completePackage)
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

                {/* ✅ Check-in / Check-out */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Check-in Time</label>
                    <input
                      type="text"
                      name="checkInTime"
                      value={formData.checkInTime}
                      onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                      placeholder="e.g. 2:00 PM"
                      className="border rounded w-full p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Check-out Time</label>
                    <input
                      type="text"
                      name="checkOutTime"
                      value={formData.checkOutTime}
                      onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                      placeholder="e.g. 11:00 AM"
                      className="border rounded w-full p-2"
                    />
                  </div>
                </div>

                {/* ✅ Itinerary Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Itinerary</h2>
                  {formData.itinerary.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <input
                        type="number"
                        placeholder="Day"
                        value={item.day}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary]
                          newItinerary[index].day = Number(e.target.value)
                          setFormData({ ...formData, itinerary: newItinerary })
                        }}
                        className="border rounded p-2 w-20"
                      />
                      <input
                        type="text"
                        placeholder="Time"
                        value={item.time}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary]
                          newItinerary[index].time = e.target.value
                          setFormData({ ...formData, itinerary: newItinerary })
                        }}
                        className="border rounded p-2"
                      />
                      <input
                        type="text"
                        placeholder="Activity"
                        value={item.activity}
                        onChange={(e) => {
                          const newItinerary = [...formData.itinerary]
                          newItinerary[index].activity = e.target.value
                          setFormData({ ...formData, itinerary: newItinerary })
                        }}
                        className="border rounded p-2 flex-1"
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, activity: "" }]
                      }))
                    }
                  >
                    Add Day
                  </Button>
                </div>

                {/* ✅ Inclusions */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Inclusions</h2>
                  <textarea
                    placeholder="Enter inclusions (comma separated)"
                    value={formData.inclusions.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, inclusions: e.target.value.split(",").map(i => i.trim()) }))
                    }
                    className="border rounded w-full p-2"
                  />
                </div>

                {/* ✅ Amenities */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Amenities</h2>
                  <textarea
                    placeholder="Enter amenities (comma separated)"
                    value={formData.amenities.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, amenities: e.target.value.split(",").map(a => a.trim()) }))
                    }
                    className="border rounded w-full p-2"
                  />
                </div>
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
