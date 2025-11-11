import { Schema } from "mongoose";

export const SubscriptionPlanSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    maxPackages: {
      type: Number,
      required: true,
      min: 1,
    },

    stripePriceId: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
