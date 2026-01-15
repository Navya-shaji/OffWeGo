import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { CreateSubscriptionUseCase } from "../../../useCases/Subscription/createSubscriptionusecase";
import { IGetSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IGetSubscription";
import { IEditSubscriptionusecase } from "../../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
import { CreateSubscriptionDto } from "../../../domain/dto/Subscription/CreateSubscriptionDto";
import { IDeleteSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IDeletesubscription";
import { IGetSubscriptionBookingUseCase } from "../../../domain/interface/SubscriptionPlan/IGetAllSubscriptionBookingUsecase";
import { IGetVendorSubscriptionHistoryUseCase } from "../../../domain/interface/SubscriptionPlan/IGetVendorHistory";

export class SubscriptionController {
  constructor(
    private _createSubscriptionPlanUsecase: CreateSubscriptionUseCase,
    private _getSubscriptionsUsecase: IGetSubscriptionUsecase,
    private _editSubscriptionUsecase: IEditSubscriptionusecase,
    private _deleteSubscriptionUsecase: IDeleteSubscriptionUsecase,
    private _getSubscriptionBookingsUsecase: IGetSubscriptionBookingUseCase,
    private _getVendorSubscriptionHistoryUsecase: IGetVendorSubscriptionHistoryUseCase
  ) { }

  async createSubscription(req: Request, res: Response) {
    try {
      const { name, price, duration, features, stripePriceId } = req.body;

      const result = await this._createSubscriptionPlanUsecase.execute({
        name,
        price,
        duration,
        features,
        stripePriceId,
      });

      res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Subscription plan created successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create subscription plan",
        error,
      });
    }
  }

  async getAllSubscriptions(req: Request, res: Response) {
    try {
      const result = await this._getSubscriptionsUsecase.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch subscriptions",
        error,
      });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedData: CreateSubscriptionDto = req.body;

      const result = await this._editSubscriptionUsecase.execute(
        id,
        updatedData
      );

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Subscription plan not found",
        });
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription plan updated successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update subscription plan",
        error,
      });
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this._deleteSubscriptionUsecase.execute(id);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription plan deleted successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete subscription plan",
        error,
      });
    }
  }

  async getAllSubscriptionBookings(req: Request, res: Response) {
    try {
      const result = await this._getSubscriptionBookingsUsecase.execute();

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription bookings fetched successfully",
        data: result,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch subscription bookings",
        error,
      });
    }
  }

  async getVendorSubscriptionHistory(req: Request, res: Response) {
    try {
      const vendorId = req.user?.id || req.user?._id;

      if (!vendorId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Vendor ID not found in authentication token",
        });
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
