import { CreateSubscriptionDto } from "../../dto/Subscription/CreateSubscriptionDto";


export interface ICreateSubscriptionUseCase {
  execute(data: CreateSubscriptionDto): Promise<CreateSubscriptionDto>;
}
