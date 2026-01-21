/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGetVendorSubscriptionHistoryUseCase } from "../../domain/interface/SubscriptionPlan/IGetVendorHistory";
import { ISubscriptionBookingRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { VendorModel } from "../../framework/database/Models/vendorModel";

export class GetVendorSubscriptionHistoryUseCase implements IGetVendorSubscriptionHistoryUseCase {
  constructor(private _subscriptionBookingRepo: ISubscriptionBookingRepository) { }

  async execute(vendorId: string, search?: string, status?: string, skip?: number, limit?: number): Promise<{ bookings: any[]; total: number }> {
    return this._subscriptionBookingRepo.findByVendorId(vendorId, search, status, skip, limit);
  }
}
