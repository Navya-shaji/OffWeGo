import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { CreateSubscriptionUseCase } from "../../../useCases/subscription/createSubscriptionusecase";
import { IGetSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IGetSubscription";
import { IEditSubscriptionusecase } from "../../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
import { SubscriptionPlanDto } from "../../../domain/dto/Subscription/createsubscriptionDto";
import { IDeleteSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IDeletesubscription";
import { IGetSubscriptionBookingUseCase } from "../../../domain/interface/SubscriptionPlan/IGetAllSubscriptionBookingUsecase";

export class SubscriptionController {
  constructor(
    private _createSubscriptionPlan: CreateSubscriptionUseCase,
    private _getsubscriptions: IGetSubscriptionUsecase,
    private _editSubscription: IEditSubscriptionusecase,
    private _deletesubscription: IDeleteSubscriptionUsecase,
    private _getAllSubscriptionBookings: IGetSubscriptionBookingUseCase
  ) {}

  async createSubscription(req: Request, res: Response) {
    try {
      const { name, price, duration, features, stripePriceId } = req.body;

      const result = await this._createSubscriptionPlan.execute({
        name,
        price,
        duration,
        features,
        stripePriceId,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Subscription plan created successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create subscription plan",
      });
    }
  }

  async getAllSubscriptions(req: Request, res: Response) {
    try {
      const result = await this._getsubscriptions.execute();
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch subscriptions",
      });
    }
  }

  async updateSubscription(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updatedData: SubscriptionPlanDto = req.body;

      const result = await this._editSubscription.execute(id, updatedData);

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Subscription plan not found",
        });
      }

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription plan updated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update subscription plan",
      });
    }
  }

  async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this._deletesubscription.execute(id);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription plan deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete subscription plan",
      });
    }
  }
    async getAllSubscriptionBookings(req: Request, res: Response) {
    try {
      const result = await this._getAllSubscriptionBookings.execute();

      return res.status(HttpStatus.OK).json({
        success: true,
        message: "Subscription bookings fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching subscription bookings:", error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch subscription bookings",
      });
    }
  }

}
