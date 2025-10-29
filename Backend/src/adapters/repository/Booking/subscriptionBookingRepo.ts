import { ISubscriptionBookingModel, subscriptionBookingModel } from "../../../framework/database/Models/SubscriptionBookingModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";


export class SubscriptionBookingRepository extends BaseRepository<ISubscriptionBookingModel> {
  constructor() {
    super(subscriptionBookingModel);
  }

  async findByVendor(vendorId: string) {
    return this.model.find({ vendorId }).populate("planId");
  }

  async findActiveBookings(vendorId: string) {
    return this.model.find({ vendorId, status: "active" }).populate("planId");
  }

  async cancelBooking(id: string) {
    return this.update(id, { status: "canceled" });
  }
}
