import { PaymentDTO } from "../../dto/Payment/PaymentDto" 

export interface ICreatePaymentUsecase{
     execute(amount: number, currency: string): Promise<PaymentDTO> 
}