import { SubscriptionPlan } from "../../entities/subscriptionplan";

export interface IGetSubscriptionUsecase{
    execute():Promise<SubscriptionPlan []|null>
}