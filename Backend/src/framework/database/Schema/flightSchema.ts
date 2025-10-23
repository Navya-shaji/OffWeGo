import { Schema } from "mongoose";

export const flightSchema = new Schema({


  airLine: {
    type: String,
    required: true
  },
  price: {
    economy: { type: Number, required: true },
    premium: { type: Number },   
    business: { type: Number }   
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
