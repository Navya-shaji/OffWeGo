import { CreateSubscriptionDto } from "../../domain/dto/Subscription/CreateSubscriptionDto";
import { IGetSubscriptionUsecase } from "../../domain/interface/SubscriptionPlan/IGetSubscription";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";


export class GetAllSubscription implements IGetSubscriptionUsecase {
  constructor(private _subscriptionRepo: ISubscriptionPlanRepository) { }

  async execute(): Promise<CreateSubscriptionDto[] | null> {
    const result = await this._subscriptionRepo.findAll();
    if (!result) return null;
    return result as unknown as CreateSubscriptionDto[]
  }
}
