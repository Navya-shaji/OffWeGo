import { SubscriptionPlan } from "../../entities/Subscriptionplan";

export interface IGetSubscriptionUsecase{
    execute():Promise<SubscriptionPlan []|null>
}