import { IPaymentRepository } from "../../../domain/interface/Payment/IPaymentRepository";
import { Payment } from "../../../domain/entities/PaymentEntity";
import { StripeService } from "../../../framework/Services/stripeService";

export class PaymentRepository implements IPaymentRepository {
  constructor(private stripeService: StripeService) {}

  async createPayment(amount: number, currency: string): Promise<Payment> {
    const clientSecret = await this.stripeService.createPaymentIntent(amount);

    return {
      id:"", 
      amount,
      currency,
      status: "pending", 
      client_secret:clientSecret
    };
  }
}
