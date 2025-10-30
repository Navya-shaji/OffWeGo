import { VerifyPaymentDTO } from "../../dto/Payment/VerifyPaymentDto";
import { VerifyPaymentResponse } from "../../dto/Payment/VerifyPaymentResponse";

export interface IVerifyPaymentUseCase {
  execute(data: VerifyPaymentDTO): Promise<VerifyPaymentResponse>;
}