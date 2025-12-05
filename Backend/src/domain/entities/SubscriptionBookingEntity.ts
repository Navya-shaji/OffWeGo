import { ObjectId } from "mongoose";

export interface ISubscriptionBooking {
  _id: ObjectId;

  vendorId: string;
  planId: ObjectId;

  planName: string;
  features?: string[];         

  amount: number;
  currency: string;

  status: "pending" | "active" | "canceled";

  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;

  startDate?: Date;           
  endDate?: Date;       

  duration: number;            

  createdAt?: Date;
  updatedAt?: Date;
}
