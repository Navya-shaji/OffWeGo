import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBookingSubscriptionUseCase } from "../../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";
import { ISubscriptionBookingRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionBookingRepo";
import { IGetVendorSubscriptionHistoryUseCase } from "../../../domain/interface/SubscriptionPlan/IGetVendorHistory";
import { logErrorToFile } from "../../../framework/Logger/errorLogger";
import { ERROR_MESSAGES } from "../../../constants/messages";

export class SubscriptionBookingController {
  constructor(
    private _createBookingSubscriptionUsecase: ICreateBookingSubscriptionUseCase,
    private _subscriptionBookingRepository: ISubscriptionBookingRepository,
    private _getVendorSubscriptionHistoryUsecase: IGetVendorSubscriptionHistoryUseCase
  ) { }

  async createSubscriptionBooking(req: Request, res: Response): Promise<void> {
    try {
      const { vendorId, planId, date, time } = req.body;

      let baseDomain = process.env.FRONTEND_URL || process.env.DOMAIN_URL || "https://offwego.online";
      if (baseDomain && !baseDomain.startsWith("http")) {
        baseDomain = `https://${baseDomain}`;
      }
      const domainUrl = baseDomain.replace(/\/$/, ""); 

      const result = await this._createBookingSubscriptionUsecase.execute({
        vendorId,
        planId,
        date,
        time,
        domainUrl,
      });

      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      console.error("Subscription Booking Error:", error);

      logErrorToFile({
        message: (error as Error).message,
        stack: (error as Error).stack,
        path: req.originalUrl,
        method: req.method,
        body: req.body,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      });

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: (error as Error).message, 
          error: (error as Error).message
        });
    }
  }

  async getVendorSubscription(req: Request, res: Response): Promise<void> {
    try {

      const vendorId = req.user?.id || req.user?.userId;

      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.VENDOR_NOT_FOUND_TOKEN,
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
          message: ERROR_MESSAGES.VENDOR_NOT_FOUND_TOKEN,
        });
        return;
      }

      const search = req.query.search as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;
      const skip = (page - 1) * limit;

      const result = await this._getVendorSubscriptionHistoryUsecase.execute(vendorId, search, status, skip, limit);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Vendor subscription history fetched successfully",
        data: result.bookings,
        total: result.total,
        page,
        limit
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
          message: ERROR_MESSAGES.VENDOR_NOT_FOUND_TOKEN,
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
      const domainUrl = process.env.FRONTEND_URL || (process.env.DOMAIN_URL ? `https://${process.env.DOMAIN_URL}` : "https://offwego.online");

      if (!vendorId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: ERROR_MESSAGES.VENDOR_NOT_FOUND_TOKEN,
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
        message: ERROR_MESSAGES.SUBSCRIPTION_ERROR,
        error: (error as Error).message,
      });
    }
  }
}
