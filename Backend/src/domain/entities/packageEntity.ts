import { Hotel } from "./HotelEntity";
import { Activity } from "./ActivityEntity";

export interface Package {
  id?: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  images: string[];
  vendorId: string;
  hotels: Hotel[];
  activities: Activity[];
  checkInTime: string;
  checkOutTime: string;
  itinerary: {
    day: number;
    time: string;
    activity: string;
  }[];

  inclusions: string[];
  amenities: string[];
}
