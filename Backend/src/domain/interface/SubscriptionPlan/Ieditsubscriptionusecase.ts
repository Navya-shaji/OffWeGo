import { CreateSubscriptionDTO } from "../../dto/Subscription/CreatesubscriptionDto";

export interface IEditSubscriptionusecase{
    execute(id:string,updatedData:CreateSubscriptionDTO):Promise<CreateSubscriptionDTO|null>
}