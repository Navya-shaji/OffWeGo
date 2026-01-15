import { CreateSubscriptionDto } from "../../dto/Subscription/CreateSubscriptionDto";


export interface IGetSubscriptionUsecase {
  execute(): Promise<CreateSubscriptionDto[] | null>;
}
