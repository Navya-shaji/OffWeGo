export interface PackageDTO {
  id: string;
  vendorId: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;         
  flightPrice: number;     
  duration: number;
  startDate: Date | null;
  endDate: Date | null;
  images: string[];
  hotels: { name: string; address: string; rating: number; destinationId: string }[];
  activities: { id: string; title: string; description: string; imageUrl: string; destinationId: string }[];
  checkInTime: string;
  checkOutTime: string;
  itinerary: { day: number; time: string; activity: string }[];
  inclusions: string[];
  amenities: string[];
  flightOption: boolean; 
  flight?: { id: string; airLine: string;  price: {economy:number,premium:number,business:number} } | null;
}
