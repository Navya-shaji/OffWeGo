// import type React from "react";
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addPackage } from "@/store/slice/packages/packageSlice";
// import type { AppDispatch, RootState } from "@/store/store";
// import { uploadToCloudinary } from "@/utilities/cloudinaryUpload"; 

// import {
//   Plus,
//   Clock,
//   FileText,
//   Building,
//   MapPin,
//   Upload,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent } from "@/components/ui/card";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Label } from "@/components/ui/label";
// import { MultiSelect } from "@/components/ui/multi-select";


// import { getAllHotel } from "@/services/Hotel/HotelService";
// import { getActivities } from "@/services/Activity/ActivityService"; 
// import { fetchAllDestinations } from "@/services/Destination/destinationService";

// import type { DestinationInterface } from "@/interface/destinationInterface";

// // Interfaces matching your data structure
// export interface Hotel {
//   hotelId?: string;
//   name: string;
//   address: string;
//   rating: number;
//   destinationId?: string;
// }

// export interface Activity {
//   activityId?: string;
//   title: string;
//   description: string;
//   destinationId?: string;
//   imageUrl: string;
// }

// export interface PackageFormData {
//   id?: string; // optional, generated later
//   destinationId: string;
//   packageName: string;
//   description: string;
//   price: number;
//   duration: number; 
//   startDate?: Date; // optional in form
//   endDate?: Date;   // optional in form
//   images: string[];
//   selectedHotels: Hotel[];
//   selectedActivities: Activity[];
// }


// const AddPackage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => state.package);
//   const [isSubmitted, setIsSubmitted] = useState(false);
  
//   // All data from APIs
//   const [allHotels, setAllHotels] = useState<Hotel[]>([]);
//   const [allActivities, setAllActivities] = useState<Activity[]>([]);
//   const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  
//   // Filtered data based on selected destination
//   const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
//   const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  
//   const [loadingHotels, setLoadingHotels] = useState(false);
//   const [loadingActivities, setLoadingActivities] = useState(false);
//   const [loadingDestinations, setLoadingDestinations] = useState(false);

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

//   // Safe data extraction function
//   const extractApiData = (response: any, dataPath: string[] = []) => {
//     if (!response) return [];
    
//     // Try different possible paths
//     const possiblePaths = [
//       ['data', 'data'],
//       ['data'],
//       ['destinations'], // For destinations specifically
//       [] // Direct array
//     ];
    
//     if (dataPath.length > 0) {
//       possiblePaths.unshift(dataPath);
//     }
    
//     for (const path of possiblePaths) {
//       let result = response;
      
//       for (const key of path) {
//         if (result && typeof result === 'object' && key in result) {
//           result = result[key];
//         } else {
//           result = null;
//           break;
//         }
//       }
      
//       if (Array.isArray(result)) {
//         return result;
//       }
//     }
    
//     // If no path works, check if response itself is an array
//     if (Array.isArray(response)) {
//       return response;
//     }
    
//     console.warn("Could not extract array data from response:", response);
//     return [];
//   };

//   // Load all data on component mount
//   useEffect(() => {
//     const loadData = async () => {
//       setLoadingDestinations(true);
//       setLoadingHotels(true);
//       setLoadingActivities(true);
      
//       try {
//         // Load destinations - try with and without pagination
//         let destinationsResult = [];
//         try {
//           // First try without parameters
//           const destinationsResponse = await fetchAllDestinations();
//           destinationsResult = extractApiData(destinationsResponse, ['destinations']);
          
//           // If empty, try with pagination parameters
//           if (destinationsResult.length === 0) {
//             const paginatedResponse = await fetchAllDestinations(1, 100);
//             destinationsResult = extractApiData(paginatedResponse, ['destinations']);
//           }
//         } catch (destError) {
//           console.error("Error loading destinations:", destError);
//         }
        
//         setDestinations(destinationsResult);
//         setLoadingDestinations(false);

//         // Load hotels
//         let hotelsResult = [];
//         try {
//           const hotelsResponse = await getAllHotel();
//           hotelsResult = extractApiData(hotelsResponse);
//         } catch (hotelsError) {
//           console.error("Error loading hotels:", hotelsError);
//         }
        
//         setAllHotels(hotelsResult);
//         setLoadingHotels(false);

