import { ISubscriptionPlanRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { SubscriptionPlan } from "../../../domain/entities/subscriptionplan"; 
import { subscriptionPlanModel } from "../../../framework/database/Models/subscriptionModel"; 
export class SubscriptionPlanRepository implements ISubscriptionPlanRepository {
  async create(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
    const newPlan = await subscriptionPlanModel.create(plan);
    return newPlan.toObject();
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    const plan = await subscriptionPlanModel.findById(id);
    return plan?.toObject() || null;
  }

  async findAll(): Promise<SubscriptionPlan[]> {
    const plans = await subscriptionPlanModel.find();
    return plans.map(p => p.toObject());
  }

  async update(id: string, updateData: Partial<SubscriptionPlan>): Promise<SubscriptionPlan | null> {
    const updated = await subscriptionPlanModel.findByIdAndUpdate(id, updateData, { new: true });
    return updated?.toObject() || null;
  }

  async delete(id: string): Promise<void> {
    await subscriptionPlanModel.findByIdAndDelete(id);
  }
}
