import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { IBuddyTravelModel } from "../../framework/database/Models/BuddyTravelModel";

export const mapToBuddyTravelDto = (doc: IBuddyTravelModel): BuddyTravel => ({
  id: doc._id.toString(),
  title: doc.title,
  destination: doc.destination,
  location: doc.location || doc.destination,
  startDate: doc.startDate,
  endDate: doc.endDate,
  price: doc.price,
  maxPeople: doc.maxPeople,
  joinedUsers: doc.joinedUsers || [],
  description: doc.description,
  categoryId: doc.categoryId?.toString() || doc.category || "",
  category: doc.category,
  status: doc.status,
  tripStatus: doc.tripStatus || "UPCOMING",
  vendorId: doc.vendorId,
  isApproved: doc.isApproved,
  includedFeatures: doc.includedFeatures || {
    food: false,
    stay: false,
    transport: false,
    activities: false,
    guide: false,
    insurance: false,
  },
  itinerary: doc.itinerary || [],
  hotels: doc.hotels || [],
  activities: doc.activities || [],
});
