export interface Hotel {
  id?: string;
  hotelId?: string;
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}

export interface Activity {
  id?: string;
  activityId?: string;
  title: string;
  description: string;
  destinationId?: string;
  imageUrl: string;
}

export interface Flight {
  id?: string;
  date: string | Date;
  fromLocation: string;
  toLocation: string;
  airLine: string;
  price: number;
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

  /** 🔹 Prices */
  basePrice: number;          // Main package price
  flightPrice?: number;       // Price of flight (if applicable)

  /** 🔹 Duration & Dates */
  duration?: number;
  startDate?: string | Date;
  endDate?: string | Date;

  /** 🔹 Media & Related Models */
  images: string[];
  hotels: Hotel[];
  activities: Activity[];

  /** 🔹 Times & Schedule */
  checkInTime?: string;
  checkOutTime?: string;
  itinerary?: Itinerary[];

  /** 🔹 Details */
  inclusions?: string[];
  amenities?: string[];


  flightOption: boolean;     
  flight?: Flight | null;   
}
