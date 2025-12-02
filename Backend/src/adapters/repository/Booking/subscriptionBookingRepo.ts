import {
  ISubscriptionBookingModel,
  subscriptionBookingModel,
} from "../../../framework/database/Models/SubscriptionBookingModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";
import { ISubscriptionBookingRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";

export class SubscriptionBookingRepository
  extends BaseRepository<ISubscriptionBookingModel>
  implements ISubscriptionBookingRepository
{
  constructor() {
    super(subscriptionBookingModel);
  }

  async create(data: Partial<ISubscriptionBookingModel>) {
    const created = await this.model.create(data);
    return created.populate("planId");
  }

  async findByVendor(vendorId: string) {
    return this.model.find({ vendorId }).populate("planId");
  }

  async findActiveBookings(vendorId: string) {
    return this.model.find({ vendorId, status: "active" }).populate("planId");
  }

  async getLatestSubscriptionByVendor(vendorId: string) {
    return this.model
      .findOne({ vendorId })
      .sort({ createdAt: -1 })
      .populate("planId");
  }

  async updateStatus(id: string, status: string) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }
     async updateUsedPackages(
    id: string,
    usedPackages: number
  ): Promise<ISubscriptionBookingModel | null> {
    return this.model.findByIdAndUpdate(
      id,
      { usedPackages },
      { new: true }
    );
  }
  async findPendingBooking(vendorId: string, planId: string) {
  return this.model.findOne({
    vendorId,
    planId,
    status: "pending"
  });
}

async updateBooking(id: string, data: Partial<ISubscriptionBookingModel>) {
  return this.model.findByIdAndUpdate(id, data, { new: true });
}

}
