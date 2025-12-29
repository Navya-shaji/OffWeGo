export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  time?: string;
}

export interface HotelItem {
  name: string;
  address: string;
  rating: number;
  destinationId: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  destinationId: string;
}

export interface BuddyTravel {
  id?: string;
  vendorId: string;

  title: string;
  description: string;
  category?: string;
  categoryId?: string;
  destination: string;
  location?: string;

  startDate: Date | string;
  endDate: Date | string;

  price: number;
  maxPeople: number;

  joinedUsers: string[];
  reservedSlots?: number;
  remainingSlots?: number;
  totalJoined?: number;

  images?: string[];
  includedFeatures?: {
    food?: boolean;
    stay?: boolean;
    transport?: boolean;
    activities?: boolean;
    guide?: boolean;
    insurance?: boolean;
  };

  itinerary?: ItineraryItem[];
  hotels?: HotelItem[];
  activities?: ActivityItem[];

  status:
    | "PENDING"
    | "ACTIVE"
    | "CANCELLED"
    | "COMPLETED"
    | "APPROVED"
    | "REJECTED";
  tripStatus?: "UPCOMING" | "ONGOING" | "COMPLETED";
  isApproved?: boolean;
}
