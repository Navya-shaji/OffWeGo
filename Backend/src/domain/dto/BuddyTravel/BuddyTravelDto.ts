export interface ItineraryItemDto {
  day: number;
  title: string;
  description: string;
  time?: string;
}

export interface BuddyTravelDto {
  id?: string;
  title: string;
  destination: string;
  location: string;
  startDate: Date;
  endDate: Date;
  price: number;
  maxPeople: number;
  joinedUsers: string[];
  description: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  status: "PENDING" | "ACTIVE" | "CANCELLED" | "COMPLETED" | "APPROVED" | "REJECTED";
  tripStatus: "UPCOMING" | "ONGOING" | "COMPLETED";
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
  remainingSlots?: number;
  totalJoined?: number;

  itinerary?: ItineraryItemDto[];

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
