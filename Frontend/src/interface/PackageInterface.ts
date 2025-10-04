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

export interface Itinerary {
  day: number;         
  time: string;        
  activity: string;   
}

export interface Package {
  _id?: string;         
  id?: string;         
  destinationId: string;
  vendorId?: string;

  packageName: string;
  description: string;
  price: number;
  duration?: number;

  startDate?: string | Date;
  endDate?: string | Date;

  images: string[];
  hotels:Hotel [];
  activities: Activity[];

  checkInTime?: string;
  checkOutTime?: string;
  itinerary?: Itinerary[];
  inclusions?: string[];
  amenities?: string[];
}
