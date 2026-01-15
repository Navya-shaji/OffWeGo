import { ISubscriptionPlanModel } from "../../../framework/database/Models/subscriptionModel";
import { ISubscriptionPlan } from "../../entities/SubscriptionPlan";

export interface ISubscriptionPlanRepository {
  create(plan: ISubscriptionPlan): Promise<ISubscriptionPlan>;
  findById(id: string): Promise<ISubscriptionPlan | null>;
  findAll(): Promise<ISubscriptionPlan[]>;
  update(
    id: string,
    updateData: Partial<ISubscriptionPlan>
  ): Promise<ISubscriptionPlan | null>;
  delete(id: string): Promise<ISubscriptionPlanModel | null>;
}
