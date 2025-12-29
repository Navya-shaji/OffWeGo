export interface BuddyTravel {
  id?: string;
  title: string;
  destination: string;
  location: string;
  startDate: Date;
  endDate: Date;
  price: number;
  maxPeople: number;
  joinedUsers: string[];
  images?: string[];
  reservedSlots?: number;
  description: string;
  categoryId: string;
  category?: string; // For backward compatibility
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  tripStatus: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  vendorId: string;
  isApproved: boolean;
  includedFeatures?: {
    food: boolean;
    stay: boolean;
    transport: boolean;
    activities: boolean;
    guide: boolean;
    insurance: boolean;
  };

  itinerary?: {
    day: number;
    title: string;
    description: string;
    time?: string;
  }[];

  hotels?: {
    name: string;
    address: string;
    rating: number;
    destinationId: string;
  }[];

  activities?: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    destinationId: string;
  }[];
}