//         let activitiesResult = [];
//         try {
//           const activitiesResponse = await getActivities();
//           activitiesResult = extractApiData(activitiesResponse);
//         } catch (activitiesError) {
//           console.error("Error loading activities:", activitiesError);
//         }
        
//         setAllActivities(activitiesResult);
//         setLoadingActivities(false);

//       } catch (error) {
//         console.error("Failed to load data:", error);
//         setLoadingHotels(false);
//         setLoadingActivities(false);
//         setLoadingDestinations(false);
//       }
//     };

//     loadData();
//   }, []);

//   useEffect(() => {
  

//       const destinationHotels = allHotels
//       setFilteredHotels(destinationHotels);
//       console.log("destinationHotels",destinationHotels)
    
//       const destinationActivities = allActivities
//       setFilteredActivities(destinationActivities);
      
//       // setFormData(prev => ({
//       //   ...prev,
//       //   selectedHotels: prev.selectedHotels.filter(hotelId =>
//       //     destinationHotels.some(hotel => hotel.hotelId === hotelId)
//       //   ),
//       //   selectedActivities: prev.selectedActivities.filter(activityId =>
//       //     destinationActivities.some(activity => activity.activityId === activityId)
//       //   ),
//       // }));
    
//   }, [formData.destinationId, allHotels, allActivities]);
  
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "price" || name === "duration" ? Number(value) : value,
//     }));
//   };
  
//   const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData(prev => ({
//       ...prev,
//       destinationId: e.target.value,
//     }));
//   };
  
//   const handleHotelSelection = (selectedHotels: Hotel[]) => {
//     setFormData((prev) => ({ ...prev, selectedHotels }));
//   };
  
//   const handleActivitySelection = (selectedActivities: Activity[]) => {
//     setFormData((prev) => ({ ...prev, selectedActivities }));
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
    
//     setFormData((prev) => ({
//       ...prev,
//       images: [...prev.images, ...uploadedUrls].slice(0, 5),
//     }));
//   };
  
//   const removeImage = (index: number) => {
//     setFormData((prev) => ({
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
    
//     const selectedHotelDetails = filteredHotels.filter((hotel) =>
//       formData.selectedHotels.includes(hotel.hotelId)
//   );
//   const selectedActivityDetails = filteredActivities.filter((activity) =>
//     formData.selectedActivities.includes(activity.activityId)
// );

// const completePackage = {
//   id: crypto.randomUUID(),
//   destinationId: formData.destinationId,
//       packageName: formData.packageName,
//       description: formData.description,
//       price: calculateTotalPrice(),
//       duration: formData.duration,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000),
//       images: formData.images,
//       hotels: selectedHotelDetails,
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

//   const hotelOptions = filteredHotels.map((hotel) => ({
//     value: hotel.hotelId,
//     label: `${hotel.name} - ${hotel.address} (${hotel.rating}⭐)`,
//     data: hotel,
//   }));
  
//   const activityOptions = filteredActivities.map((activity) => ({
//     value: activity.activityId,
//     label: `${activity.title} - ${activity.description.slice(0, 50)}...`,
//     data: activity,
//   }));

//   const totalPrice = calculateTotalPrice();
//   const selectedDestination = destinations.find(dest => dest.id === formData.destinationId);
//   console.log("filteredHotels",filteredHotels,filteredActivities)
  
//   return (
//     <div>
//       <div className="max-w-6xl mx-auto p-6">
//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
//             Create Travel Package
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Design amazing travel experiences for your customers
//           </p>
//         </div>

//         <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
//           <CardContent className="p-8">
//             {isSubmitted && (
//               <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-500">
//                 <Plus className="h-5 w-5 text-green-600" />
//                 <AlertDescription className="text-green-800 font-medium">
//                   🎉 Package created successfully! Your customers will love this experience.
//                 </AlertDescription>
//               </Alert>
//             )}

//             {error && (
//               <Alert variant="destructive" className="mb-6 border-l-4 border-l-red-500">
//                 <AlertDescription className="font-medium">
//                   {error}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-8">
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
//                 {/* Basic Package Info */}
//                 <div className="xl:col-span-2 space-y-6">
//                   <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <FileText className="h-5 w-5 text-blue-600" />
//                       Basic Information
//                     </h3>

