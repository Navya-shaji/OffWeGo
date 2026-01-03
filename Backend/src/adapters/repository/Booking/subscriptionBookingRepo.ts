import {
  ISubscriptionBookingModel,
  subscriptionBookingModel,
} from "../../../framework/database/Models/SubscriptionBookingModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";
import { ISubscriptionBookingRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { StripeService } from "../../../framework/Services/stripeService";
import * as QRCode from "qrcode";
import { VendorModel } from "../../../framework/database/Models/vendorModel";

export class SubscriptionBookingRepository
  extends BaseRepository<ISubscriptionBookingModel>
  implements ISubscriptionBookingRepository
{
  constructor() {
    super(subscriptionBookingModel);
  }

  private stripeService = new StripeService();

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
      planId, // Mongoose will handle ObjectId conversion automatically
      status: "pending"
    });
  }

  async findBySessionId(sessionId: string) {
    return this.model.findOne({
      stripeSessionId: sessionId
    }).populate("planId");
  }

  async updateBooking(id: string, data: Partial<ISubscriptionBookingModel>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async cancelBooking(id: string) {
    return this.model.findByIdAndUpdate(
      id, 
      { status: "cancelled" }, 
      { new: true }
    );
  }

  async retryPayment(id: string, domainUrl: string) {
    try {
      const booking = await this.model.findById(id).populate("planId");
      if (!booking || booking.status !== "pending") {
        return null;
      }

      const plan = booking.planId as any;
      if (!plan || !plan.stripePriceId) {
        return null;
      }

      const session = await this.stripeService.createSubscriptionCheckoutSession(
        plan.stripePriceId,
        domainUrl,
        booking._id.toString()
      );

      await this.model.findByIdAndUpdate(id, {
        stripeSessionId: session.sessionId,
      });

      const qrCodeUrl = await QRCode.toDataURL(session.checkoutUrl);

      return {
        checkoutUrl: session.checkoutUrl,
        qrCode: qrCodeUrl,
      };
    } catch (error) {
      console.error("Error in retryPayment:", error);
      throw error;
    }
  }
   async getAllSubscriptions() {
    const bookings = await this.model.find()
      .populate("planId")
      .sort({ createdAt: -1 });
    
    // Fetch vendor details separately since vendorId is a string, not an ObjectId ref
    const VendorModel = require("../../../framework/database/Models/vendorModel").VendorModel;
    const vendorIds = Array.from(new Set(bookings.map((b: any) => b.vendorId).filter(Boolean)));
    const vendors = await VendorModel.find({ _id: { $in: vendorIds } });
    
    // Create a map of vendorId to vendor details
    const vendorMap = vendors.reduce((map: any, vendor: any) => {
      map[vendor._id.toString()] = vendor;
      return map;
    }, {});
    
    // Attach vendor details to each booking while preserving Mongoose document methods
    return bookings.map((booking: any) => {
      const bookingObj = booking.toObject();
      return {
        ...bookingObj,
        vendorDetails: vendorMap[booking.vendorId] || null
      };
    });
  }

  async findByVendorId(vendorId: string) {
    const bookings = await this.model.find({ vendorId })
      .populate("planId")
      .sort({ createdAt: -1 });

    const vendor = await VendorModel.findById(vendorId);

    return bookings.map((booking: any) => {
      const bookingObj = booking.toObject();
      return {
        ...bookingObj,
        vendorDetails: vendor ? {
          name: vendor.name,
          email: vendor.email
        } : null
      };
    });
  }
  
}
