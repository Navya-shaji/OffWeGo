import { SubscriptionPlanDto } from "../../dto/Subscription/createsubscriptionDto";


export interface IGetSubscriptionUsecase {
  execute(): Promise<SubscriptionPlanDto[] | null>;
}