//                     <div className="space-y-4">
//                       <div>
//                         <Label htmlFor="packageName" className="text-sm font-medium text-gray-700 mb-2 block">
//                           Package Name
//                         </Label>
//                         <Input
//                           id="packageName"
//                           name="packageName"
//                           type="text"
//                           placeholder="e.g., Goa Beach Paradise"
//                           value={formData.packageName}
//                           onChange={handleChange}
//                           className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                           required
//                         />
//                       </div>

//                       {/* Destination Selection */}
//                       <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
//                         <Label htmlFor="destination" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                           <MapPin className="h-4 w-4 text-orange-600" />
//                           Select Destination First
//                         </Label>
                        
//                         {loadingDestinations ? (
//                           <div className="flex items-center justify-center p-4">
//                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
//                             <span className="ml-2">Loading destinations...</span>
//                           </div>
//                         ) : destinations.length === 0 ? (
//                           <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
//                             <p className="font-medium">No destinations found</p>
//                             <p className="text-sm mt-1">Please add destinations first or check your API connection</p>
//                           </div>
//                         ) : (
//                           <>
//                             <select
//                               id="destination"
//                               value={formData.destinationId}
//                               onChange={handleDestinationChange}
//                               className="w-full h-12 px-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
//                               required
//                             >
//                               <option value="" disabled>
//                                 Choose destination to see available hotels & activities...
//                               </option>
//                               {destinations.map((dest) => (
//                                 <option key={dest.id} value={dest.id}>
//                                   {dest.name} - {dest.location}
//                                 </option>
//                               ))}
//                             </select>
//                             <p className="text-xs text-orange-600 mt-1">
//                               {destinations.length} destination(s) available
//                             </p>
//                           </>
//                         )}
                        
//                         {selectedDestination && (
//                           <div className="mt-3 p-3 bg-orange-100 rounded-lg border border-orange-200">
//                             <p className="text-sm font-medium text-orange-800">
//                               📍 Selected: {selectedDestination.name}
//                             </p>
//                             <p className="text-xs text-orange-700 mt-1">
//                               {selectedDestination.location} | 
//                               Hotels: {filteredHotels.length} | 
//                               Activities: {filteredActivities.length}
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
//                           Description
//                         </Label>
//                         <Textarea
//                           id="description"
//                           name="description"
//                           placeholder="Describe what makes this package special..."
//                           value={formData.description}
//                           onChange={handleChange}
//                           className="min-h-[120px] border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
//                           required
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <Label htmlFor="price" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
//                             <span className="text-green-600">₹</span>
//                             Base Price
//                           </Label>
//                           <Input
//                             id="price"
//                             name="price"
//                             type="number"
//                             placeholder="5000"
//                             value={formData.price}
//                             onChange={handleChange}
//                             className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
//                             min="0"
//                             required
//                           />
//                         </div>

//                         <div>
//                           <Label htmlFor="duration" className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
//                             <Clock className="h-4 w-4 text-blue-600" />
//                             Duration (days)
//                           </Label>
//                           <Input
//                             id="duration"
//                             name="duration"
//                             type="number"
//                             placeholder="3"
//                             value={formData.duration}
//                             onChange={handleChange}
//                             className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                             min="1"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Image Upload Section */}
//                   <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <Upload className="h-5 w-5 text-purple-600" />
//                       Package Images ({formData.images.length}/5)
//                     </h3>

//                     <div className="space-y-4">
//                       <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
//                         <input
//                           type="file"
//                           multiple
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                           id="image-upload"
//                           disabled={formData.images.length >= 5}
//                         />
//                         <label htmlFor="image-upload" className="cursor-pointer">
//                           <Upload className="h-8 w-8 text-purple-400 mx-auto mb-2" />
//                           <p className="text-sm text-gray-600">
//                             {formData.images.length >= 5 
//                               ? "Maximum 5 images reached" 
//                               : `Click to upload images (${5 - formData.images.length} remaining)`
//                             }
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             PNG, JPG up to 10MB each
//                           </p>
//                         </label>
//                       </div>

//                       {formData.images.length > 0 && (
//                         <div className="grid grid-cols-3 gap-3">
//                           {formData.images.map((image, index) => (
//                             <div key={index} className="relative group">
//                               <img
//                                 src={image}
//                                 alt={`Package image ${index + 1}`}
//                                 className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
//                                 onError={(e) => {
//                                   e.currentTarget.src = "/placeholder.svg";
//                                 }}
//                               />
//                               <button
//                                 type="button"
//                                 onClick={() => removeImage(index)}
//                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                               >
//                                 <X className="h-3 w-3" />
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Hotels and Activities - Only show when destination is selected */}
//                   {formData.destinationId ? (
//                     <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
//                       <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                         Hotels & Activities for {selectedDestination?.name}
//                       </h3>

