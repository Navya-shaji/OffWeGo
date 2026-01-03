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

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
    
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: (error as Error).message });
    }
  }

  async getVendorSubscription(req: Request, res: Response): Promise<void> {
    try {
  
      const vendorId = req.user?.id || req.user?.userId;
      
      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in token",
        });
        return;
      }


      await this._subscriptionBookingRepository.expireOldSubscriptions(vendorId);


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
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch vendor subscription history",
        error: (error as Error).message,
      });
    }
  }

  async cancelSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const vendorId = req.user?.id || req.user?.userId;

      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in token",
        });
        return;
      }

      const booking = await this._subscriptionBookingRepository.findByVendor(vendorId);
      const vendorBooking = booking.find(b => b._id.toString() === bookingId);

      if (!vendorBooking) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Subscription booking not found",
        });
        return;
      }

      if (vendorBooking.status !== "pending") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Only pending subscriptions can be cancelled",
        });
        return;
      }

      const cancelledBooking = await this._subscriptionBookingRepository.cancelBooking(bookingId);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription cancelled successfully",
        data: cancelledBooking,
      });
    } catch (error) {
 
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to cancel subscription",
        error: (error as Error).message,
      });
    }
  }

  async retryPayment(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const vendorId = req.user?.id || req.user?.userId;
      const domainUrl = process.env.DOMAIN_URL || "https://yourdomain.com";

      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in token",
        });
        return;
      }

      const booking = await this._subscriptionBookingRepository.findByVendor(vendorId);
      const vendorBooking = booking.find(b => b._id.toString() === bookingId);

      if (!vendorBooking) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Subscription booking not found",
        });
        return;
      }

      if (vendorBooking.status !== "pending") {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Only pending subscriptions can retry payment",
        });
        return;
      }

      const retryResult = await this._subscriptionBookingRepository.retryPayment(bookingId, domainUrl);

      if (!retryResult) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Failed to retry payment. Please check if the subscription is still pending.",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment retry initiated successfully",
        data: retryResult,
      });
    } catch (error) {
    
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to retry payment",
        error: (error as Error).message,
      });
    }
  }
}
