import { ISubscriptionPlanModel } from "../../framework/database/Models/subscriptionModel";
import { SubscriptionPlan } from "../../domain/entities/subscriptionplan"; 

export const mapToSubscriptionPlanModel = (
  plan: Partial<SubscriptionPlan>
): Partial<ISubscriptionPlanModel> => ({
  name: plan.name,
  description: plan.description,
  price: plan.price,
  durationInDays: plan.durationInDays,
  commissionRate: plan.commissionRate,
});
