import type React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPackage } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import {
  Plus,
  Clock,
  FileText,
  Building,
  MapPin,
  Upload,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";

import { fetchHotels, type Hotel } from "@/services/packages/hotelService";
import { fetchAllDestinations } from "@/services/Destination/destinationService";

import {
  fetchActivities,
  type Activity,
} from "@/services/packages/activityService";
import type { DestinationInterface } from "@/interface/destinationInterface";

type PackageFormData = {
  packageName: string;
  description: string;
  price: number;
  duration: number;
  selectedHotels: string[];
  selectedActivities: string[];
  images: string[];
  destinationId: string;
};

const AddPackage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.package);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);

  const [formData, setFormData] = useState<PackageFormData>({
    packageName: "",
    description: "",
    price: 0,
    duration: 1,
    selectedHotels: [],
    selectedActivities: [],
    images: [],
    destinationId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoadingHotels(true);
      setLoadingActivities(true);
      try {
        const [hotelsData, activitiesData, destinationsData] =
          await Promise.all([
            fetchHotels(),
            fetchActivities(),
            fetchAllDestinations(),
          ]);
        setHotels(hotelsData);
        setActivities(activitiesData);
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoadingHotels(false);
        setLoadingActivities(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleHotelSelection = (selectedHotels: string[]) => {
    setFormData((prev) => ({ ...prev, selectedHotels }));
  };

  const handleActivitySelection = (selectedActivities: string[]) => {
    setFormData((prev) => ({ ...prev, selectedActivities }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5),
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const calculateTotalPrice = () => {
    const hotelsCost =
      formData.selectedHotels.length * 2000 * formData.duration;
    const activitiesCost = formData.selectedActivities.length * 1500;
    return formData.price + hotelsCost + activitiesCost;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedHotelDetails = hotels.filter((hotel) =>
      formData.selectedHotels.includes(hotel.hotelId)
    );
    const selectedActivityDetails = activities.filter((activity) =>
      formData.selectedActivities.includes(activity.activityId)
    );

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
      hotelDetails: selectedHotelDetails,
      activities: selectedActivityDetails,
    };

    dispatch(addPackage(completePackage));
    setIsSubmitted(true);
    setFormData({
      packageName: "",
      description: "",
      price: 0,
      duration: 1,
      selectedHotels: [],
      selectedActivities: [],
      images: [],
      destinationId: "",
    });
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const hotelOptions = hotels.map((hotel) => ({
    value: hotel.hotelId,
    label: `${hotel.name} - ${hotel.address}`,
    data: hotel,
  }));

  const activityOptions = activities.map((activity) => ({
    value: activity.activityId,
    label: `${activity.title} - ${activity.description.slice(0, 50)}...`,
    data: activity,
  }));

  const totalPrice = calculateTotalPrice();

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Travel Package
          </h1>
          <p className="text-gray-600 text-lg">
            Design amazing travel experiences for your customers
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {isSubmitted && (
              <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
                <Plus className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800 font-medium">
                  🎉 Package created successfully! Your customers will love this
                  experience.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="mb-6 border-l-4 border-l-red-500"
              >
                <AlertDescription className="font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Basic Package Info */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="packageName"
                          className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                          Package Name
                        </Label>
                        <Input
                          id="packageName"
                          name="packageName"
                          type="text"
                          placeholder="e.g., Goa Beach Paradise"
                          value={formData.packageName}
                          onChange={handleChange}
                          className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                          required
                        />
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-orange-600" />
                          Select Destination
                        </h3>

                        <div>
                          <Label
                            htmlFor="destination"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                          >
                            Destination
                          </Label>
                          <select
                            id="destination"
                            value={formData.destinationId}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destinationId: e.target.value,
                              })
                            }
                            className="w-full h-12 px-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                            required
                          >
                            <option value="" disabled>
                              Select a destination...
                            </option>
                            {destinations.map((dest) => (
                              <option key={dest.id} value={dest.id}>
                                {dest.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe what makes this package special..."
                          value={formData.description}
                          onChange={handleChange}
                          className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="price"
                            className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1"
                          >
                            <span className="text-green-600">₹</span>
                            Base Price
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="5000"
                            value={formData.price}
                            onChange={handleChange}
                            className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                            min="0"
                            required
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="duration"
                            className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-1"
                          >
                            <Clock className="h-4 w-4 text-blue-600" />
                            Duration (days)
                          </Label>
                          <Input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="3"
                            value={formData.duration}
                            onChange={handleChange}
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            min="1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-purple-600" />
                      Package Images
                    </h3>

                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload images (max 5)
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            PNG, JPG up to 10MB each
                          </p>
                        </label>
                      </div>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Package image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hotels and Activities */}
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Hotels & Activities
                    </h3>

                    <div className="space-y-6">
                      {/* Select Hotels */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
                          <Building className="h-4 w-4 text-green-600" />
                          Select Hotels
                        </Label>

                        <MultiSelect
                          options={hotelOptions}
                          selected={hotelOptions.filter((opt) =>
                            formData.selectedHotels.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleHotelSelection(
                              selectedOptions.map((opt) => opt.value)
                            )
                          }
                          placeholder={
                            loadingHotels
                              ? "Loading hotels..."
                              : "Choose hotels..."
                          }
                           
                        />

                        <p className="text-xs text-gray-500 mt-1">
                          Selected {formData.selectedHotels.length} hotel(s)
                        </p>
                      </div>

                      {/* Select Activities */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Select Activities
                        </Label>

                        <MultiSelect
                          options={activityOptions}
                          selected={activityOptions.filter((opt) =>
                            formData.selectedActivities.includes(opt.value)
                          )}
                          onChange={(selectedOptions) =>
                            handleActivitySelection(
                              selectedOptions.map((opt) => opt.value)
                            )
                          }
                          placeholder={
                            loadingActivities
                              ? "Loading activities..."
                              : "Choose activities..."
                          }
                        
                        />

                        <p className="text-xs text-gray-500 mt-1">
                          Selected {formData.selectedActivities.length}{" "}
                          activity(ies)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 sticky top-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="h-5 w-5 text-yellow-600" />
                      Price Breakdown
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                        <span className="text-sm text-gray-600">
                          Base Price:
                        </span>
                        <span className="font-medium">
                          ₹{formData.price.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                        <span className="text-sm text-gray-600">
                          Hotels ({formData.duration} nights):
                        </span>
                        <span className="font-medium">
                          ₹
                          {(
                            formData.selectedHotels.length *
                            2000 *
                            formData.duration
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-yellow-200">
                        <span className="text-sm text-gray-600">
                          Activities:
                        </span>
                        <span className="font-medium">
                          ₹
                          {(
                            formData.selectedActivities.length * 1500
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-100 to-emerald-100 px-4 rounded-lg border border-green-200">
                        <span className="font-semibold text-green-800">
                          Total Price:
                        </span>
                        <span className="text-xl font-bold text-green-800">
                          ₹{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                        <div className="text-2xl font-bold text-blue-600">
                          {formData.duration}
                        </div>
                        <div className="text-xs text-gray-500">Days</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
                        <div className="text-2xl font-bold text-green-600">
                          {formData.selectedHotels.length +
                            formData.selectedActivities.length}
                        </div>
                        <div className="text-xs text-gray-500">Items</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full max-w-md h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Package...
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
    </div>
  );
};

export default AddPackage;
