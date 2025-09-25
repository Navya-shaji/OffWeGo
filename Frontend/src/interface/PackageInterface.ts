export interface Hotel {
  id?: string;          // local/frontend id
  hotelId?: string;     // backend id (Mongo or relational)
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

export interface Itinerary {
  day: number;          // Day number in trip (1, 2, 3…)
  time: string;         // HH:mm format or "Morning/Evening"
  activity: string;     // description/title
}

export interface Package {
  _id?: string;         // MongoDB _id (optional for frontend)
  id?: string;          // in case you normalize differently
  destinationId: string;
  vendorId: string;

  packageName: string;
  description: string;
  price: number;
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
}
