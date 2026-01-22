import { ISubscriptionPlanRepository } from "../../../domain/interface/SubscriptionPlan/ISubscriptionplan";
import { ISubscriptionPlan } from "../../../domain/entities/SubscriptionPlan";
import {
  subscriptionPlanModel,
  ISubscriptionPlanModel,
} from "../../../framework/database/Models/subscriptionModel";
import { BaseRepository } from "../BaseRepo/BaseRepo";

export class SubscriptionPlanRepository
  extends BaseRepository<ISubscriptionPlanModel>
  implements ISubscriptionPlanRepository {
  constructor() {
    super(subscriptionPlanModel);
  }

  async getAllSubscriptions() {
    return this.model.find().populate("vendorId").populate("planId");
  }

  async findByName(name: string): Promise<ISubscriptionPlanModel | null> {
    return this.model.findOne({ name }).exec();
  }
}
