import { CreateSubscriptionDTO } from "../../domain/dto/Subscription/CreatesubscriptionDto"; 
import { SubscriptionPlan } from "../../domain/entities/subscriptionplan"; 
import { ISubscriptionPlanRepository } from "../../domain/interface/SubscriptionPlan/ISubscriptionplan"; 

export class CreateSubscriptionPlanUseCase {
  constructor(private readonly _subscriptionRepo: ISubscriptionPlanRepository) {}

  async execute(data: CreateSubscriptionDTO): Promise<SubscriptionPlan> {
    const { name, description, price, durationInDays, commissionRate } = data; 

    if (!name || !description || price <= 0 || durationInDays <= 0 || commissionRate < 0 || commissionRate > 100) {
      throw new Error("Invalid subscription plan details.");
    }

    const plan: SubscriptionPlan = {
      name,
      description,
      price,
      durationInDays,
      commissionRate,
    };

    return await this._subscriptionRepo.create(plan);
  }
}
