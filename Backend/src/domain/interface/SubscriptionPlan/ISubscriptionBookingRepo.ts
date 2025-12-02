import { ISubscriptionBookingModel } from "../../../framework/database/Models/SubscriptionBookingModel";

export interface ISubscriptionBookingRepository {
  create(
    data: Partial<ISubscriptionBookingModel>
  ): Promise<ISubscriptionBookingModel>;

  findByVendor(vendorId: string): Promise<ISubscriptionBookingModel[]>;

  findActiveBookings(vendorId: string): Promise<ISubscriptionBookingModel[]>;

  getLatestSubscriptionByVendor(
    vendorId: string
  ): Promise<ISubscriptionBookingModel | null>;

  updateStatus(
    id: string,
    status: string
  ): Promise<ISubscriptionBookingModel | null>;

  updateUsedPackages(
    id: string,
    usedPackages: number
  ): Promise<ISubscriptionBookingModel | null>;

  findPendingBooking(
    vendorId: string,
    planId: string
  ): Promise<ISubscriptionBookingModel | null>;

  updateBooking(
    id: string,
    data: Partial<ISubscriptionBookingModel>
  ): Promise<ISubscriptionBookingModel | null>;
}
