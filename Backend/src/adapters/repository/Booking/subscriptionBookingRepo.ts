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
    return this.model.find({
      vendorId,
      status: "active",
      endDate: { $gte: new Date() }
    }).populate("planId");
  }


  async expireOldSubscriptions(vendorId: string): Promise<void> {
    const now = new Date();

    await this.model.updateMany(
      {
        vendorId,
        status: "active",
        endDate: { $lt: now }
      },
      { status: "expired" }
    );
  }

  async getLatestSubscriptionByVendor(vendorId: string) {
    const now = new Date();

    return this.model.findOne({
      vendorId,
      status: "active",
      endDate: { $gte: now }
    }).sort({ createdAt: -1 });
  }

  async updateStatus(id: string, status: string) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateUsedPackages(id: string, usedPackages: number) {
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
