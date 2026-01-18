/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetVendorSubscriptionHistoryUseCase } from "../../domain/interface/SubscriptionPlan/IGetVendorHistory";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { VendorModel } from "../../framework/database/Models/vendorModel";

export class GetVendorSubscriptionHistoryUseCase implements IGetVendorSubscriptionHistoryUseCase {
  constructor(private _subscriptionBookingRepo: ISubscriptionBookingRepository) { }

  async execute(vendorId: string): Promise<any[]> {
    try {
      const bookings = await this._subscriptionBookingRepo.findByVendorId(vendorId);

      const vendor = await VendorModel.findById(vendorId);

      return bookings.map((booking: any) => {
        const bookingObj = booking.toObject ? booking.toObject() : booking;
        return {
          ...bookingObj,
          vendorDetails: vendor ? {
            name: vendor.name,
            email: vendor.email
          } : null
        };
      });
    } catch (error) {
      throw error;
    }
  }
}
