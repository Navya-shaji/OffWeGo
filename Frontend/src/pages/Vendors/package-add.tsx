// import type React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addPackage } from "@/store/slice/packages/packageSlice";
// import type { AppDispatch, RootState } from "@/store/store";
// import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";

// import { Plus, Clock, FileText, Building, MapPin, Upload, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Label } from "@/components/ui/label";
// import { MultiSelect } from "@/components/ui/multi-select";

// import { fetchHotels, type Hotel } from "@/services/packages/hotelService";
// import { fetchAllDestinations } from "@/services/Destination/destinationService";
// import { fetchActivities, type Activity } from "@/services/packages/activityService";
// import type { DestinationInterface } from "@/interface/destinationInterface";

// type PackageFormData = {
//   packageName: string;
//   description: string;
//   price: number;
//   duration: number;
//   selectedHotels: string[];
//   selectedActivities: string[];
//   images: string[];
//   destinationId: string;
// };

// const AddPackage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => state.package);

//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
//   const [loadingHotels, setLoadingHotels] = useState(false);
//   const [loadingActivities, setLoadingActivities] = useState(false);

//   const [formData, setFormData] = useState<PackageFormData>({
//     packageName: "",
//     description: "",
//     price: 0,
//     duration: 1,
//     selectedHotels: [],
//     selectedActivities: [],
//     images: [],
//     destinationId: "",
//   });

//   // Load hotels, activities, and destinations
//   useEffect(() => {
//     const loadData = async () => {
//       setLoadingHotels(true);
//       setLoadingActivities(true);
//       try {
//         const [hotelsData, activitiesData, destinationsData] =
//           await Promise.all([fetchHotels(), fetchActivities(), fetchAllDestinations()]);
//         setHotels(hotelsData);
//         setActivities(activitiesData);
//         setDestinations(destinationsData);
//       } catch (err) {
//         console.error("Failed to load data:", err);
//       } finally {
//         setLoadingHotels(false);
//         setLoadingActivities(false);
//       }
//     };
//     loadData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === "price" || name === "duration" ? Number(value) : value,
//     }));
//   };

//   const handleHotelSelection = (selectedHotels: string[]) => {
//     setFormData(prev => ({ ...prev, selectedHotels }));
//   };

//   const handleActivitySelection = (selectedActivities: string[]) => {
//     setFormData(prev => ({ ...prev, selectedActivities }));
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     const fileArray = Array.from(files).slice(0, 5 - formData.images.length);
//     const uploadedUrls: string[] = [];

//     for (const file of fileArray) {
//       try {
//         const url = await uploadToCloudinary(file);
//         uploadedUrls.push(url);
//       } catch (error) {
//         console.error("Failed to upload image:", error);
//       }
//     }

//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...uploadedUrls].slice(0, 5),
//     }));
//   };

//   const removeImage = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index),
//     }));
//   };

//   const calculateTotalPrice = () => {
//     const hotelsCost = formData.selectedHotels.length * 2000 * formData.duration;
//     const activitiesCost = formData.selectedActivities.length * 1500;
//     return formData.price + hotelsCost + activitiesCost;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const selectedHotelDetails = hotels.filter(hotel =>
//       formData.selectedHotels.includes(hotel.hotelId)
//     );
//     const selectedActivityDetails = activities.filter(activity =>
//       formData.selectedActivities.includes(activity.activityId)
//     );

//     const completePackage = {
//       id: crypto.randomUUID(),
//       destinationId: formData.destinationId,
//       packageName: formData.packageName,
//       description: formData.description,
//       price: calculateTotalPrice(),
//       duration: formData.duration,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
//       images: formData.images,
//       hotelDetails: selectedHotelDetails,
//       activities: selectedActivityDetails,
//     };

//     dispatch(addPackage(completePackage));
//     setIsSubmitted(true);
//     setFormData({
//       packageName: "",
//       description: "",
//       price: 0,
//       duration: 1,
//       selectedHotels: [],
//       selectedActivities: [],
//       images: [],
//       destinationId: "",
//     });
//     setTimeout(() => setIsSubmitted(false), 3000);
//   };

//   const hotelOptions = hotels.map(hotel => ({
//     value: hotel.hotelId,
//     label: `${hotel.name} - ${hotel.address}`,
//     data: hotel,
//   }));

