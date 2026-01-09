export interface DestinationInterface{
  id?:string,
  _id?: string,
  name: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  imageUrls: string[];
  category?: string;
  rating?: number;
  visitorCount?: string | number;
  bestTimeToVisit?: string;
  distance?: number;
}