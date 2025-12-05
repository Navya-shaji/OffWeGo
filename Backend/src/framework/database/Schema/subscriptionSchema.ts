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

    features: {
      type: [String],      
      default: [],
      required: false,
    },

    stripePriceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
