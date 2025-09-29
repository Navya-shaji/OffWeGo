import { Document, model, ObjectId } from "mongoose";
import { SubscriptionPlan } from "../../../domain/entities/Subscriptionplan";
import { SubscriptionPlanSchema } from "../Schema/subscriptionSchema";
export interface ISubscriptionPlanModel extends Omit<SubscriptionPlan, "id">, Document {
  _id: ObjectId;
}


export const subscriptionPlanModel = model<ISubscriptionPlanModel>("SubscriptionPlan", SubscriptionPlanSchema);
