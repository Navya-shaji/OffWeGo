import type { Flight } from "./flightInterface";

export interface Hotel {
  id?: string;
  _id?: string;
  hotelId?: string;
  name: string;
  address: string;
  rating: number;
  destinationId: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Activity {
  id?: string;
  _id?: string;
  activityId?: string;
  title: string;
  description: string;
  destinationId?: string;
  imageUrl: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}



export interface Itinerary {
  day: number;
  time: string;
  activity: string;
}

export interface Package {
  _id?: string;
  id?: string;
  vendorId?: string;
  destinationId: string;

  packageName: string;
  description: string;


  price: number;         
  flightPrice?: number;       


  duration?: number;
  startDate?: string | Date;
  endDate?: string | Date;


  images: string[];
  hotels: Hotel[];
  activities: Activity[];


  checkInTime?: string;
  checkOutTime?: string;
  itinerary?: Itinerary[];


  inclusions?: string[];
  amenities?: string[];


  flightOption: boolean;     
  flight?: Flight | null;   
}
