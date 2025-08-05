import { SubscriptionPlan } from "../../entities/subscriptionplan";

export interface ISubscriptionPlanRepository {
  create(plan: SubscriptionPlan): Promise<SubscriptionPlan>;
  findById(id: string): Promise<SubscriptionPlan | null>;
findAll(): Promise<SubscriptionPlan[]>;
  update(id: string, updateData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null>;
  delete(id: string): Promise<void>;
}