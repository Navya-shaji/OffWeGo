import { Document, model, ObjectId } from "mongoose";
import { ISubscriptionPlan } from "../../../domain/entities/subscriptionplan";
import { SubscriptionPlanSchema } from "../Schema/subscriptionSchema";


export interface ISubscriptionPlanModel
  extends Omit<ISubscriptionPlan, "id">,
    Document {
  _id: ObjectId;
}


export const subscriptionPlanModel = model<ISubscriptionPlanModel>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
