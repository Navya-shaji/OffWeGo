import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { IBuddyTravelModel } from "../../framework/database/Models/BuddyTravelModel";

export const mapToBuddyTravelDto = (doc: IBuddyTravelModel): BuddyTravel => ({
  id: doc._id.toString(),
  title: doc.title,
  destination: doc.destination,
  startDate: doc.startDate,
  endDate: doc.endDate,
  price: doc.price,
  maxPeople: doc.maxPeople,
  joinedUsers: doc.joinedUsers,
  description: doc.description,
  category: doc.category,
  status: doc.status,
  vendorId: doc.vendorId,
  isApproved: doc.isApproved,
  itinerary: doc.itinerary || [],
});
