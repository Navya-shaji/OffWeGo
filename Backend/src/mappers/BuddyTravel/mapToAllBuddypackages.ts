import { BuddyTravel } from "../../domain/entities/BuddyTripEntity";
import { BuddyTravelDto } from "../../domain/dto/BuddyTravel/BuddyTravelDto";

export const mapToBuddyTravelDto = (obj: BuddyTravel): BuddyTravelDto => ({
  id: obj.id,
  title: obj.title,
  destination: obj.destination,
  startDate: obj.startDate,
  endDate: obj.endDate,
  price: obj.price,
  maxPeople: obj.maxPeople,
  joinedUsers: obj.joinedUsers || [],
  description: obj.description,
  category: obj.category,
  status: obj.status,
  vendorId: obj.vendorId,
  isApproved: obj.isApproved,

  itinerary: obj.itinerary || [],

  hotels: obj.hotels || [],

  activities: obj.activities || []
});

export const mapToBuddyTravelDtoArray = (objs: BuddyTravel[]): BuddyTravelDto[] => {
  return objs.map((obj) => mapToBuddyTravelDto(obj));
};