//                       <div className="space-y-6">
//                         {/* Select Hotels */}
//                         <div>
//                           <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <Building className="h-4 w-4 text-green-600" />
//                             Select Hotels ({filteredHotels.length} available)
//                           </Label>

//                           {loadingHotels ? (
//                             <div className="flex items-center justify-center p-4">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
//                               <span className="ml-2">Loading hotels...</span>
//                             </div>
//                           ) : filteredHotels.length > 0 ? (
//                             <MultiSelect
//                               options={hotelOptions}
//                               selected={hotelOptions.filter((opt) =>
//                                 formData.selectedHotels.includes(opt.value)
//                               )}
//                               onChange={(selectedOptions) =>
//                                 handleHotelSelection(selectedOptions.map((opt) => opt.value))
//                               }
//                               placeholder="Choose hotels for this destination..."
//                             />
//                           ) : (
//                             <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
//                               <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                               <p>No hotels available for this destination</p>
//                               <p className="text-xs mt-1">Add hotels for {selectedDestination?.name} first</p>
//                             </div>
//                           )}

//                           <p className="text-xs text-gray-500 mt-1">
//                             Selected {formData.selectedHotels.length} hotel(s) 
//                             {formData.selectedHotels.length > 0 && 
//                               ` (₹${(formData.selectedHotels.length * 2000 * formData.duration).toLocaleString()} for ${formData.duration} nights)`
//                             }
//                           </p>
//                         </div>

//                         {/* Select Activities */}
//                         <div>
//                           <Label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                             <MapPin className="h-4 w-4 text-blue-600" />
//                             Select Activities ({filteredActivities.length} available)
//                           </Label>

//                           {loadingActivities ? (
//                             <div className="flex items-center justify-center p-4">
//                               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                               <span className="ml-2">Loading activities...</span>
//                             </div>
//                           ) : filteredActivities.length > 0 ? (
//                             <MultiSelect
//                               options={activityOptions}
//                               selected={activityOptions.filter((opt) =>
//                                 formData.selectedActivities.includes(opt.value)
//                               )}
//                               onChange={(selectedOptions) =>
//                                 handleActivitySelection(selectedOptions.map((opt) => opt.value))
//                               }
//                               placeholder="Choose activities for this destination..."
//                             />
//                           ) : (
//                             <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
//                               <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                               <p>No activities available for this destination</p>
//                               <p className="text-xs mt-1">Add activities for {selectedDestination?.name} first</p>
//                             </div>
//                           )}

//                           <p className="text-xs text-gray-500 mt-1">
//                             Selected {formData.selectedActivities.length} activity(ies)
//                             {formData.selectedActivities.length > 0 && 
//                               ` (₹${(formData.selectedActivities.length * 1500).toLocaleString()})`
//                             }
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200 text-center">
//                       <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
//                       <h3 className="text-lg font-semibold text-gray-600 mb-2">
//                         Select a Destination First
//                       </h3>
//                       <p className="text-gray-500">
//                         Choose a destination above to see available hotels and activities
//                       </p>
//                     </div>
//                   )}
//                 </div>

              
//                 <div className="space-y-6">
//                   <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200 sticky top-6">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <div className="h-5 w-5 bg-yellow-600 rounded-full" />
//                       Price Breakdown
//                     </h3>

//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center py-2 border-b border-yellow-200">
//                         <span className="text-sm text-gray-600">Base Price:</span>
//                         <span className="font-medium">₹{formData.price.toLocaleString()}</span>
//                       </div>

//                       <div className="flex justify-between items-center py-2 border-b border-yellow-200">
//                         <span className="text-sm text-gray-600">
//                           Hotels ({formData.duration} nights):
//                         </span>
//                         <span className="font-medium">
//                           ₹{(formData.selectedHotels.length * 2000 * formData.duration).toLocaleString()}
//                         </span>
//                       </div>

//                       <div className="flex justify-between items-center py-2 border-b border-yellow-200">
//                         <span className="text-sm text-gray-600">Activities:</span>
//                         <span className="font-medium">
//                           ₹{(formData.selectedActivities.length * 1500).toLocaleString()}
//                         </span>
//                       </div>

