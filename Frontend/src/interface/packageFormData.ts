interface Hotel {
  hotelId: string; // IDs as string
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}

interface Activity {
  id: string; // IDs as string
  title: string;
  description: string;
  imageUrl: string;
  destinationId?: string;
}


export interface PackageFormData {
  id?: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  startDate?: string | Date;
  endDate?: string | Date;
  images: string[];
  selectedHotels: string[];       
  selectedActivities: string[];  
}
