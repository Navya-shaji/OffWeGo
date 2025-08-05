import mongoose, { Schema } from "mongoose";

export const SubscriptionPlanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  commissionRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  durationInDays: {
    type: Number,
    required: true,
    min: 1,
  },
}, {
  timestamps: true,
});
