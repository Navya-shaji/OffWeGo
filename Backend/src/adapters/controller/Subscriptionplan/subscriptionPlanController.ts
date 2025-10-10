import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { CreateSubscriptionPlanUseCase } from "../../../useCases/subscription/createSubscriptionusecase";
import { IGetSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IGetSubscription";
import { IEditSubscriptionusecase } from "../../../domain/interface/SubscriptionPlan/Ieditsubscriptionusecase";
import { CreateSubscriptionDTO } from "../../../domain/dto/Subscription/createsubscriptionDto";
import { IDeleteSubscriptionUsecase } from "../../../domain/interface/SubscriptionPlan/IDeletesubscription";

export class SubscriptionController {
  constructor(
    private _createSubscriptionPlan: CreateSubscriptionPlanUseCase,
    private _getsubscriptions: IGetSubscriptionUsecase,
    private _editSubscription: IEditSubscriptionusecase,
    private _deletesubscription:IDeleteSubscriptionUsecase
  ) {}

  async createSubscription(req: Request, res: Response) {
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
  }

  async getAllSubscriptions(req: Request, res: Response) {
    const result = await this._getsubscriptions.execute();
    res.status(HttpStatus.OK).json(result);
  }

  async updateSubscription(req: Request, res: Response) {
    const id = req.params.id;
    const updatedData: CreateSubscriptionDTO = req.body;

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
    async deleteDestinationController(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this._deletesubscription.execute(id);
    return res.status(HttpStatus.OK).json(result);
  }
}
