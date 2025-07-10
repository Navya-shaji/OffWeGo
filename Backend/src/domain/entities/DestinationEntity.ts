export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];  // ✅ Corrected key and type
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
