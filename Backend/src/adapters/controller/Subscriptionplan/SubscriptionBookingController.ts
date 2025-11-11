import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { ICreateBookingSubscriptionUseCase } from "../../../domain/interface/SubscriptionPlan/ICreateBookingSubscriptionUsecase";


export class SubscriptionBookingController {
  constructor(
    private _createBookingSubscription: ICreateBookingSubscriptionUseCase,
   
  ) {}

  async createSubscriptionBooking(req: Request, res: Response): Promise<void> {
    try {
      const { vendorId, planId, date, time } = req.body;
      const domainUrl = process.env.DOMAIN_URL || "https://yourdomain.com";

      const result = await this._createBookingSubscription.execute({
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
}