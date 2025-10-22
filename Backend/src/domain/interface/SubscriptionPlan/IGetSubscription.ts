import { SubscriptionPlanDto } from "../../dto/Subscription/CreatesubscriptionDto";


export interface IGetSubscriptionUsecase {
  execute(): Promise<SubscriptionPlanDto[] | null>;
}
