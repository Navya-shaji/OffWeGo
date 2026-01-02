import { SubscriptionPlanDto } from "../../dto/Subscription/createsubscriptionDto";


export interface ICreateSubscriptionPlanUseCase {
  execute(data: SubscriptionPlanDto): Promise<SubscriptionPlanDto>;
}
