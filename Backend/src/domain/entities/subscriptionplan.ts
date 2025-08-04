import { ObjectId } from "mongoose";
export interface SubscriptionPlan {
  _id?: ObjectId;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  commissionRate: number;
}
