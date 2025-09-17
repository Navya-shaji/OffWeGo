
import { ISubscriptionPlanModel } from "../../framework/database/Models/subscriptionModel";
import { SubscriptionPlan } from "../../domain/entities/Subscriptionplan";

export const mapToSubscriptionPlan = (doc: ISubscriptionPlanModel): SubscriptionPlan => ({
  _id: doc._id,
  name: doc.name,
  description: doc.description,
  price: doc.price,
  durationInDays: doc.durationInDays,
  commissionRate: doc.commissionRate,
});
