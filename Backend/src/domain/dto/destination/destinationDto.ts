export interface UpdateDestinationDTO {
  name: string;
  location: string;
  description: string;
  imageUrls: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}
