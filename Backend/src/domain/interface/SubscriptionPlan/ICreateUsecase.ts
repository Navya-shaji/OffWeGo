import { CreateSubscriptionDTO } from "../../dto/Subscription/CreatesubscriptionDto";
import { SubscriptionPlan } from "../../entities/Subscriptionplan";

export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionDTO): Promise<SubscriptionPlan>;
}
