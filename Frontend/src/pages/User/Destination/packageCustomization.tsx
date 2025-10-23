// import { useState } from "react";
// import { 
//   Settings, 
//   X, 
//   CheckCircle, 
//   Building, 
//   Activity,
//   Sparkles,
//   ArrowRight
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import type { Hotel, Activity as ActivityType } from "@/interface/PackageInterface";
// import { HotelActivitySelectionPage } from "@/components/Packages/HotelSelectionModal";

// interface PackageCustomizationProps {
//   destinationId: string;
//   currentHotels: Hotel[];
//   currentActivities: ActivityType[];
//   onCustomizationComplete: (
//     selectedHotels: Hotel[],
//     selectedActivities: ActivityType[]
//   ) => void;
// }

// export const PackageCustomization = ({
//   destinationId,
//   currentHotels,
//   currentActivities,
//   onCustomizationComplete,
// }: PackageCustomizationProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedHotels, setSelectedHotels] = useState<Hotel[]>(currentHotels);
//   const [selectedActivities, setSelectedActivities] = useState<ActivityType[]>(currentActivities);
//   const [activeTab, setActiveTab] = useState<"hotels" | "activities">("hotels");

//   const handleApplyCustomization = () => {
//     onCustomizationComplete(selectedHotels, selectedActivities);
//     setIsOpen(false);
//   };

//   const handleReset = () => {
//     setSelectedHotels(currentHotels);
//     setSelectedActivities(currentActivities);
//   };

//   const hasChanges = 
//     selectedHotels.length !== currentHotels.length ||
//     selectedActivities.length !== currentActivities.length ||
//     !selectedHotels.every(h => currentHotels.some(ch => ch.id === h.id)) ||
//     !selectedActivities.every(a => currentActivities.some(ca => ca.id === a.id));

//   return (
//     <>
//       {/* Customization Button */}
//       <Card className="shadow-xl border-0 overflow-hidden bg-white/95 backdrop-blur-sm">
//         <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
//           <CardTitle className="flex items-center gap-3 text-lg">
//             <Sparkles className="h-6 w-6" />
//             Customize Your Package
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <p className="text-slate-600 mb-4">
//             Tailor your experience by selecting your preferred hotels and activities
//           </p>
//           <Button
//             onClick={() => setIsOpen(true)}
//             className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             <Settings className="h-5 w-5 mr-2" />
//             Customize Package
//           </Button>
//         </CardContent>
//       </Card>

     
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 p-6 text-white">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-white/20 rounded-xl">
//                     <Sparkles className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-bold">Customize Your Package</h2>
//                     <p className="text-sm text-white/80">Select your preferred hotels and activities</p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsOpen(false)}
//                   className="text-white hover:bg-white/20 rounded-xl"
//                 >
//                   <X className="h-5 w-5" />
//                 </Button>
//               </div>

//               {/* Tabs */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setActiveTab("hotels")}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === "hotels"
//                       ? "bg-white text-purple-700 shadow-lg"
//                       : "bg-white/20 text-white hover:bg-white/30"
//                   }`}
//                 >
//                   <Building className="h-4 w-4" />
//                   Hotels
//                   <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
//                     {selectedHotels.length}
//                   </span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("activities")}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
//                     activeTab === "activities"
//                       ? "bg-white text-purple-700 shadow-lg"
//                       : "bg-white/20 text-white hover:bg-white/30"
//                   }`}
//                 >
//                   <Activity className="h-4 w-4" />
//                   Activities
//                   <span className="bg-white/30 px-2 py-0.5 rounded-full text-xs">
//                     {selectedActivities.length}
//                   </span>
//                 </button>
//               </div>
//             </div>

//            <HotelActivitySelectionPage
//   destinationId="your-destination-id"
//   onComplete={(data) => {
//     console.log('Selected Hotels:', data.hotels);
//     console.log('Selected Activities:', data.activities);
//     // Handle the selection data
//   }}
// />

//             {/* Footer */}
//             <div className="border-t border-slate-200 p-6 bg-slate-50">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="text-sm text-slate-600">
//                   <div className="font-semibold text-slate-800 mb-1">Current Selection:</div>
//                   <div className="flex gap-4">
//                     <span className="flex items-center gap-1">
//                       <Building className="h-4 w-4 text-blue-600" />
//                       {selectedHotels.length} Hotels
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Activity className="h-4 w-4 text-orange-600" />
//                       {selectedActivities.length} Activities
//                     </span>
//                   </div>
//                 </div>

//                 {hasChanges && (
//                   <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
//                     <Sparkles className="h-4 w-4" />
//                     Changes detected
//                   </div>
//                 )}
//               </div>

//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   onClick={handleReset}
//                   disabled={!hasChanges}
//                   className="flex-1 h-12 rounded-xl font-semibold border-2 hover:bg-slate-100"
//                 >
//                   Reset to Original
//                 </Button>
//                 <Button
//                   onClick={handleApplyCustomization}
//                   className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   <CheckCircle className="h-5 w-5 mr-2" />
//                   Apply Customization
//                   <ArrowRight className="h-5 w-5 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };