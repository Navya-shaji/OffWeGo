import { BuddyTravel } from "../../../domain/entities/BuddyTripEntity";
import { IBuddyTravelRepository } from "../../../domain/interface/BuddyTravel/IBuddyTravelRepository";
import { BuddyTravelModel, IBuddyTravelModel } from "../../../framework/database/Models/BuddyTravelModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class BuddyTravelRepository
  extends BaseRepository<IBuddyTravelModel>
  implements IBuddyTravelRepository
{
  constructor() {
    super(BuddyTravelModel);
  }

  async createBuddyTrip(data: BuddyTravel): Promise<IBuddyTravelModel> {
    const created = await this.model.create(data);
    return created.toObject();
  }

  async getAllBuddyTrips(skip: number, limit: number) {
    const [trips, totalTrips] = await Promise.all([
      this.model.find().skip(skip).limit(limit),
      this.model.countDocuments(),
    ]);
    return { trips, totalTrips };
  }

  async getBuddyTripsByCategory(category: string, skip: number, limit: number) {
    const [trips, totalTrips] = await Promise.all([
      this.model.find({ category }).skip(skip).limit(limit),
      this.model.countDocuments({ category }),
    ]);
    return { trips, totalTrips };
  }

async joinBuddyTrip(tripId: string, userId: string) {
  const trip = await this.model.findById(tripId);

  if (!trip) {
    throw new Error("Trip not found");
  }

  // Check if trip is approved
  if (trip.status !== "APPROVED") {
    throw new Error("Trip is not approved yet");
  }

  // Check trip status - cannot join if Ongoing or Completed
  if (trip.tripStatus === "ONGOING" || trip.tripStatus === "COMPLETED") {
    throw new Error(`Cannot join trip. Trip status is ${trip.tripStatus}`);
  }

  // Check for duplicate join
  if (trip.joinedUsers.includes(userId)) {
    throw new Error("You have already joined this trip");
  }

  // Check if max people limit reached
  if (trip.joinedUsers.length >= trip.maxPeople) {
    throw new Error("Trip is full. Maximum number of people reached");
  }

  trip.joinedUsers.push(userId);
  await trip.save();
  return trip;
}


  async deleteBuddyTrip(id: string) {
    return await this.model.findByIdAndDelete(id);
  }

  async searchBuddyTrips(query: string) {
    const regex = new RegExp(query.trim(), "i");
    return await this.model.find({ title: { $regex: regex } }).limit(10);
  }

  async getTripsByVendor(vendorId: string, skip: number, limit: number) {
    const [trips, totalTrips] = await Promise.all([
      this.model.find({ vendorId }).skip(skip).limit(limit),
      this.model.countDocuments({ vendorId }),
    ]);
    return { trips, totalTrips };
  }

async findByStatus(status: string): Promise<IBuddyTravelModel[]> {
  const results = await this.model.find({ status }).lean();
  return results as unknown as IBuddyTravelModel[];
}


  async approveBuddyPackage(id: string): Promise<IBuddyTravelModel | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        status: "APPROVED",
        isApproved: true,
      },
      { new: true }
    );
    return result ? (result.toObject() as IBuddyTravelModel) : null;
  }

  async rejectBuddyPackage(id: string): Promise<IBuddyTravelModel | null> {
    const result = await this.model.findByIdAndUpdate(
      id,
      {
        status: "REJECTED",
        isApproved: false,
      },
      { new: true }
    );
    return result ? (result.toObject() as IBuddyTravelModel) : null;
  }
async findAll(): Promise<IBuddyTravelModel[]> {
  return this.model.find().lean() as unknown as IBuddyTravelModel[];
}

async updateTripStatus(id: string, tripStatus: "UPCOMING" | "ONGOING" | "COMPLETED"): Promise<IBuddyTravelModel | null> {
  return this.model.findByIdAndUpdate(
    id,
    { tripStatus },
    { new: true }
  );
}

async getBuddyTripsByCategoryId(categoryId: string, skip: number, limit: number) {
  const [trips, totalTrips] = await Promise.all([
    this.model.find({ categoryId }).skip(skip).limit(limit).populate("categoryId"),
    this.model.countDocuments({ categoryId }),
  ]);
  return { trips, totalTrips };
}

}
