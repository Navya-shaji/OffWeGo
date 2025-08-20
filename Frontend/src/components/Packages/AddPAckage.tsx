
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

  console.log(formData.selectedHotels)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedHotelIds = formData.selectedHotels
    const selectedActivityIds = formData.selectedActivities
console.log("selectedHotelIds",selectedHotelIds,selectedActivityIds)
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
