export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}