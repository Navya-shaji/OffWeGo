import { Document, model, ObjectId } from "mongoose";
import { ISubscriptionBooking } from "../../../domain/entities/SubscriptionBookingEntity"; 
import { SubscriptionBookingSchema } from "../Schema/SubscriptionBookingSchema"; 

export interface ISubscriptionBookingModel
  extends Omit<ISubscriptionBooking, "id">,
    Document {
  _id: ObjectId;
}

export const subscriptionBookingModel = model<ISubscriptionBookingModel>(
  "SubscriptionBooking",
  SubscriptionBookingSchema
);
