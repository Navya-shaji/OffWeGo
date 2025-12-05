import { Schema } from "mongoose";

export const SubscriptionBookingSchema = new Schema(
  {
    vendorId: { 
      type: String, 
      required: true, 
      index: true 
    },

    planId: { 
      type: Schema.Types.ObjectId, 
      ref: "SubscriptionPlan", 
      required: true 
    },

    planName: { 
      type: String, 
      required: true 
    },

    features: { 
      type: [String], 
      default: [] 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    currency: { 
      type: String, 
      default: "inr" 
    },

    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },

  
    duration: { 
      type: Number, 
      required: true 
    },

    startDate: { type: Date },
    endDate: { type: Date },

    stripeSubscriptionId: { type: String },
    stripeCustomerId: { type: String },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);
