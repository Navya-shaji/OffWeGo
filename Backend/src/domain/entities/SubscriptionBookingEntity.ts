import { ObjectId } from "mongoose";

export interface ISubscriptionBooking {
  _id: ObjectId;

  vendorId: string;
planId: ObjectId;
  

  planName: string;

  date?: string;
  time?: string;

  amount: number;
  currency: string;

  status: "pending" | "active" | "canceled";

  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;

  startDate?: Date;
  endDate?: Date;

  usedPackages?: number;
  maxPackages?: number;
  duration?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
