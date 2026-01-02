import { SubscriptionPlanDto } from "../../dto/Subscription/createsubscriptionDto";

export interface IEditSubscriptionusecase{
    execute(id:string,updatedData:SubscriptionPlanDto):Promise<SubscriptionPlanDto|null>
}