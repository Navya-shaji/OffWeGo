import { CreateCheckoutSessionDTO } from "../../dto/Subscription/CreateCheckoutSessionDto";

export interface ICreateCheckoutSessionUseCase {
  execute(data: CreateCheckoutSessionDTO): Promise<{
    success: boolean;
    url: string;
    message: string;
  }>;
}