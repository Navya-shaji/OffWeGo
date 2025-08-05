import { CreateSubscriptionDTO } from "../../dto/Subscription/createsubscriptionDto";
import { SubscriptionPlan } from "../../entities/subscriptionplan";

export interface ICreateSubscriptionPlanUseCase {
  execute(data: CreateSubscriptionDTO): Promise<SubscriptionPlan>;
}
