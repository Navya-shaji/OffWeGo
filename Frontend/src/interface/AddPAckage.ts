 export interface Hotel {
  hotelId: string; 
  name: string;
  address: string;
  rating: number;
  destinationId?: string;
}

 export interface Activity {
  id: string; 
  title: string;
  description: string;
  imageUrl: string;
  destinationId?: string;
}


export interface PackageData {
  id?: string;
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
  duration: number;
  startDate?: string | Date;
  endDate?: string | Date;
  images: string[];
  selectedHotels: Hotel[];       
  selectedActivities: Activity[];  
}