//                       <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-100 to-emerald-100 px-4 rounded-lg border border-green-200">
//                         <span className="font-semibold text-green-800">Total Price:</span>
//                         <span className="text-xl font-bold text-green-800">
//                           ₹{totalPrice.toLocaleString()}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="mt-6 grid grid-cols-2 gap-3">
//                       <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
//                         <div className="text-2xl font-bold text-blue-600">{formData.duration}</div>
//                         <div className="text-xs text-gray-500">Days</div>
//                       </div>
//                       <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
//                         <div className="text-2xl font-bold text-green-600">
//                           {formData.selectedHotels.length + formData.selectedActivities.length}
//                         </div>
//                         <div className="text-xs text-gray-500">Items</div>
//                       </div>
//                     </div>

//                     {selectedDestination && (
//                       <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <p className="text-sm font-medium text-blue-800">
//                           📍 {selectedDestination.name}
//                         </p>
//                         <p className="text-xs text-blue-600">{selectedDestination.location}</p>
//                       </div>
//                     )}

//                     {/* Package Summary */}
//                     <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
//                       <h4 className="text-sm font-semibold text-gray-700 mb-2">Package Summary</h4>
//                       <div className="space-y-1 text-xs text-gray-600">
//                         <p>• {formData.packageName || "Unnamed Package"}</p>
//                         <p>• {formData.duration} days duration</p>
//                         <p>• {formData.selectedHotels.length} hotel(s) selected</p>
//                         <p>• {formData.selectedActivities.length} activity(ies) selected</p>
//                         <p>• {formData.images.length} image(s) uploaded</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-center pt-6">
//                 <Button
//                   type="submit"
//                   disabled={loading || !formData.destinationId || !formData.packageName.trim() || !formData.description.trim() || formData.price <= 0}
//                   size="lg"
//                   className="w-full max-w-md h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                       Creating Package...
//                     </>
//                   ) : !formData.destinationId ? (
//                     <>
//                       <MapPin className="h-5 w-5 mr-3" />
//                       Select Destination First
//                     </>
//                   ) : !formData.packageName.trim() ? (
//                     <>
//                       <FileText className="h-5 w-5 mr-3" />
//                       Enter Package Name
//                     </>
//                   ) : !formData.description.trim() ? (
//                     <>
//                       <FileText className="h-5 w-5 mr-3" />
//                       Add Description
//                     </>
//                   ) : formData.price <= 0 ? (
//                     <>
//                       <span className="mr-3">₹</span>
//                       Set Base Price
//                     </>
//                   ) : (
//                     <>
//                       <Plus className="h-5 w-5 mr-3" />
//                       Create Package - ₹{totalPrice.toLocaleString()}
//                     </>
//                   )}
//                 </Button>
//               </div>

//               {/* Form Validation Messages */}
//               {(!formData.destinationId || !formData.packageName.trim() || !formData.description.trim() || formData.price <= 0) && (
//                 <div className="text-center">
//                   <div className="inline-flex items-start text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
//                     <div className="flex-shrink-0 mr-2">
//                       <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div>
//                       <p className="font-medium">Please complete the following:</p>
//                       <ul className="mt-1 space-y-1">
//                         {!formData.destinationId && <li>• Select a destination</li>}
//                         {!formData.packageName.trim() && <li>• Enter package name</li>}
//                         {!formData.description.trim() && <li>• Add package description</li>}
//                         {formData.price <= 0 && <li>• Set a base price greater than 0</li>}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </form>
//           </CardContent>
//         </Card>

//         {/* Data Status Footer */}
//         <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
//           <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
//             <div className="flex items-center space-x-4">
//               <span className={`flex items-center ${destinations.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 <div className={`w-2 h-2 rounded-full mr-2 ${destinations.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 {destinations.length} Destinations
//               </span>
//               <span className={`flex items-center ${allHotels.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 <div className={`w-2 h-2 rounded-full mr-2 ${allHotels.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 {allHotels.length} Hotels
//               </span>
//               <span className={`flex items-center ${allActivities.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
//                 <div className={`w-2 h-2 rounded-full mr-2 ${allActivities.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                 {allActivities.length} Activities
//               </span>
//             </div>
//             <div className="text-xs text-gray-500">
//               {(loadingDestinations || loadingHotels || loadingActivities) ? 'Loading data...' : 'All data loaded'}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddPackage;