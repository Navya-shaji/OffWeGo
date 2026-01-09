import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { IVerifyPaymentUseCase } from "../../../domain/interface/SubscriptionPlan/IVerifyPaymentUsecase";

export class SubscriptionPaymentController {
  constructor(private _verifyPaymentUseCase: IVerifyPaymentUseCase) {}

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, vendorId, planId } = req.body;

      if (!sessionId || !vendorId || !planId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Missing required fields: sessionId, vendorId, or planId",
        });
        return;
      }

      const result = await this._verifyPaymentUseCase.execute({
        sessionId,
        vendorId,
        planId,
      });

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: result.message || "Payment verification failed",
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: result.message || "Payment verified successfully",
        data: result.booking,
      });
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to verify payment";
      
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      if (errorMessage.includes("not found") || errorMessage.includes("not exist")) {
        statusCode = HttpStatus.NOT_FOUND;
      } else if (errorMessage.includes("not verified") || errorMessage.includes("not completed")) {
        statusCode = HttpStatus.BAD_REQUEST;
      }

      res.status(statusCode).json({
        success: false,
        message: errorMessage,
      });
    }
  }
}
