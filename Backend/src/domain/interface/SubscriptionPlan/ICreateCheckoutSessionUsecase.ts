import { CreateCheckoutSessionDTO } from "../../dto/Subscription/createCheckoutSessionDto";

export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionDTO): Promise<{
    success: boolean;
    url: string;
    message: string;
  }>;
}