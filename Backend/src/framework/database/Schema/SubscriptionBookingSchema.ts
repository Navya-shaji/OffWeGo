import { Schema } from "mongoose";

export const SubscriptionBookingSchema = new Schema(
  {
    vendorId: { type: String, required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    planName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    status: {
      type: String,
      enum: ["pending", "active", "canceled"],
      default: "pending",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);
