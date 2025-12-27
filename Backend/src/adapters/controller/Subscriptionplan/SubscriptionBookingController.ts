import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBookingSubscriptionUseCase } from "../../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";
import { ISubscriptionBookingRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { IGetVendorSubscriptionHistoryUseCase } from "../../../domain/interface/SubscriptionPlan/IGetVendorHistory";

export class SubscriptionBookingController {
  constructor(
    private _createBookingSubscriptionUsecase: ICreateBookingSubscriptionUseCase,
    private _subscriptionBookingRepository: ISubscriptionBookingRepository,
    private _getVendorSubscriptionHistoryUsecase: IGetVendorSubscriptionHistoryUseCase
  ) {}

  async createSubscriptionBooking(req: Request, res: Response): Promise<void> {
    try {
      const { vendorId, planId, date, time } = req.body;
      const domainUrl = process.env.DOMAIN_URL || "https://yourdomain.com";

      const result = await this._createBookingSubscriptionUsecase.execute({
        vendorId,
        planId,
        date,
        time,
        domainUrl,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Subscription booking created successfully",
        data: result,
      });
    } catch (error) {
      console.error(" Error creating subscription booking:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (error as Error).message });
    }
  }

  async getVendorSubscription(req: Request, res: Response): Promise<void> {
    try {
      // Get vendorId from JWT token (set by authentication middleware)
      const vendorId = req.user?.id || req.user?.userId;
      
      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in token",
        });
        return;
      }

      // Expire old subscriptions first
      await this._subscriptionBookingRepository.expireOldSubscriptions(vendorId);

      // Get the latest active subscription
      const subscription = await this._subscriptionBookingRepository.getLatestSubscriptionByVendor(vendorId);

      if (!subscription) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: "No active subscription found",
          data: null,
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription fetched successfully",
        data: subscription,
      });
    } catch (error) {
      console.error("Error fetching vendor subscription:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch subscription",
        error: (error as Error).message,
      });
    }
  }

  async getVendorSubscriptionHistory(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = req.user?.id || req.user?._id;
      
      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in authentication token",
        });
        return;
      }

      const result = await this._getVendorSubscriptionHistoryUsecase.execute(vendorId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Vendor subscription history fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching vendor subscription history:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch vendor subscription history",
        error: (error as Error).message,
      });
    }
  }
}
