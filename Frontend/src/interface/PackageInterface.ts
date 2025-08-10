export interface Hotel {
  hotelId ?: string;
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}
export interface Activity {
  activityId?: string;
  title: string;
  description: string;
  destinationId ?: string;
}


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
