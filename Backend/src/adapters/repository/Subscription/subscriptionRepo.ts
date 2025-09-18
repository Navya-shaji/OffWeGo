import { ISubscriptionPlanRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { SubscriptionPlan } from "../../../domain/entities/Subscriptionplan";
import {
  subscriptionPlanModel,
  ISubscriptionPlanModel,
} from "../../../framework/database/Models/subscriptionModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";
export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanModel>
  implements ISubscriptionPlanRepository
{
  constructor() {
    super(subscriptionPlanModel);
  }
  async create(
    plan: Partial<ISubscriptionPlanModel>
  ): Promise<ISubscriptionPlanModel> {
    const createdPlan = await this.model.create(plan);
    return createdPlan;
  }

  async findById(id: string): Promise<ISubscriptionPlanModel | null> {
    const plan = await this.model.findById(id).exec();
    return plan;
  }

  async findAll(): Promise<ISubscriptionPlanModel[]> {
    return this.model.find().exec();
  }

  async update(
    id: string,
    updateData: Partial<SubscriptionPlan>
  ): Promise<ISubscriptionPlanModel | null> {
    return subscriptionPlanModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<ISubscriptionPlanModel | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
