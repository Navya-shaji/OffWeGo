import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVerifyPaymentUseCase } from "../../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";

export class SubscriptionPaymentController {
  constructor(private _verifyPaymentUseCase: IVerifyPaymentUseCase) {}

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, vendorId, planId } = req.body;

      const result = await this._verifyPaymentUseCase.execute({
        sessionId,
        vendorId,
        planId,
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Payment verified successfully",
        data: result.message,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (error as Error).message || "Failed to verify payment",
      });
    }
  }
}
