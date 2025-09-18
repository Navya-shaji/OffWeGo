import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { CreateSubscriptionPlanUseCase } from "../../../useCases/subscription/CreateSubscriptionusecase";
import { IGetSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IGetSubscription";

export class SubscriptionController {
  constructor(
    private _createSubscriptionPlan: CreateSubscriptionPlanUseCase,
    private _getsubscriptions: IGetSubscriptionUsecase
  ) {}

  async createSubscription(req: Request, res: Response) {
    try {
      const { name, description, price, durationInDays, commissionRate } =
        req.body;

      if (
        !name ||
        !description ||
        price <= 0 ||
        durationInDays <= 0 ||
        commissionRate < 0 ||
        commissionRate > 100
      ) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid subscription plan details",
        });
      }

      const result = await this._createSubscriptionPlan.execute({
        name,
        description,
        price,
        durationInDays,
        commissionRate,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: "Subscription plan created successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create subscription plan",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async getAllSubscriptions(req: Request, res: Response) {
    try {
      const result = await this._getsubscriptions.execute();
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({success:false, message: "failed to get subscriptions",error });
    }
  }
}
