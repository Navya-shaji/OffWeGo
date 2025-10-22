// import { useState, useEffect } from "react";
// import { 
//   Building, 
//   Star, 
//   MapPin, 
//   Check, 
//   Activity, 
//   Loader2, 
//   Search,
//   X,
//   ChevronRight,
//   Hotel as HotelIcon,
//   Palmtree
// } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import type { Hotel, Activity as ActivityType } from "@/interface/PackageInterface";
// import { getAllHotel, searchHotel } from "@/services/Hotel/HotelService"; 
// import { getActivities, searchActivity } from "@/services/Activity/ActivityService";

// interface SelectionPageProps {
//   destinationId: string;
//   onComplete: (data: { hotels: Hotel[]; activities: ActivityType[] }) => void;
// }

// export const HotelActivitySelectionPage = ({ 
//   destinationId, 
//   onComplete 
// }: SelectionPageProps) => {
//   const [currentStep, setCurrentStep] = useState<'hotel' | 'activity'>('hotel');
//   const [selectedHotels, setSelectedHotels] = useState<Hotel[]>([]);
//   const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>([]);
  
//   const [hotels, setHotels] = useState<Hotel[]>([]);
//   const [activities, setActivities] = useState<ActivityType[]>([]);
  
//   const [hotelSearchQuery, setHotelSearchQuery] = useState("");
//   const [activitySearchQuery, setActivitySearchQuery] = useState("");
  
