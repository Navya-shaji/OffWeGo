import { ISubscriptionPlanModel } from "../../../framework/database/Models/subscriptionModel";
import { SubscriptionPlan } from "../../entities/Subscriptionplan";

export interface ISubscriptionPlanRepository {
  create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  findById(id: string): Promise<SubscriptionPlan | null>;
  findAll(): Promise<SubscriptionPlan[]>;
  update(
    id: string,
    updateData: Partial<SubscriptionPlan>
  ): Promise<SubscriptionPlan | null>;
  delete(id: string): Promise<ISubscriptionPlanModel | null>;
}
