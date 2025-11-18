export interface BuddyTravel {
  id?: string;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  price: number;
  maxPeople: number;
  joinedUsers: string[];
  description: string;
  category: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED' | 'APPROVED';
  vendorId: string;
  isApproved: boolean;

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
