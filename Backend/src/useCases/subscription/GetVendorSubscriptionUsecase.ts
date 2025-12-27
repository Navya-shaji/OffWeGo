import { IGetVendorSubscriptionHistoryUseCase } from "../../domain/interface/SubscriptionPlan/IGetVendorHistory";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";

export class GetVendorSubscriptionHistoryUseCase implements IGetVendorSubscriptionHistoryUseCase {
  constructor(private _subscriptionBookingRepo: ISubscriptionBookingRepository) {}

  async execute(vendorId: string): Promise<any[]> {
    try {
      // Get all subscription bookings for the vendor
      const bookings = await this._subscriptionBookingRepo.findByVendorId(vendorId);
      
      // Fetch vendor details separately since vendorId is a string, not an ObjectId ref
      const VendorModel = require("../../framework/database/Models/vendorModel").VendorModel;
      const vendor = await VendorModel.findById(vendorId);
      
      // Attach vendor details to each booking
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
      console.error("Error in GetVendorSubscriptionHistoryUseCase:", error);
      throw error;
    }
  }
}
