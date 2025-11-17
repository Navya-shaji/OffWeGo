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

  if (!trip) return null;

  if (trip.status !== "APPROVED") return null;
  if (trip.joinedUsers.includes(userId)) return trip;
  if (trip.joinedUsers.length >= trip.maxPeople) return null;

  trip.joinedUsers.push(userId);
  trip.maxPeople = trip.maxPeople - 1;

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

async findByStatus(): Promise<IBuddyTravelModel[]> {
  const statuses = ["APPROVED", "PENDING", "REJECTED"];
  return this.model.find({ status: { $in: statuses } });
}


  async approveBuddyPackage(id: string): Promise<IBuddyTravelModel | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        status: "APPROVED",
        isApproved: true,
      },
      { new: true }
    );
  }

  async rejectBuddyPackage(id: string): Promise<IBuddyTravelModel | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        status: "REJECTED",
        isApproved: false,
      },
      { new: true }
    );
  }
async findAll(): Promise<IBuddyTravelModel[]> {
  return this.model.find().lean() as unknown as IBuddyTravelModel[];
}

}
