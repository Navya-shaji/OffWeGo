export interface DestinationInterface{
  name: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
   imageUrls: string[]; 
}