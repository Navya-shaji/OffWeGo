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
  category: string;
  destination: string;

  startDate: Date | string;
  endDate: Date | string;

  price: number;
  maxPeople: number;

  joinedUsers: string[];

  itinerary?: ItineraryItem[];

  hotels: HotelItem[];
  activities: ActivityItem[];

  status: "PENDING" | "ACTIVE" | "CANCELLED" | "COMPLETED" | "APPROVED";
  isApproved?: boolean;
}
