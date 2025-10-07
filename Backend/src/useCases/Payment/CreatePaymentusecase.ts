import { PaymentDTO } from "../../domain/dto/Payment/PaymentDto";
import { ICreatePaymentUsecase } from "../../domain/interface/Payment/ICreatePaymentUSecase";
import { IPaymentRepository } from "../../domain/interface/Payment/IPaymentRepository";

export class  CreatePaymentUsecase implements ICreatePaymentUsecase {
     constructor(private  _paymentRepo:IPaymentRepository){}

  async execute(amount: number, currency: string): Promise<PaymentDTO> {
    // ✅ This now returns PaymentDTO with client_secret
    return this._paymentRepo.createPayment(amount, currency);
  }
}