//   const activityOptions = activities.map(activity => ({
//     value: activity.activityId,
//     label: `${activity.title} - ${activity.description.slice(0, 50)}...`,
//     data: activity,
//   }));

//   const totalPrice = calculateTotalPrice();

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-4xl font-bold text-center mb-6">
//         Create Travel Package
//       </h1>

//       <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//         <CardContent className="p-8">
//           {isSubmitted && (
//             <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
//               <Plus className="h-5 w-5 text-green-600" />
//               <AlertDescription className="text-green-800 font-medium">
//                 🎉 Package created successfully!
//               </AlertDescription>
//             </Alert>
//           )}

//           {error && (
//             <Alert variant="destructive" className="mb-6 border-l-4 border-l-red-500">
//               <AlertDescription className="font-medium">{error}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Package Info */}
//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//               <div className="xl:col-span-2 space-y-6">
//                 {/* Basic Info */}
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-blue-600" /> Basic Information
//                   </h3>

//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="packageName">Package Name</Label>
//                       <Input
//                         id="packageName"
//                         name="packageName"
//                         value={formData.packageName}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div>
//                       <Label htmlFor="destination">Destination</Label>
//                       <select
//                         id="destination"
//                         value={formData.destinationId}
//                         onChange={e =>
//                           setFormData(prev => ({ ...prev, destinationId: e.target.value }))
//                         }
//                         required
//                       >
//                         <option value="" disabled>Select a destination...</option>
//                         {destinations.map(dest => (
//                           <option key={dest.id} value={dest.id}>{dest.name}</option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <Label htmlFor="description">Description</Label>
//                       <Textarea
//                         id="description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label htmlFor="price">Base Price</Label>
//                         <Input
//                           id="price"
//                           name="price"
//                           type="number"
//                           value={formData.price}
//                           onChange={handleChange}
//                           min={0}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <Label htmlFor="duration">
//                           <Clock className="h-4 w-4 text-blue-600" /> Duration (days)
//                         </Label>
//                         <Input
//                           id="duration"
//                           name="duration"
//                           type="number"
//                           value={formData.duration}
//                           onChange={handleChange}
//                           min={1}
//                           required
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Hotels & Activities */}
//                 <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     Hotels & Activities
//                   </h3>

//                   <div className="space-y-6">
//                     {/* Hotels */}
//                     <div>
//                       <Label className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-green-600" /> Select Hotels
//                       </Label>
//                       <MultiSelect
//                         options={hotelOptions}
//                         value={hotelOptions.filter(opt =>
//                           formData.selectedHotels.includes(opt.value)
//                         )}
//                         onChange={selected =>
//                           handleHotelSelection(selected.map(opt => opt.value))
//                         }
//                         placeholder={loadingHotels ? "Loading hotels..." : "Choose hotels..."}
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Selected {formData.selectedHotels.length} hotel(s)
//                       </p>
//                     </div>

//                     {/* Activities */}
//                     <div>
//                       <Label className="flex items-center gap-2">
//                         <MapPin className="h-4 w-4 text-blue-600" /> Select Activities
//                       </Label>
//                       <MultiSelect
//                         options={activityOptions}
//                         value={activityOptions.filter(opt =>
//                           formData.selectedActivities.includes(opt.value)
//                         )}
//                         onChange={selected =>
//                           handleActivitySelection(selected.map(opt => opt.value))
//                         }
//                         placeholder={loadingActivities ? "Loading activities..." : "Choose activities..."}
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Selected {formData.selectedActivities.length} activity(ies)
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//               </div>

//               {/* Price Summary */}
//               <div className="space-y-6">
//                 <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 sticky top-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>
//                   <div className="space-y-3">
//                     <div className="flex justify-between">
//                       <span>Base Price:</span>
//                       <span>₹{formData.price.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Hotels ({formData.duration} nights):</span>
//                       <span>₹{(formData.selectedHotels.length * 2000 * formData.duration).toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Activities:</span>
//                       <span>₹{(formData.selectedActivities.length * 1500).toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between font-bold">
//                       <span>Total Price:</span>
//                       <span>₹{totalPrice.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-center pt-6">
//               <Button type="submit" disabled={loading} size="lg">
//                 {loading ? "Creating Package..." : `Create Package - ₹${totalPrice.toLocaleString()}`}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AddPackage;
