import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";

export const mapToBuddyTravelDto = (obj: BuddyTravel): BuddyTravelDto => {
  // Handle categoryId - can be string or populated object
  const categoryIdValue = typeof (obj.categoryId as any) === 'string' 
    ? (obj.categoryId as string)
    : (obj.categoryId as any)?._id?.toString() || (obj.categoryId as any)?.id?.toString() || "";
  
  // Handle category - check if categoryId is populated as an object (runtime check)
  let category: { id: string; name: string; description?: string } | undefined;
  if (obj.categoryId && typeof (obj.categoryId as any) === 'object' && !Array.isArray(obj.categoryId)) {
    const populatedCategory = obj.categoryId as any;
    category = {
      id: populatedCategory._id?.toString() || populatedCategory.id || "",
      name: populatedCategory.name || "",
      description: populatedCategory.description,
    };
  }

  return {
    id: obj.id,
    title: obj.title,
    destination: obj.destination,
    location: obj.location || obj.destination,
    startDate: obj.startDate,
    endDate: obj.endDate,
    price: obj.price,
    maxPeople: obj.maxPeople,
    joinedUsers: obj.joinedUsers || [],
    description: obj.description,
    categoryId: categoryIdValue || (typeof obj.category === 'string' ? obj.category : "") || "",
    category,
    status: obj.status,
    tripStatus: obj.tripStatus || "UPCOMING",
    vendorId: obj.vendorId,
    isApproved: obj.isApproved,
    includedFeatures: obj.includedFeatures,
    itinerary: obj.itinerary || [],
    hotels: obj.hotels || [],
    activities: obj.activities || [],
    totalJoined: obj.joinedUsers?.length || 0,
    remainingSlots: obj.maxPeople - (obj.joinedUsers?.length || 0),
  };
};

export const mapToBuddyTravelDtoArray = (objs: BuddyTravel[]): BuddyTravelDto[] => {
  return objs.map((obj) => mapToBuddyTravelDto(obj));
};
