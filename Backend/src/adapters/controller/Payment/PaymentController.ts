import { ICreatePaymentUsecase } from "../../../domain/interface/Payment/ICreatePaymentUSecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode";
export class PaymentController {
  constructor(private _createPayment: ICreatePaymentUsecase) {}

  async createPayment(req: Request, res: Response): Promise<void> {
    const { amount, currency } = req.body;
    
    console.log("Payment data:", { amount, currency });
    
    try {
      const result = await this._createPayment.execute(
        amount,
        currency,
       
      );
      res.status(HttpStatus.CREATED).json({
        success: true,
        client_secret: result.client_secret,
      });
    } catch (err) {
      console.error("Payment error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}