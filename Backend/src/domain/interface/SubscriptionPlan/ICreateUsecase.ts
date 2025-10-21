import { SubscriptionPlanDto } from "../../dto/Subscription/CreatesubscriptionDto";


export interface ICreateSubscriptionPlanUseCase {
  execute(data: SubscriptionPlanDto): Promise<SubscriptionPlanDto>;
}
