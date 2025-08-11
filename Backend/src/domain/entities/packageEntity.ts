import { Hotel } from "./HotelEntity";
import { Activity } from "./ActivityEntity";

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

  hotels: Hotel[]; 
  activities: Activity[]; 
}
