import { CreateSubscriptionDTO } from "../../dto/Subscription/createsubscriptionDto";

export interface IEditSubscriptionusecase{
    execute(id:string,updatedData:CreateSubscriptionDTO):Promise<CreateSubscriptionDTO|null>
}