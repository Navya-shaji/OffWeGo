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
    return created;
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
    if (!trip || trip.maxPeople <= 0) return null;

    if (!trip.joinedUsers.includes(userId)) {
      trip.joinedUsers.push(userId);
      trip.maxPeople -= 1;
      await trip.save();
    }
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
}
