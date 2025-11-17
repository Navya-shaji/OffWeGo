import { SubscriptionPlanDto } from "../../domain/dto/Subscription/createsubscriptionDto";
import { IGetSubscriptionUsecase } from "../../domain/interface/SubscriptionPlan/IGetSubscription";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";

export class GetAllSubscription implements IGetSubscriptionUsecase {
  constructor(private _subscriptionRepo: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlanDto[] | null> {
    const result = await this._subscriptionRepo.findAll(); 
    if (!result) return null;
    return result;
  }
}
