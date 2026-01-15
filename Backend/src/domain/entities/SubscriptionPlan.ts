import { ObjectId } from "mongoose";

export interface ISubscriptionPlan {
  _id: ObjectId;
  name: string;
  price: number;
  duration: number;          
  features: string[];         
  stripePriceId: string;
  isActive: boolean;
}
