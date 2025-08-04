
import { ObjectId } from "mongoose"


export interface SubscriptionPlan {
  _id?: ObjectId;
  name: String;
  description: String;
  price: Number;
  durationInDays: Number;
  commissionRate: Number;
}
