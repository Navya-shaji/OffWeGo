import { Payment } from "../../entities/PaymentEntity";

export interface IPaymentRepository {
  createPayment(amount: number, currency: string): Promise<Payment>;
}
