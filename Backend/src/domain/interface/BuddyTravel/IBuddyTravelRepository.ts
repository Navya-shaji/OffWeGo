import { BuddyTravel } from "../../entities/BuddyTripEntity";

export interface IBuddyTravelRepository {
  createBuddyTrip(data: BuddyTravel): Promise<BuddyTravel>;
  getAllBuddyTrips(skip: number, limit: number): Promise<{
    trips: BuddyTravel[];
    totalTrips: number;
  }>;
  getBuddyTripsByCategory(
    category: string,
    skip: number,
    limit: number
  ): Promise<{
    trips: BuddyTravel[];
    totalTrips: number;
  }>;
  joinBuddyTrip(tripId: string, userId: string): Promise<BuddyTravel | null>;
  deleteBuddyTrip(id: string): Promise<BuddyTravel | null>;
  searchBuddyTrips(query: string): Promise<BuddyTravel[]>;
  getTripsByVendor(
    vendorId: string,
    skip: number,
    limit: number
  ): Promise<{ trips: BuddyTravel[]; totalTrips: number }>;

  findByStatus(status: string): Promise<BuddyTravel[]>;
  approveBuddyPackage(id: string): Promise<BuddyTravel | null>;
  rejectBuddyPackage(id: string): Promise<BuddyTravel | null>;
}