//   const [loadingHotels, setLoadingHotels] = useState(true);
//   const [loadingActivities, setLoadingActivities] = useState(false);
//   const [searching, setSearching] = useState(false);
  
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (destinationId) {
//       fetchHotels();
//     }
//   }, [destinationId]);

//   const fetchHotels = async () => {
//     try {
//       setLoadingHotels(true);
//       setError(null);
//       const response = await getAllHotel(1, 100);
      
//       const filteredHotels = response.hotels.filter(
//         (hotel) => hotel.destinationId === destinationId
//       );
      
//       setHotels(filteredHotels);
//     } catch (err) {
//       setError("Failed to load hotels");
//       console.error(err);
//     } finally {
//       setLoadingHotels(false);
//     }
//   };

//   const fetchActivities = async () => {
//     try {
//       setLoadingActivities(true);
//       setError(null);
//       const response = await getActivities(1, 100);
      
//       const filteredActivities = response.activities.filter(
//         (activity) => activity.destinationId === destinationId
//       );
      
//       setActivities(filteredActivities);
//     } catch (err) {
//       setError("Failed to load activities");
//       console.error(err);
//     } finally {
//       setLoadingActivities(false);
//     }
//   };

//   const handleHotelSearch = async () => {
//     if (!hotelSearchQuery.trim()) {
//       fetchHotels();
//       return;
//     }

//     try {
//       setSearching(true);
//       const results = await searchHotel(hotelSearchQuery);
      
//       const filteredResults = results.hotels.filter(
//         (hotel: Hotel) => hotel.destinationId === destinationId
//       );
      
//       setHotels(filteredResults);
//     } catch (err) {
//       console.error("Search failed:", err);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const handleActivitySearch = async () => {
//     if (!activitySearchQuery.trim()) {
//       fetchActivities();
//       return;
//     }

//     try {
//       setSearching(true);
//       const results = await searchActivity(activitySearchQuery);
      
//       const filteredResults = results.activities.filter(
//         (activity: ActivityType) => activity.destinationId === destinationId
//       );
      
//       setActivities(filteredResults);
//     } catch (err) {
//       console.error("Search failed:", err);
//     } finally {
//       setSearching(false);
//     }
//   };

//   const toggleHotelSelection = (hotel: Hotel) => {
//     const isSelected = selectedHotels.some(h => h._id === hotel._id);
    
//     if (isSelected) {
//       setSelectedHotels(selectedHotels.filter(h => h._id !== hotel._id));
//     } else {
//       setSelectedHotels([...selectedHotels, hotel]);
//     }
//   };

//   const toggleActivitySelection = (activity: ActivityType) => {
//     const isSelected = selectedActivities.some(a => a._id === activity._id);
    
//     if (isSelected) {
//       setSelectedActivities(selectedActivities.filter(a => a._id !== activity._id));
//     } else {
//       setSelectedActivities([...selectedActivities, activity]);
//     }
//   };

//   const handleNext = () => {
//     if (currentStep === 'hotel') {
//       setCurrentStep('activity');
//       fetchActivities();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep === 'activity') {
//       setCurrentStep('hotel');
//     }
//   };

//   const handleComplete = () => {
//     onComplete({
//       hotels: selectedHotels,
//       activities: selectedActivities
//     });
//   };

//   const clearHotelSearch = () => {
//     setHotelSearchQuery("");
//     fetchHotels();
//   };

//   const clearActivitySearch = () => {
//     setActivitySearchQuery("");
//     fetchActivities();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex items-center justify-center gap-4">
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 currentStep === 'hotel' 
//                   ? 'bg-blue-600 text-white' 
//                   : 'bg-green-600 text-white'
//               }`}>
//                 {currentStep === 'hotel' ? '1' : <Check className="w-6 h-6" />}
//               </div>
//               <span className="ml-3 font-semibold text-slate-700">Select Hotels</span>
//             </div>
            
//             <ChevronRight className="text-slate-400" />
            
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
//                 currentStep === 'activity' 
//                   ? 'bg-orange-600 text-white' 
//                   : 'bg-slate-300 text-slate-600'
//               }`}>
//                 2
//               </div>
//               <span className="ml-3 font-semibold text-slate-700">Select Activities</span>
//             </div>
//           </div>
//         </div>

//         {/* Hotel Selection */}
//         {currentStep === 'hotel' && (
//           <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
//               <CardTitle className="flex items-center justify-between text-xl text-white font-bold">
//                 <div className="flex items-center gap-3">
//                   <HotelIcon className="h-7 w-7" />
//                   Select Hotels
//                 </div>
//                 <div className="text-sm font-normal bg-white/20 px-4 py-2 rounded-full">
//                   {selectedHotels.length} selected
//                 </div>
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="p-6">
//               {/* Search Bar */}
//               <div className="mb-6 flex gap-2">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     placeholder="Search hotels..."
//                     value={hotelSearchQuery}
//                     onChange={(e) => setHotelSearchQuery(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleHotelSearch()}
//                     className="pl-10 pr-10 h-12 rounded-xl border-slate-300"
//                   />
//                   {hotelSearchQuery && (
//                     <button
//                       onClick={clearHotelSearch}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>
//                 <Button
//                   onClick={handleHotelSearch}
//                   disabled={searching}
//                   className="h-12 px-6 bg-blue-600 hover:bg-blue-700 rounded-xl"
//                 >
//                   {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
//                 </Button>
//               </div>

//               {/* Hotels List */}
//               {loadingHotels ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
//                   <p className="text-slate-600">Loading hotels...</p>
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-12">
//                   <p className="text-red-600 mb-4">{error}</p>
//                   <Button onClick={fetchHotels} variant="outline">
//                     Retry
//                   </Button>
//                 </div>
//               ) : hotels.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <Building className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                   <p className="text-lg">No hotels found</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//                   {hotels.map((hotel) => {
//                     const isSelected = selectedHotels.some(h => h._id === hotel._id);
                    
//                     return (
//                       <div
//                         key={hotel._id}
//                         onClick={() => toggleHotelSelection(hotel)}
//                         className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 p-5 ${
//                           isSelected
//                             ? 'border-blue-600 bg-blue-50 shadow-lg scale-[1.02]'
//                             : 'border-slate-200 bg-white hover:border-blue-300 shadow-md'
//                         }`}
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
//                             isSelected
//                               ? 'bg-blue-600 border-blue-600'
//                               : 'bg-white border-slate-300'
//                           }`}>
//                             {isSelected && <Check className="w-5 h-5 text-white" />}
//                           </div>

//                           <div className="flex-1">
//                             <h3 className="text-lg font-bold text-slate-900 mb-1">
//                               {hotel.name}
//                             </h3>
                            
//                             <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
//                               <MapPin className="w-4 h-4" />
//                               {hotel.address}
//                             </div>

//                             <div className="flex items-center gap-1">
//                               {[...Array(Math.floor(hotel.rating))].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   className="h-4 w-4 text-yellow-400 fill-yellow-400"
//                                 />
//                               ))}
//                               <span className="text-sm text-slate-600 ml-1 font-semibold">
//                                 {hotel.rating}
//                               </span>
//                             </div>

//                             {hotel.amenities && hotel.amenities.length > 0 && (
//                               <div className="mt-3 flex flex-wrap gap-2">
//                                 {hotel.amenities.slice(0, 3).map((amenity, idx) => (
//                                   <span
//                                     key={idx}
//                                     className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full"
//                                   >
//                                     {amenity}
//                                   </span>
//                                 ))}
//                                 {hotel.amenities.length > 3 && (
//                                   <span className="text-xs text-slate-500 px-2 py-1">
//                                     +{hotel.amenities.length - 3} more
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         {isSelected && (
//                           <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-xl rounded-tr-2xl text-xs font-bold">
//                             Selected
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="mt-6 flex justify-end">
//                 <Button
//                   onClick={handleNext}
//                   disabled={selectedHotels.length === 0}
//                   className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-semibold"
//                 >
//                   Next: Select Activities
//                   <ChevronRight className="ml-2 w-5 h-5" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Activity Selection */}
//         {currentStep === 'activity' && (
//           <Card className="bg-white shadow-2xl rounded-3xl border-0 overflow-hidden">
//             <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
//               <CardTitle className="flex items-center justify-between text-xl text-white font-bold">
//                 <div className="flex items-center gap-3">
//                   <Palmtree className="h-7 w-7" />
//                   Select Activities
//                 </div>
//                 <div className="text-sm font-normal bg-white/20 px-4 py-2 rounded-full">
//                   {selectedActivities.length} selected
//                 </div>
//               </CardTitle>
//             </CardHeader>

//             <CardContent className="p-6">
//               {/* Search Bar */}
//               <div className="mb-6 flex gap-2">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     placeholder="Search activities..."
//                     value={activitySearchQuery}
//                     onChange={(e) => setActivitySearchQuery(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleActivitySearch()}
//                     className="pl-10 pr-10 h-12 rounded-xl border-slate-300"
//                   />
//                   {activitySearchQuery && (
//                     <button
//                       onClick={clearActivitySearch}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>
//                 <Button
//                   onClick={handleActivitySearch}
//                   disabled={searching}
//                   className="h-12 px-6 bg-orange-600 hover:bg-orange-700 rounded-xl"
//                 >
//                   {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
//                 </Button>
//               </div>

//               {/* Activities List */}
//               {loadingActivities ? (
//                 <div className="flex flex-col items-center justify-center py-20">
//                   <Loader2 className="w-10 h-10 animate-spin text-orange-600 mb-4" />
//                   <p className="text-slate-600">Loading activities...</p>
//                 </div>
//               ) : error ? (
//                 <div className="text-center py-12">
//                   <p className="text-red-600 mb-4">{error}</p>
//                   <Button onClick={fetchActivities} variant="outline">
//                     Retry
//                   </Button>
//                 </div>
//               ) : activities.length === 0 ? (
//                 <div className="text-center py-12 text-slate-500">
//                   <Activity className="w-16 h-16 mx-auto mb-4 text-slate-300" />
//                   <p className="text-lg">No activities found</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
//                   {activities.map((activity) => {
//                     const isSelected = selectedActivities.some(a => a._id === activity._id);
                    
//                     return (
//                       <div
//                         key={activity._id}
//                         onClick={() => toggleActivitySelection(activity)}
//                         className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 p-5 ${
//                           isSelected
//                             ? 'border-orange-600 bg-orange-50 shadow-lg scale-[1.02]'
//                             : 'border-slate-200 bg-white hover:border-orange-300 shadow-md'
//                         }`}
//                       >
//                         <div className="flex items-start gap-4">
//                           <div className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${
//                             isSelected
//                               ? 'bg-orange-600 border-orange-600'
//                               : 'bg-white border-slate-300'
//                           }`}>
//                             {isSelected && <Check className="w-5 h-5 text-white" />}
//                           </div>

//                           <div className="flex-1">
//                             <h3 className="text-lg font-bold text-slate-900 mb-2">
//                               {activity.title}
//                             </h3>
                            
//                             <p className="text-sm text-slate-600 mb-3 line-clamp-2">
//                               {activity.description}
//                             </p>

//                             <div className="flex flex-wrap gap-2">
//                               {activity.category && (
//                                 <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
//                                   {activity.category}
//                                 </span>
//                               )}
//                               {activity.duration && (
//                                 <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
//                                   {activity.duration}
//                                 </span>
//                               )}
//                               {activity.location && (
//                                 <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
//                                   <MapPin className="w-3 h-3" />
//                                   {activity.location}
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         {isSelected && (
//                           <div className="absolute top-0 right-0 bg-orange-600 text-white px-3 py-1 rounded-bl-xl rounded-tr-2xl text-xs font-bold">
//                             Selected
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="mt-6 flex justify-between">
//                 <Button
//                   onClick={handleBack}
//                   variant="outline"
//                   className="px-6 py-6 rounded-xl text-lg font-semibold"
//                 >
//                   <ChevronRight className="mr-2 w-5 h-5 rotate-180" />
//                   Back to Hotels
//                 </Button>
                
//                 <Button
//                   onClick={handleComplete}
//                   disabled={selectedActivities.length === 0}
//                   className="px-8 py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-semibold"
//                 >
//                   Complete Selection
//                   <Check className="ml-2 w-5 h-5" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Summary Card */}
//         {(selectedHotels.length > 0 || selectedActivities.length > 0) && (
//           <Card className="mt-6 bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
//             <CardContent className="p-6">
//               <h3 className="text-lg font-bold text-slate-900 mb-4">Selection Summary</h3>
              
//               <div className="grid grid-cols-2 gap-6">
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <HotelIcon className="w-5 h-5 text-blue-600" />
//                     <span className="font-semibold text-slate-700">Hotels Selected</span>
//                   </div>
//                   <p className="text-3xl font-bold text-blue-600">{selectedHotels.length}</p>
//                 </div>
                
//                 <div>
//                   <div className="flex items-center gap-2 mb-2">
//                     <Palmtree className="w-5 h-5 text-orange-600" />
//                     <span className="font-semibold text-slate-700">Activities Selected</span>
//                   </div>
//                   <p className="text-3xl font-bold text-orange-600">{selectedActivities.length}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };