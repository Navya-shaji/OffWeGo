import { Activity } from "./ActivityEntity";
import { Hotel } from "./HotelEntity";

export interface Package {
  id: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
  duration: number; 
  startDate: Date;
  endDate: Date;
  images: string[];
  hotelDetails: Hotel[];
  activities: Activity[];
}
