export interface DestinationInterface{
  id?:string,
  _id?: string,
  name: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrls: string[]; 
}