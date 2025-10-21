import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { createSubscriptionusecase } from "../../../useCases/subscription/createSubscriptionusecase";
import { IGetSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IGetSubscription";
import { IEditSubscriptionusecase } from "../../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
import { SubscriptionPlanDto } from "../../../domain/dto/Subscription/CreatesubscriptionDto";
// import { IDeleteSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IDeletesubscription";

export class SubscriptionController {
  constructor(
    private _createSubscriptionPlan: createSubscriptionusecase,
    private _getsubscriptions: IGetSubscriptionUsecase,
    private _editSubscription: IEditSubscriptionusecase,
    // private _deletesubscription: IDeleteSubscriptionUsecase
  ) {}

  async createSubscription(req: Request, res: Response) {
    try {
      const { name, price, maxPackages, duration, features } = req.body;

      if (!name || price <= 0 || maxPackages <= 0 || duration <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Invalid subscription plan details",
        });
      }

      const result = await this._createSubscriptionPlan.execute({
        name,
        price,
        maxPackages,
        duration,
        features,
        _id: "",
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
    const result = await this._getsubscriptions.execute();
    res.status(HttpStatus.OK).json(result);
  }

  async updateSubscription(req: Request, res: Response) {
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
  }
  // async deleteDestinationController(req: Request, res: Response) {
  //   const { id } = req.params;
  //   const result = await this._deletesubscription.execute(id);
  //   return res.status(HttpStatus.OK).json(result);
  // }
}
