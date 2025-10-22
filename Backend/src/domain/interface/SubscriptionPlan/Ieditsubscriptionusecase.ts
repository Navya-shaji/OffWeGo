import { SubscriptionPlanDto } from "../../dto/Subscription/CreatesubscriptionDto";

export interface IEditSubscriptionusecase{
    execute(id:string,updatedData:SubscriptionPlanDto):Promise<SubscriptionPlanDto|null>
}