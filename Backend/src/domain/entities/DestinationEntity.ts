export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];  
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
