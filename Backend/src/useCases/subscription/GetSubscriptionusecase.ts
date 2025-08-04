import { SubscriptionPlan } from "../../domain/entities/subscriptionplan";
import { IGetSubscriptionUsecase } from "../../domain/interface/SubscriptionPlan/IGetSubscription";
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan";

export class GetAllSubscription implements IGetSubscriptionUsecase {
  constructor(private subscriptionrepo: ISubscriptionPlanRepository) {}

  async execute(): Promise<SubscriptionPlan[] | null> {
    const models = await this.subscriptionrepo.findAll(); 
    if (!models) return null;
    return models;
  }
}
