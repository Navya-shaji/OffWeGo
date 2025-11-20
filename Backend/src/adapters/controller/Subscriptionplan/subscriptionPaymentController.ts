import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
import { VerifyPaymentUseCase } from "../../../useCases/subscription/VerifyPaymentUsecase";

export class SubscriptionPaymentController {
  constructor(private verifyPaymentUseCase: VerifyPaymentUseCase) {}

  async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId } = req.body;

      const result = await this.verifyPaymentUseCase.execute(sessionId);
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
