import { ICreatePaymentUsecase } from "../../../domain/interface/Payment/ICreatePaymentUSecase"; 
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/Statuscode"; 

export class PaymentController {
  constructor(private _createPayment: ICreatePaymentUsecase) {}

  async createPayment(req: Request, res: Response): Promise<void> {
    const paymentData = req.body;
    console.log(paymentData,"data")
    try {
      const result = await this._createPayment.execute(paymentData.amount, paymentData.currency);
      console.log(result,"res")
      res.status(HttpStatus.CREATED).json({ success: true, payment: result });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: (err as Error).message,
      });
    }
  }
}
