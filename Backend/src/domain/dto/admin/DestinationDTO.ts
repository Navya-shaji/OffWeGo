export interface CreateDestinationDTO {
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}