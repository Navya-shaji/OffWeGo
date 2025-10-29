import { ObjectId } from "mongoose";

export interface ISubscriptionBooking {
  _id: ObjectId;
  vendorId: string;           
  planId: ObjectId;           
  planName: string;
  date: string;              
  time: string;              
  amount: number;             
  currency: string;          
  status: "pending" | "active" | "canceled";
  startDate?: Date;          
  endDate?: Date;             
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
