export interface Hotel {
  id?:string
  hotelId ?: string;
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}
export interface Activity {
  _id?:string
  activityId?: string;
  title: string;
  description: string;
  destinationId ?: string;
  imageUrl:string
}

export interface Package {
  id?: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
  duration?: number; 
  startDate?: Date;
  endDate?: Date;
  images: string[];
  hotels: Hotel[];
  activities: Activity[];
}
